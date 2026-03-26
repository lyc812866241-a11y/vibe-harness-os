import { execSync } from 'child_process';
import pc from 'picocolors';

export class StateManager {
  /**
   * 成功后执行 Git 存档
   */
  save(nodeId) {
    console.log(pc.dim('    [状态机] 正在建立 Git 快照...'));
    try {
      // 检查是否有 git
      execSync('git rev-parse --is-inside-work-tree', { stdio: 'ignore' });
      
      execSync('git add .', { stdio: 'ignore' });
      
      // 只有在有变更时才 commit
      try {
        execSync(`git commit -m "Auto-Save: Node ${nodeId} Success"`, { stdio: 'ignore' });
      } catch (commitErr) {
        // 如果没有需要 commit 的内容，会抛出错误，直接忽略
      }
      
      const tagName = `save_${nodeId}_${Date.now()}`;
      execSync(`git tag ${tagName}`, { stdio: 'ignore' });
      console.log(pc.green(`    [状态机] 物理存档完成! Tag: ${tagName}`));
      
    } catch (e) {
      console.log(pc.yellow(`    [状态机] 未检测到 Git 环境或存档失败，跳过 Git 快照。`));
    }
  }

  /**
   * 读档恢复
   */
  load(tagName) {
    try {
      execSync(`git reset --hard ${tagName}`, { stdio: 'inherit' });
      console.log(pc.green(`\n[VH-OS] 已成功回滚到存档点: ${tagName}`));
    } catch (e) {
      console.error(pc.red(`\n[VH-OS] 读档失败，请检查 Tag 是否存在。`));
    }
  }
}
