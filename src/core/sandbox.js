import fs from 'fs';
import path from 'path';
import pc from 'picocolors';

export class SandboxManager {
  constructor(rootDir, sandboxDirName = '.vh_sandbox') {
    this.rootDir = rootDir;
    this.sandboxDir = path.join(rootDir, sandboxDirName);
  }

  /**
   * 初始化沙盒：清空旧沙盒，并仅拷入当前节点需要的上下文文件
   */
  setup(contextFiles = []) {
    // 1. 清空或创建沙盒
    if (fs.existsSync(this.sandboxDir)) {
      fs.rmSync(this.sandboxDir, { recursive: true, force: true });
    }
    fs.mkdirSync(this.sandboxDir, { recursive: true });

    // 2. 拷贝必要的依赖 (如 package.json, 测试配置等全局必需品)
    // 实际工程中这里可以通过 yaml 配置全局 include，此处做简写
    const globalDeps = ['package.json', 'harness.yaml'];
    for (const dep of globalDeps) {
      const srcPath = path.join(this.rootDir, dep);
      if (fs.existsSync(srcPath)) {
        const destPath = path.join(this.sandboxDir, dep);
        fs.cpSync(srcPath, destPath);
      }
    }

    // 3. 严格按需注入上下文文件 (The Fence)
    for (const file of contextFiles) {
      const srcPath = path.join(this.rootDir, file);
      if (fs.existsSync(srcPath)) {
        const destPath = path.join(this.sandboxDir, file);
        fs.mkdirSync(path.dirname(destPath), { recursive: true });
        fs.cpSync(srcPath, destPath, { recursive: true });
        console.log(pc.dim(`    [沙盒注入] 允许读取: ${file}`));
      } else {
        console.log(pc.yellow(`    [沙盒警告] 上下文文件不存在: ${file}`));
      }
    }
    
    // 必须有测试目录
    const testsDir = path.join(this.rootDir, 'tests');
    if (fs.existsSync(testsDir)) {
      fs.cpSync(testsDir, path.join(this.sandboxDir, 'tests'), { recursive: true });
    }

    return this.sandboxDir;
  }

  /**
   * 测试通过后，将沙盒内的数据同步回主干
   */
  commit() {
    console.log(pc.dim('    [沙盒合入] 正在同步回主项目...'));
    // 简单实现：将沙盒内容拷贝回源目录（需排除 .vh_sandbox 等自身目录）
    // 实际工业级实现应该对比差异或使用 git patch
    fs.cpSync(this.sandboxDir, this.rootDir, { 
      recursive: true, 
      filter: (src) => {
        return !src.includes('.vh_sandbox') && !src.includes('node_modules');
      }
    });
  }
}
