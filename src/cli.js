import { Command } from 'commander';
import pc from 'picocolors';
import fs from 'fs';
import path from 'path';
import { runNode } from './core/runner.js';
import { GCAgent } from './core/gc_agent.js';

const program = new Command();

program
  .name('vh')
  .description('Vibe-Harness-OS: 物理隔离的 Agent 运行引擎')
  .version('1.0.0');

// 如果没有输入任何指令，展示“终局看板” (vh-all 概念)
program.action(() => {
  console.log(pc.cyan(`\n🐎 Vibe-Harness-OS (三阶执行引擎) - 终局控制台\n`));
  console.log(pc.white(`================ 核心指令地图 (The Paddock) ================`));
  console.log(`  ${pc.green('vh onboard')}    -> 🏗️ [基建] 将任何野生/旧项目，一键重塑为“围场自治”标准结构`);
  console.log(`  ${pc.blue('vh run <id>')}   -> ⚙️ [执行] 启动黑盒工厂，拉起沙盒自动完成死循环验证`);
  console.log(`  ${pc.magenta('vh gc')}         -> 🧹 [维护] 唤醒扫地僧，执行代码除垢与文档对齐`);
  console.log(`  ${pc.yellow('vh status')}     -> 📊 [观测] 全域展示：查看最新存档、日志与项目健康度`);
  console.log(pc.white(`============================================================\n`));
  console.log(pc.dim(`输入 'vh --help' 查看详细参数帮助。`));
});

program
  .command('onboard')
  .description('接管旧项目：自动收拢臃肿上下文，生成路由化规则，实现无缝衔接')
  .action(() => {
    console.log(pc.magenta('\n[VH-OS] 🛸 启动项目接管协议 (Project Onboarding)...'));
    const rootDir = process.cwd();
    const docsDir = path.join(rootDir, 'docs');

    if (!fs.existsSync(docsDir)) fs.mkdirSync(docsDir, { recursive: true });
    
    const rulesPath = path.join(rootDir, '.clinerules');
    if (fs.existsSync(rulesPath)) {
      const content = fs.readFileSync(rulesPath, 'utf8');
      if (content.length > 500) {
        fs.writeFileSync(path.join(docsDir, 'legacy_guidelines.md'), content, 'utf8');
        console.log(pc.yellow(`  [诊断] 旧规则过长，已抽离至 -> docs/legacy_guidelines.md`));
      }
    }

    const routerRules = `# --- Vibe-Harness-OS 产线调度法则 ---
## 🎯 你的角色定位
你是 **“系统架构师与产线调度员”**。严禁直接修改业务源码！
## 🗺️ 知识地图 (Router Protocol)
遇到缺失的上下文，严禁瞎猜，必须读取：
- **开发习惯与技巧** -> \`docs/guidelines.md\`
- **数据库表结构** -> \`docs/schema.md\`
- **架构设计** -> \`docs/architecture.md\`
## ⚙️ 标准工作流
1. 分析需求，拆解节点到 \`harness.yaml\`，编写测试。
2. 调用终端：\`vh run <node_id>\`。纯净等待跑通后汇报。`;
    fs.writeFileSync(rulesPath, routerRules, 'utf8');
    console.log(pc.green(`  [重塑] 已注入【极简路由版】 .clinerules`));

    ['tests', '.vh_sandbox'].forEach(d => {
      if (!fs.existsSync(path.join(rootDir, d))) fs.mkdirSync(path.join(rootDir, d));
    });
    
    if (!fs.existsSync(path.join(rootDir, 'harness.yaml'))) {
      fs.writeFileSync(path.join(rootDir, 'harness.yaml'), `version: "1.0"\nsettings:\n  max_retries: 5\nnodes: []`, 'utf8');
    }

    console.log(pc.green('\n[VH-OS] 🎉 接管完毕！野生项目已成功被改造为“三阶围场”标准格式！'));
  });

program
  .command('status')
  .description('全域展示当前项目的沙盒状态与日志')
  .action(() => {
    console.log(pc.blue(`\n📊 [VH-OS] 全域健康度与状态报告`));
    const logPath = path.join(process.cwd(), 'ACTION_LOG.md');
    if (fs.existsSync(logPath)) {
      const logs = fs.readFileSync(logPath, 'utf8');
      const latest = logs.split('---').filter(Boolean).pop();
      console.log(pc.cyan(`\n[最新操作流水]:\n${latest ? latest.trim() : '暂无'}`));
    } else {
      console.log(pc.yellow(`\n[操作流水]: 暂无记录`));
    }
  });

program
  .command('run <node_id>')
  .description('启动黑盒工厂')
  .action(async (node_id) => { await runNode(node_id, process.cwd()); });

program
  .command('gc')
  .description('唤醒旁路扫地僧')
  .action(async () => { const agent = new GCAgent(process.cwd()); await agent.sweep(); });

// 解析参数，如果没带参数就走上面的默认 action
if (process.argv.length === 2) {
  program.parse([...process.argv, '']); // Hack 触发默认 action
} else {
  program.parse(process.argv);
}
