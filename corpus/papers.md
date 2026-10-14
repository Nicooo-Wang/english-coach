# 论文素材库：GPU Kernel Agent 方向

论文类题目从这里取材。出题时把原句改写成该方向的新情境，不要直接让用户翻译原句。

## 来源论文

| 简称 | 标题 | 机构 | 链接 | 一句话概括 |
|---|---|---|---|---|
| GEAK | GEAK: Introducing Triton Kernel AI Agent & Evaluation Benchmarks | AMD | [arXiv:2507.23194](https://arxiv.org/abs/2507.23194) · [GitHub](https://github.com/AMD-AGI/GEAK) | 由 Generator / Evaluator / Reflector / Optimizer 组成的多 Agent 系统，为 MI300X/MI250 生成 Triton kernel；同时发布 TritonBench-revised 和 ROCm Triton 两个 benchmark |
| AVO | AVO: Agentic Variation Operators for Autonomous Evolutionary Search | NVIDIA | [arXiv:2603.24517](https://arxiv.org/abs/2603.24517) | 用自主 coding agent 取代进化搜索中的变异算子，在 B200 上连续进化 7 天，得到的 attention kernel 超过 cuDNN 和 FlashAttention-4 |

延伸阅读（尚未提取素材）：KernelBench、TritonBench、AlphaEvolve、FunSearch、Reflexion、FlashAttention-4。

## 按语法点归类的原句

### G02 条件句
- If the code fails this test, the corresponding error trace is fed back to the Reflector for further analysis. (GEAK)
- If the code continues to fail after reaching this threshold, the agent is required to discard the current approach and generate a new strategy. (GEAK)
- A candidate that fails correctness is assigned zero score regardless of throughput. (AVO)

### G04 定语从句
- …the same bug, which is what we refer to as the debugging trap. (GEAK)
- …Agentic Variation Operators (AVO), in which a self-directed coding agent replaces the mutation and crossover process. (AVO)
- …a blocking memory fence (which stalls until all pending memory writes complete). (AVO)

### G05 分词短语
- Following the setup of FA4, all of our experiments are conducted on NVIDIA B200 GPUs. (AVO)
- Applied to forward-pass attention on NVIDIA Blackwell GPUs, AVO produces kernels surpassing cuDNN by up to 3.5%. (AVO)
- …achieving correctness up to 63% and execution speedup of up to 2.59×. (GEAK)
- …culminating at iter19 with 63.04% call accuracy. (GEAK)

### G06 被动语态
- Experiments are conducted on both MI250 and MI300 GPUs to ensure the findings generalize across hardware generations. (GEAK)
- No task-specific modifications are made to the agent for kernel optimization. (AVO)
- The datasets used for 1-shot prompting do not overlap with the benchmark. (GEAK)

### G07 名词化
- The introduction of the Optimizer module shows the most significant impact on speedup. (GEAK)
- This incorporation of low-level optimization principles significantly improves the accuracy of LLM-generated code. (GEAK)

### G08 对比与让步
- In contrast, our agent can generate Triton code based on both natural language instructions and reference code. (GEAK)
- Rather than confining a language model to candidate generation within a prescribed pipeline, AVO… (AVO)
- While this avoids unnecessary computation, the branch introduces warp synchronization overhead on every iteration. (AVO)
- Although the speedup fluctuates slightly in later iterations, it consistently stays above 1.4×. (GEAK)
- …one-shot prompting results in lower speedup, despite improvements in accuracy. (GEAK)

### G09 因果
- This sharp gain is likely due to early corrections of suboptimal code generations. (GEAK)
- The asymmetry arises because the branchless path applies only to fully unmasked iterations. (AVO)
- …which in turn allowed it to replace a blocking memory fence with a lighter non-blocking fence. (AVO)
- …code that is partially correct may appear to pass—leading to misleading conclusions. (GEAK)

### G10 Hedging
- …suggesting that continued refinement contributes to runtime efficiency as well. (GEAK)
- The agentic operator can in principle be used within archive-based or island-based regimes. (AVO)
- This depth of reasoning suggests that agentic variation operators can serve as an effective mechanism for expert-level kernel optimization. (AVO)

### G11 强调
- What is notable about these optimizations is that each requires jointly reasoning about multiple hardware subsystems. (AVO)
- The Optimizer not only improves the likelihood of generating correct kernels but also helps produce more efficient code. (GEAK)

### G12 形式主语
- It is imperative to automate low-level kernel development to meet performance and productivity demands. (GEAK)

### G13 比较与程度
- …outperforming cuDNN by up to 3.5% and FlashAttention-4 by up to 10.5%. (AVO)
- …more than 3× higher than the baseline. (GEAK)
- This volume of systematic exploration far exceeds what a human engineer could accomplish in the same timeframe. (AVO)
- The cost of an unnecessary multiply-by-one is negligible compared to the synchronization overhead it replaces. (AVO)

### G14 时态与完成体
- The Triton language has emerged as a popular target for AI-generated kernels. (GEAK)
- FlashAttention and cuDNN have pushed attention throughput progressively closer to hardware limits. (AVO)

### G15 目的
- To prevent the agent from getting stuck in a debugging trap, we impose a limit on the number of debugging attempts. (GEAK)
- In this paper we study the single-lineage setting to isolate the effect of the operator itself. (AVO)
- To mitigate both, AVO incorporates a self-supervision mechanism. (AVO)

### G16 名词性从句
- It autonomously decides what to consult, what to edit, and when to evaluate. (AVO)
- To evaluate whether agent-discovered optimizations transfer beyond the benchmark settings… (AVO)

### G17 数量与范围
- 37 out of the 184 kernels had errors while running on AMD GPUs. (GEAK)
- …contains at most six unit tests per kernel. (GEAK)
- …explored over 500 optimization directions and evolved 40 kernel versions. (AVO)
- …requiring approximately 30 minutes of additional autonomous effort. (AVO)

### G18 引用
- Following FlashAttention-4 [10], we control the total number of tokens to 32768. (AVO)
- Recent studies like EvalPlus have shown that augmenting existing test suites… (GEAK)
- We use the same metrics as reported in TritonBench. (GEAK)

### G19 补充与递进
- Alongside GEAK, we release two benchmark suites. (GEAK)
- Moreover, further experiments indicate that combining sequential and parallel scaling yields additional improvements. (GEAK)

### G20 局限与建议
- …leaving population-level branching and archive management to future extensions. (AVO)
- When using narrower test suites, one must report expected test-coverage limitations clearly. (GEAK)
- We strongly recommend using benchmarks with high coverage when evaluating AI-generated kernels. (GEAK)

## 高价值搭配（可以融进任意题目）

| 表达 | 含义 |
|---|---|
| push the frontier of X | 推动 X 的前沿 |
| close the gap between A and B | 缩小 A 与 B 的差距 |
| squeeze out the remaining headroom | 榨干剩余的优化空间 |
| yield diminishing returns | 收益递减 |
| plateau / periods of stagnation | 进入平台期、停滞 |
| be on the critical path | 处在关键路径上 |
| be within measurement noise | 在测量误差范围内 |
| be orthogonal to X | 与 X 正交、互不影响 |
| subsume A, B and C into a single loop | 把 A、B、C 合并进一个循环 |
| be plagued by the same bug | 被同一个 bug 反复困扰 |
| get stuck in a debugging trap | 陷入调试死循环 |
| steer the search toward X | 把搜索引向 X |
| with fresh perspective | 换个思路 |
| transfer readily to X | 很容易迁移到 X |
| provide a substantial lift over the baseline | 相比基线有大幅提升 |
| contribute positively to X | 对 X 有正向贡献 |
| underscore the need for X | 凸显对 X 的需求 |
| the accuracy–performance trade-off under a given compute budget | 给定算力预算下的精度与性能权衡 |
| inform / guide subsequent steps | 指导后续步骤 |
| at the cost of X | 以 X 为代价 |
