import fs from 'fs';
import path from 'path';
import pc from 'picocolors';

export class CustomsLinter {
  /**
   * 海关安检系统 (AST/Regex 前置检查)
   * 返回 { pass: boolean, reason: string }
   */
  check(sandboxDir) {
    console.log(pc.blue(`    [海关安检] 正在扫描沙盒内代码规范...`));
    
    // 递归获取所有 js/ts/py 文件
    const files = this.getAllFiles(sandboxDir).filter(f => 
      !f.includes('node_modules') && 
      (f.endsWith('.js') || f.endsWith('.ts') || f.endsWith('.py'))
    );

    for (const file of files) {
      const content = fs.readFileSync(file, 'utf-8');
      const lines = content.split('\n');

      // 规则 1：单文件行数限制
      if (lines.length > 500) {
        return {
          pass: false,
          reason: `文件 ${path.basename(file)} 超过 500 行 (${lines.length} 行)，存在重构风险，请拆分职责。`
        };
      }

      // 规则 2：简单的单向依赖正则检查 (演示架构防腐)
      // 假设 ui 层不准直接引 db 层
      if (file.includes('ui') && content.match(/import.*db/i)) {
        return {
          pass: false,
          reason: `架构违规: 文件 ${path.basename(file)} (UI 层) 严禁直接跨层引入 DB 模块。`
        };
      }
    }

    console.log(pc.green(`    [海关安检] 架构约束检查通过!`));
    return { pass: true, reason: '' };
  }

  getAllFiles(dirPath, arrayOfFiles = []) {
    const files = fs.readdirSync(dirPath);
    files.forEach(file => {
      const fullPath = path.join(dirPath, file);
      if (fs.statSync(fullPath).isDirectory()) {
        arrayOfFiles = this.getAllFiles(fullPath, arrayOfFiles);
      } else {
        arrayOfFiles.push(fullPath);
      }
    });
    return arrayOfFiles;
  }
}
