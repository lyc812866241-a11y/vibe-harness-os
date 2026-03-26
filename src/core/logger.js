import fs from 'fs';
import path from 'path';
import pc from 'picocolors';

export class BypassLogger {
  constructor(rootDir) {
    this.rootDir = rootDir;
    this.logPath = path.join(rootDir, 'ACTION_LOG.md');
  }

  /**
   * 旁路记录节点成功状态
   * 此操作由框架代替主 Agent 执行，保持主 Agent 上下文绝对纯净
   */
  logSuccess(node) {
    console.log(pc.dim('    [旁路书记员] 正在自动汇总操作记录...'));
    
    if (!fs.existsSync(this.logPath)) {
      fs.writeFileSync(this.logPath, '# VH-OS 自动流水日志\n\n> 旁路生成，主 Agent 不可见\n', 'utf-8');
    }

    const date = new Date().toISOString().replace('T', ' ').substring(0, 19);
    const entry = `
## [${date}] 节点合并: \`${node.id}\`
* **目标任务**: ${node.description}
* **测试断言**: \`${node.test_cmd}\`
* **状态**: ✅ 物理验证通过
* **涉及上下文**: ${node.context.join(', ')}

---`;

    fs.appendFileSync(this.logPath, entry, 'utf-8');
    console.log(pc.dim('    [旁路书记员] 日志已追加至 ACTION_LOG.md'));
  }
}
