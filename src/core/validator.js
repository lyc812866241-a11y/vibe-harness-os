import { exec } from 'child_process';
import pc from 'picocolors';

export class ValidatorEngine {
  /**
   * 在沙盒中执行测试断言脚本
   * @param {string} command 测试命令
   * @param {string} cwd 运行目录（沙盒目录）
   * @returns {Promise<{pass: boolean, log: string}>}
   */
  async runTest(command, cwd) {
    return new Promise((resolve) => {
      console.log(pc.blue(`    [验证执行] 运行断言: ${command}`));
      
      const child = exec(command, { cwd }, (error, stdout, stderr) => {
        const outputLog = `STDOUT:\n${stdout}\n\nSTDERR:\n${stderr}`;
        
        if (error) {
          console.log(pc.red(`    [验证失败] Exit Code: ${error.code}`));
          resolve({
            pass: false,
            log: outputLog
          });
        } else {
          console.log(pc.green(`    [验证通过] 契约执行成功!`));
          resolve({
            pass: true,
            log: outputLog
          });
        }
      });
    });
  }
}
