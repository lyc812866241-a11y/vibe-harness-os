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

program
  .command('init')
  .description('初始化 VH-OS 项目结构（生成 harness.yaml 和 docs 目录）')
  .action(() => {
    console.log(pc.blue('[VH-OS] 正在初始化围场 (The Paddock)...'));
    
    const rootDir = process.cwd();
    
    const dirs = ['docs', 'tests', '.vh_sandbox'];
    dirs.forEach(dir => {
      const dirPath = path.join(rootDir, dir);
      if (!fs.existsSync(dirPath)) {
        fs.mkdirSync(dirPath, { recursive: true });
        console.log(pc.dim(`  创建目录: ${dir}/`));
      }
    });

    const yamlPath = path.join(rootDir, 'harness.yaml');
    if (!fs.existsSync(yamlPath)) {
      const templateYaml = `# Vibe-Harness-OS 节点流转控制配置
version: "1.0"

settings:
  max_retries: 5
  sandbox_dir: ".vh_sandbox"

nodes:
  - id: step01_demo
    description: "完成初始架构的搭建"
    context: 
      - "src/main.js"
    test_cmd: "npm run test:step01"
`;
      fs.writeFileSync(yamlPath, templateYaml, 'utf-8');
      console.log(pc.dim(`  生成文件: harness.yaml`));
    }

    const agentsPath = path.join(rootDir, 'AGENTS.md');
    if (!fs.existsSync(agentsPath)) {
      const templateAgents = `# Agent Navigation Map\n> 寻路雷达\n- **架构** -> \`docs/architecture.md\``;
      fs.writeFileSync(agentsPath, templateAgents, 'utf-8');
      console.log(pc.dim(`  生成文件: AGENTS.md`));
    }

    console.log(pc.green('\n[VH-OS] ✅ 初始化完成！请编辑 harness.yaml 开始定义您的流水线。'));
  });

program
  .command('run <node_id>')
  .description('启动黑盒工厂，执行指定节点的开发与测试')
  .action(async (node_id) => {
    try {
      await runNode(node_id, process.cwd());
    } catch (e) {
      console.error(pc.red(`[VH-OS] 引擎发生严重错误: ${e.message}`));
      process.exit(1);
    }
  });

program
  .command('gc')
  .description('唤醒旁路扫地僧 Agent，执行后台代码熵减与垃圾回收')
  .action(async () => {
    try {
      const agent = new GCAgent(process.cwd());
      await agent.sweep();
    } catch (e) {
      console.error(pc.red(`[VH-OS] GC 运行失败: ${e.message}`));
      process.exit(1);
    }
  });

program.parse(process.argv);
