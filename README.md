# Vibe-Harness-OS (VH-OS)

[English](#english) | [中文](#中文)

---

<h2 id="english">English</h2>

> *"Confining infinite emergence within physical boundaries; replacing reliance on AI alignment with strict mechanical contracts."*

Vibe-Harness-OS (VH-OS) is a **Third-Order Agent Execution Engine** based on the **"Paddock Model"**. It is designed to solve the inherent unpredictability, context overload, and architectural degradation associated with using Large Language Models (LLMs) in complex software engineering projects.

### 🛑 The Problem

As software projects scale, traditional AI coding assistants (like Cursor, Roo Code) inevitably encounter three major bottlenecks:
1. **Context Overload**: Developers attempt to inject massive architectural guidelines and database schemas into `.clinerules` or system prompts. This leads to context window saturation, causing the AI to lose focus and hallucinate.
2. **Unconstrained Execution (Code Avalanches)**: When instructed to "test step-by-step," AI models often ignore constraints due to their generative nature, modifying the entire stack (UI, backend, database) simultaneously. A single error can break the entire application.
3. **Architectural Degradation**: To achieve functional requirements quickly, AI often bypasses architectural layers (e.g., UI directly querying the database), leading to technical debt.

### 🧬 The Three Orders of Agent Engineering

VH-OS represents the evolution of AI engineering methodologies:

*   **1st Order (Prompt-Driven)**: Directly asking the AI to "build a feature." Output is highly unpredictable and debugging is manual.
*   **2nd Order (Harness Engineering)**: Writing exhaustive `.clinerules` to instruct the AI to "follow steps" and "not modify existing logic." **Limitation:** This is merely a "moral constraint." It relies entirely on the AI's adherence to instructions, which frequently fails.
*   **3rd Order (Physical Isolation - VH-OS)**: Abandoning prompt-based constraints in favor of a **runtime sandbox**. The framework physically isolates the execution environment. The AI cannot access the entire codebase, and its output is mechanically blocked from merging unless it passes rigid test assertions.

### 🌟 Core Mechanisms

1. **Router Protocol (Progressive Disclosure)**
   Replaces bloated `.clinerules` with a minimal router index. The main Agent is forced to use `read_file` to fetch specific documentation (e.g., `docs/architecture.md`) only when needed.
2. **Node-based Sandbox & TDD Loop**
   AI-generated code is never merged directly. VH-OS creates an isolated `.vh_sandbox` and executes user-defined test assertions (`test_cmd`). If the test fails, the `stderr` is automatically fed back to the AI in an isolated loop (default: 5 retries) until it passes.
3. **Pre-flight Customs (AST Validation)**
   Even if tests pass, the framework runs AST and regex validations to ensure architectural integrity (e.g., preventing cross-layer imports or excessive file sizes) before allowing a merge to the main branch.
4. **Dual-Agent Observer**
   Upon successful merge, the framework automatically generates a Git snapshot and triggers a bypass agent to update `ACTION_LOG.md`. The main working Agent is never burdened with writing logs, maintaining pure context focus.

### 🚀 Quick Start

**1. Global Installation**
```bash
npm install
sudo npm link
```

**2. Project Onboarding**
Navigate to your existing project repository and run:
```bash
vh onboard
```
*This command automatically normalizes your project into the VH-OS standard structure, isolating legacy rules into `docs/` and generating sandbox environments.*

**3. Execution**
Define your task nodes in `harness.yaml`, then execute:
```bash
vh run <node_id>
```

---

<h2 id="中文">中文</h2>

> *“用物理边界框定涌现能力，用自动化契约替代对 AI 自觉性的依赖。”*

Vibe-Harness-OS (VH-OS) 是一个基于**“围场自治模型 (The Paddock Model)”**设计的**第三阶 Agent 执行引擎**。它旨在从底层解决大语言模型在复杂工程中常见的非预期修改、上下文过载以及架构腐化等核心问题。

### 🛑 研发背景与痛点

在大型项目中使用传统 AI 编程助手时，通常会面临三大瓶颈：
1. **上下文过载**：为确保 AI 理解项目，开发者通常将大量架构规范和表结构堆砌在 `.clinerules` 或系统提示词中，导致 AI 注意力分散，频繁产生幻觉。
2. **非预期修改与失控**：尽管提示词要求“分步执行”，但 AI 常因其生成特性忽略约束，进行全栈式的盲目修改。一旦出现局部错误，极易引发整个项目的结构性瘫痪。
3. **架构防腐失效**：AI 为快速实现功能，往往会破坏既定的软件架构（例如在 UI 层直接发起数据库查询），迅速积累技术债务。

### 🧬 Agent 工程的三阶演进

VH-OS 是 Agent 工程方法论演进的最终形态：

*   **一阶思维 (提示词驱动)**：直接向 AI 提出功能需求。产出极不稳定，完全依赖人类进行事后 Debug。
*   **二阶思维 (规范约束)**：编写详尽的 `.clinerules`，要求 AI“按步骤执行”或“严禁修改核心文件”。**局限性**：这本质上是“道德约束”，完全依赖于 AI 对提示词的服从度，且极易失效。
*   **三阶思维 (物理隔离与固化 - VH-OS)**：放弃通过自然语言约束 AI，转而构建基于底层代码的**物理执行环境**。AI 无法读取全域代码，且其产出必须通过强制的自动化测试，否则物理上禁止合入主干分支。

### 🌟 核心机制

1. **路由协议与渐进式披露 (Router Protocol)**
   废除臃肿的全局规则。系统仅提供极简的目录索引，强制主体 Agent 在需要时通过 `read_file` 工具按需拉取特定文档（如 `docs/architecture.md`），确保上下文纯净。
2. **沙盒环境与测试闭环 (TDD Loop)**
   AI 生成的代码不会直接触碰主干。框架在隐藏的 `.vh_sandbox` 中运行代码并执行用户定义的断言测试 (`test_cmd`)。若测试失败，框架会自动提取 `stderr` 错误日志并返回给 AI 进行沙盒内重试（默认 5 次），直至通过。
3. **海关安检系统 (Pre-flight Customs)**
   测试通过后，框架将在合入前执行基于 AST（抽象语法树）的静态代码扫描，硬性拦截跨层调用或超大文件，保障架构的单向依赖原则。
4. **旁路状态观测 (Dual-Agent Observer)**
   沙盒代码成功合入主干后，框架自动执行 Git 快照存档，并唤醒旁路脚本更新 `ACTION_LOG.md`。主干活的 Agent 无需消耗 Token 记录日志，保持最高纯度的工作专注力。

### 🚀 快速上手

**1. 全局安装**
```bash
npm install
sudo npm link
```

**2. 接入旧项目**
进入您的业务项目根目录，执行以下命令：
```bash
vh onboard
```
*此命令将自动重构当前项目的规则文件，将臃肿的提示词剥离至 `docs/` 目录，并初始化标准的 VH-OS 围场结构。*

**3. 启动节点任务**
在 `harness.yaml` 中配置节点断言要求后，执行：
```bash
vh run <node_id>
```
*引擎将在后台自动完成沙盒隔离、试错闭环与代码合入。*
