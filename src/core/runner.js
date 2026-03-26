import fs from 'fs';
import path from 'path';
import yaml from 'js-yaml';
import pc from 'picocolors';
import { SandboxManager } from './sandbox.js';
import { ValidatorEngine } from './validator.js';
import { CustomsLinter } from './linter.js';
import { StateManager } from './state_manager.js';
import { BypassLogger } from './logger.js';

export async function runNode(nodeId, rootDir) {
  const yamlPath = path.join(rootDir, 'harness.yaml');
  
  if (!fs.existsSync(yamlPath)) {
    console.error(pc.red('[VH-OS] 未找到 harness.yaml，请先执行 vh init'));
    process.exit(1);
  }

  const config = yaml.load(fs.readFileSync(yamlPath, 'utf8'));
  const node = config.nodes.find(n => n.id === nodeId);

  if (!node) {
    console.error(pc.red(`[VH-OS] 在 harness.yaml 中找不到节点: ${nodeId}`));
    process.exit(1);
  }

  console.log(pc.cyan(`\n[VH-OS] =====================================`));
  console.log(pc.cyan(`[VH-OS] 开始执行流水线节点: ${pc.bold(node.id)}`));
  console.log(pc.cyan(`[VH-OS] 节点任务描述: ${node.description}`));
  console.log(pc.cyan(`[VH-OS] =====================================\n`));

  const maxRetries = config.settings?.max_retries || 5;
  const sandbox = new SandboxManager(rootDir, config.settings?.sandbox_dir);
  const validator = new ValidatorEngine();
  const linter = new CustomsLinter();
  const stateManager = new StateManager();
  const logger = new BypassLogger(rootDir);

  // 1. 初始化沙盒并挂档
  sandbox.setup(node.context);

  let attempt = 1;
  let passed = false;
  let errorContext = '';

  // The Ralph Wiggum Loop (黑盒试错死循环)
  while (attempt <= maxRetries && !passed) {
    console.log(pc.yellow(`\n[VH-OS] 尝试回合 (${attempt}/${maxRetries})`));
    
    // 2. 调用大模型 (Stub)
    console.log(pc.dim(`    [Agent 思考] 正在调用 VertexAI 编写/修改代码...`));
    
    // [演示行为] 我们在这里注入一段一定会通过 npm run test:step01 (如果是 node tests/dummy.js) 的行为
    // 我们暂时手动让它在第二次循环时模拟修复
    if (attempt === 2) {
       console.log(pc.magenta(`    [Stub] 模拟 AI 在第 2 次循环成功修好了 Bug。`));
       fs.writeFileSync(path.join(sandbox.sandboxDir, 'tests/dummy.js'), "console.log('Dummy test passed'); process.exit(0);");
    }

    // 3. 机械审判：在沙盒中运行断言
    const testResult = await validator.runTest(node.test_cmd, sandbox.sandboxDir);

    if (!testResult.pass) {
      console.log(pc.red(`    [断言拦截] 测试未通过，提取错误日志注入上下文。`));
      errorContext = testResult.log;
      attempt++;
      continue;
    }

    // 4. 海关拦截：架构静态扫描
    const lintResult = linter.check(sandbox.sandboxDir);
    if (!lintResult.pass) {
      console.log(pc.red(`    [海关拦截] 架构防腐报错: ${lintResult.reason}`));
      errorContext = `Linter Error: ${lintResult.reason}`;
      attempt++;
      continue;
    }

    // 全部通过！
    passed = true;
  }

  // 5. 熔断与放行
  if (passed) {
    console.log(pc.green(`\n[VH-OS] 节点 ${nodeId} 顺利通过所有物理约束检查！`));
    
    sandbox.commit();       // 合入主干
    stateManager.save(node.id);  // 存档 Git Tag
    logger.logSuccess(node); // 旁路记录

    console.log(pc.green(`[VH-OS] 流程闭环，当前控制权已交还人类 Architect。`));
  } else {
    console.log(pc.red(`\n[VH-OS] 警报：连续 ${maxRetries} 次未能通过验证！`));
    console.log(pc.red(`[VH-OS] 物理熔断机制触发，沙盒代码已废弃。请人类介入检查断言脚本或重写节点提示。`));
  }
}
