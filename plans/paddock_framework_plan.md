# 固化的 Harness Engineering (三阶框架) 详细方案

针对实际工程中遇到的“上下文爆炸、AI 暴走忽略约束、心里没底（无法确认功能是否落实/稳定）、缺乏存档/读档机制、操作记录与项目结构混乱”等痛点，我们将“二阶的驾驭思维”固化为**第三阶的自动化 Harness 框架**。

## 一、 核心痛点与三阶框架的解法

| 实际工程痛点 | 二阶思维 (Prompt/人为约束) | 三阶框架固化 (Harness OS) |
| :--- | :--- | :--- |
| **AI 偶尔跑通全流程，不听节点约束** | 告诉 AI：“请一步一步来，不要写后面的代码” (容易失效) | **物理熔断机制**：AI 根本拿不到全流程控制权，框架按 Node 注入上下文，考完一科才发下一科的卷子。 |
| **功能更新后心里没底，怕破坏原有结构** | 靠肉眼 Review 代码，或者让 AI 再检查一遍 | **沙盒与 TDD 强校验**：代码在沙盒运行，必须通过对应节点的自动化测试（Validator），否则禁止合并到主分支。 |
| **需要“存档/读档”保持可回溯性** | 每次手动复制文件夹备份 | **自动化 Git 状态机**：每个节点开始前/通过后，框架自动打 Git Tag。出错一键 `harness rollback`。 |
| **上下文暴增，项目结构不清晰** | 让 AI 重新阅读所有文件 | **自更新的“雷达地图”**：每次节点合并后，脚本自动生成轻量级 `TREE.md` 和架构摘要，作为 AI 的唯一全局视野。 |
| **操作记录机制混乱，污染干活的上下文** | 让干活的 AI 自己写 `LOG.md` (容易遗忘或造假，且增加 Token) | **旁路书记员 (Observer)**：干活的 AI 只管写代码；节点完成后，框架截取 Git Diff 给一个极其便宜的旁路 Agent，由它生成纯粹的客观操作记录。 |

---

## 二、 详细设计方案与运行机制

### 1. 基于 YAML 的节点控制台 (Pipeline 控制权收回)
我们不再用长篇 Prompt 告诉 AI 要做什么，而是通过 `harness.yaml` 定义任务节点：
```yaml
nodes:
  - id: node_1_data_fetch
    validator: tests/test_node_1.py
    context: [src/api.js]
```
**机制**：框架读取 Node 1，拉起 AI。AI 只能看见 `src/api.js`，任务就是让 `test_node_1.py` 跑通。跑通后，**框架主动杀死当前 AI 进程**，向人类汇报请求进入下一节点。

### 2. 存档与读档系统 (Save & Load)
*   **存档 (Save)**：节点开始前自动 `git commit` + `git tag save_node_x`。
*   **读档 (Load)**：一键 `harness load save_node_x` 瞬间恢复干净状态。

### 3. 双轨日志记录机制 (Dual-Track Logging)
*   **机制**：沙盒代码合并时，框架提取 `git diff` 交给旁路轻量模型，生成客观记录追加到 `ACTION_LOG.md`。主干活 AI 看不到这个文件。

### 4. 项目结构自更新雷达 (Auto-Project Map)
*   脚本扫描目录树提取关键导出，生成 `PROJECT_MAP.md`，每次作为 Prompt 顶部注入。

---

## 三、 汲取 OpenAI 实践的进阶补充 (基于最新经验)

通过对比 OpenAI 百万行代码全 AI 生成的工程实践，我们的框架在设计思路上不谋而合（如放弃人类写代码、用工具约束行为），但我们可以将以下机制补充进我们的三阶框架中，使其更具工业级水准：

### 1. 废弃巨型 Prompt，采用“地图 + 结构化文档库” (渐进式披露)
*   **现状痛点**：把所有规则塞进系统提示词，AI 会迷失，开始乱匹配。
*   **框架补充**：建立结构化的 `docs/` 目录（包含架构、规范、方案）。根目录下只保留一个非常简短的 `AGENTS.md`（仅 100 行），它只是一张“地图”（Map），告诉 AI：“关于数据库设计去读 `docs/db.md`，关于架构去读 `docs/architecture.md`”。不给百科全书，只给索引。

### 2. 构建“智能体可读”的反馈回路 (Agent-Readable Observability)
*   **现状痛点**：人类 QA 成为瓶颈，AI 看不到报错的运行时细节。
*   **框架补充**：在沙盒引擎 (`sandbox_runner`) 中，不仅要返回测试的 Pass/Fail，还要将运行时的**错误日志、DOM 快照、甚至简单的性能指标 (Metrics)** 自动抓取，转化为纯文本喂给 AI。让 AI 能像人类一样“看”到运行结果去调试。

### 3. 严格的单向架构约束 (Custom Linter 固化品味)
*   **现状痛点**：AI 容易写出跨层调用的面条代码。
*   **框架补充**：在我们的“海关安检系统”中，硬编码层级依赖关系。例如：强制 `UI` 层只能调用 `Service` 层，绝不能导入 `DB` 层的对象。通过 AST 检查脚本，一旦发现违规越界，直接拦截并要求 AI 重构。把人类的“代码品味”变成无法逾越的死规则。

### 4. 引入“扫地僧”垃圾回收机制 (Garbage Collection Agent)
*   **现状痛点**：代码和文档会随着时间慢慢腐化（熵增），AI 也会模仿已存在的不良代码。
*   **框架补充**：新增一个**后台异步清理脚本 (`gc_agent.js`)**。它的任务不开发新功能，而是定期扫描代码库，根据“黄金法则”寻找 AI 留下的冗余代码（AI 残渣）、未对齐的文档，并自动提交小型的重构 PR。

---

## 四、 最终实施架构图 (Mermaid)

```mermaid
graph TD
    A[Human: Design Rules & harness.yaml] --> B(Coordinator / Runner)
    
    subgraph "1. Progressive Knowledge"
        K[AGENTS.md Map] --> L[docs/ Structured Info]
    end
    
    subgraph "2. The Paddock (Isolated Sandbox)"
        C[Main Agent]
        D[radar_api: Fetch files]
        E[Sandbox Exec]
        M[Agent-Readable Logs/Traces]
        
        C <--> D
        C --> E
        E --> M --> C
    end
    
    B --> K
    B -->|Start Node| C
    
    subgraph "3. Iron Fences (Mechanical Checks)"
        F[Arena: TDD Validators]
        G[Customs: Strict Dependency Linter]
    end
    
    E -->|Submit| F
    F -- Pass --> G
    
    subgraph "4. Host & Background (Entropy Control)"
        H[Main Codebase]
        I[Observer: git diff -> Logs]
        J[GC Agent: Fix Drift & Docs]
        S[Git Tag: Save/Load]
    end
    
    G -- Pass --> S --> H
    H --> I
    H -.-> J