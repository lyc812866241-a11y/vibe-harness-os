# Vibe-Harness-OS (VH-OS) 🐎

> **“用物理的笼子装下无限的涌现，用冷酷的契约剥夺智能的侥幸。”**

VH-OS 是一个基于 **围场自治模型 (The Paddock Model)** 设计的“三阶 Agent 工程框架”。它不是一个用来聊天的 UI，而是一个运行在底层的**物理隔离执行引擎**。它通过沙盒、TDD 契约、AST 静态防腐扫描，彻底解决大模型在复杂项目中“上下文爆炸、架构腐化、死循环”的痛点。

## 🌟 核心机制 (The 3rd Order Manifesto)

1. **节点沙盒 (Node-based Sandbox)**：剥夺 Agent 全局修改权。它只能在隐藏的 `.vh_sandbox` 中修改特定上下文文件。
2. **黑盒试错 (Ralph Wiggum Loop)**：用 `test_cmd` 设死终点线。Agent 跑不通测试绝不放行，错误日志自动注入死循环，直到 Exit Code 为 0。
3. **海关安检 (Pre-flight Customs)**：代码合入主干前，硬性通过 AST 和正则扫描，防范越层调用与文件过大。
4. **旁路日志与存档 (Dual-Agent Observer)**：合入后自动触发 Git Tag 存档，并由旁路脚本生成客观流水日志，保持主 Agent 上下文绝对纯净。

## 📦 安装与打包

当前作为本地全局工具使用：

```bash
# 在此源码目录下执行
npm install
npm link
```

执行后，您的系统将拥有全局命令：`vh`。

## 🚀 如何在业务项目中使用？

1. 进入您真实的业务项目（例如您的 `AI-Operation-SaaS` 目录）。
2. 在终端执行初始化：
   ```bash
   vh init
   ```
3. 在生成的 `harness.yaml` 中定义您的流水线节点。
4. **Roo Code 融合**：将本框架根目录下的 `.clinerules` 复制到您的业务项目根目录。此时，您的 Roo Code 将觉醒为“架构师”形态。
5. 在 Roo Code 聊天框中提需求，Roo Code 会自动调用底部终端执行 `vh run <node_id>` 完成全自动黑盒试错。

## 🧹 命令一览

* `vh init`: 初始化项目结构（雷达地图、yaml、docs）。
* `vh run <node_id>`: 启动黑盒工厂，拉起 Agent 执行指定节点。
* `vh gc`: 唤醒后台扫地僧，执行熵减清理（检查死代码、漂移文档）。

---
*Built with logic, rigor, and zero-trust for Agent hallucinations.*
