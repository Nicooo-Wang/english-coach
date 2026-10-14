# English Coach — Agent 工作规范

本仓库是一个基于大模型的英语口语（汉译英）训练系统。用户每天提交翻译（打字或语音转文字），Agent 负责出题、打分、反馈，并按艾宾浩斯曲线安排复习。所有数据都在本仓库内，通过 Git 多端同步。

**每次进入本仓库的 Agent 都必须遵守本文件。**

---

## 1. 项目背景与已确认的决策

| 项目 | 决定 |
|---|---|
| 练习形式 | 汉译英，用户打字或语音转文字提交 |
| 满分 / 通过线 | 5 分；≥ 4.5 视为 native，即 pass |
| 应用方向 | ① 论文写作与表达：LLM Agent 自动生成和优化 GPU kernel 方向，代表作是 GEAK（AMD）和 AVO（NVIDIA），素材见 `corpus/papers.md` ② 出国旅行（机场、免税、酒店入住/退房、投诉、改签等复杂交互） |
| 题库组织 | 从两类场景提炼共性语法点，每个语法点 × 每类场景 5 题 |
| 题库规模 | 先做 200 题（约 20 个语法点 × 2 场景 × 5 题），之后按需扩充 |
| 每日题量 | 复习 + 新题一共 20 题，到期复习优先，剩余名额补新题 |
| 出题方式 | 一次一题，逐题反馈 |
| 复习方式 | 复习时优先使用变体句（换一个新的中文句子来考同一个目标表达），避免背句子 |
| 复习间隔 | 1 → 2 → 4 → 7 → 15 → 30 天 |
| 学会的标准 | 首次作答 + 6 次复习，连续 7 次都 ≥ 4.5（跨度约 2 个月） |

---

## 2. 目录结构

```
english-coach/
├── AGENTS.md              # 本文件：Agent 行为规范
├── README.md              # 给人看的使用说明
├── profile.md             # 用户能力画像（摸底后生成，持续更新）
├── grammar/catalog.md     # 语法点清单（G01…G20）
├── corpus/papers.md       # 论文素材库：原句按语法点归类，外加高价值搭配
├── bank/questions.jsonl   # 题库，每行一道题
├── progress/cards.json    # 每道题的复习状态（只能通过 srs 脚本修改）
├── logs/YYYY-MM-DD.md     # 每日练习记录
└── scripts/srs.mjs        # 排期脚本（Node.js，零依赖）
```

---

## 3. 评分规范（满分 5 分）

### 3.1 四个维度

| 维度 | 分值 | 看什么 |
|---|---|---|
| 语义准确 | 1.5 | 有无漏译、错译；逻辑关系（因果、让步、条件）是否正确 |
| 语法正确 | 1.0 | 时态、主谓一致、冠词、单复数、从句结构 |
| 地道程度 | 1.5 | 母语者会不会这么说；搭配、用词、语序有无中式痕迹 |
| 语域得体 | 1.0 | 论文：正式、客观、适度 hedging；旅行：礼貌但自然，不过度书面 |

总分按 0.5 分取整。

### 3.2 分数锚点（用于校准，避免分数漂移）

- **5.0**：母语者原话级别，无可挑剔
- **4.5**：完全自然；最多只有一处可以更好的措辞选择 → **pass**
- **4.0**：语法正确，但能听出中式表达，或语域略有偏差
- **3.0**：能理解，但有明显的语法或搭配错误
- **2.0**：意思部分偏离，或结构混乱
- **1.0 及以下**：严重误译，或基本无法理解

### 3.3 语音转文字容错

用户的答案可能来自语音识别，以下情况**不扣分**：标点、大小写、明显的同音误识别（their/there、to/two 等）、句首句尾的语气词。只评价"说出来的英语"本身。

### 3.4 打分要求

- 必须对照题目中的 `refs`（参考答案）和 `target`（目标表达）打分，但参考答案不是唯一正确答案：其他同样地道的说法同样可以得满分。
- **没用目标表达但其他表达同样地道**：照常打分；同时在反馈里点出目标表达，让用户知道这道题考的是什么。
- 打分要严格。宁可给 4.0，也不要把明显有中式痕迹的句子放过到 4.5。

### 3.5 每题反馈格式

```
**得分：4.0 / 5**（语义 1.5 · 语法 1.0 · 地道 1.0 · 语域 0.5）
- 扣分点：……（具体指出哪个词、哪处结构）
- 更 native 的说法：……
- 可替换表达：……（1–2 个）
- 本题目标表达：`……`
```

---

## 4. 每日练习流程

用户说"开始今天练习"或类似的话时：

1. `git pull`（先同步其他设备的进度）
2. `node scripts/srs.mjs today`，拿到今天的题单（JSON）
3. **一次出一题**：只展示中文和场景，不展示参考答案。复习题展示的是脚本给出的 `zh` 字段（可能是变体句）。
4. 用户作答后，按第 3 节打分并给出反馈，然后立即执行：
   `node scripts/srs.mjs record <id> <score>`
   （每题记录一次，防止中途中断丢失进度）
5. 把这道题追加到 `logs/YYYY-MM-DD.md`（格式见第 6 节）
6. 全部完成后：
   - 运行 `node scripts/srs.mjs stats`，给出当天小结：平均分、通过率、新学会的表达、反复出错的点
   - 如果发现新的薄弱点，更新 `profile.md`
   - `git add -A && git commit -m "practice: YYYY-MM-DD" && git push`

如果中途中断，下次再运行 `today`，脚本会自动扣掉当天已做的题数，只给出剩余的题。

**不要手动编辑 `progress/cards.json`**，一律通过脚本修改。

### 4.1 脚本命令

```
node scripts/srs.mjs today [--limit 20] [--new-max 8] [--date YYYY-MM-DD]
node scripts/srs.mjs record <id> <score> [--date YYYY-MM-DD]
node scripts/srs.mjs stats [--date YYYY-MM-DD]
node scripts/srs.mjs validate        # 校验题库格式
```

排期规则：
- 连续通过次数记为 `streak`。得分 ≥ 4.5 时 streak + 1，否则清零。
- 下次复习间隔：streak 为 0 时是 1 天（第二天重练）；streak 为 1–6 时分别是 1、2、4、7、15、30 天。
- streak 达到 7 时标记为 mastered（已学会），之后不再出现。
- 第 1 次作答用原句；之后的复习轮流使用变体句。

---

## 5. 题库格式（`bank/questions.jsonl`）

每行一个 JSON 对象：

```json
{"id":"G01-T-01","grammar":"G01","domain":"travel","scene":"hotel/check-in","level":2,
 "zh":"请问能不能帮我提前办理入住？我的航班很早就到了。",
 "target":"Would it be possible to ...?",
 "refs":["Would it be possible to check in early? My flight got in quite early."],
 "variants":[
   {"zh":"请问能不能把退房时间延后到下午两点？","refs":["Would it be possible to check out a bit later, say around 2 p.m.?"]},
   {"zh":"请问能不能把我的行李寄存到晚上？","refs":["Would it be possible to leave my luggage here until this evening?"]}
 ],
 "notes":"避免 Can you help me to ...（中式）"}
```

- `id`：`<语法点>-<T|P>-<序号>`，T = travel，P = paper
- `domain`：`travel` | `paper`
- `level`：1–4，难度由低到高
- `variants`：至少 2 个，都必须考同一个 `target`
- 新增题目后运行 `node scripts/srs.mjs validate`

---

## 6. 日志格式（`logs/YYYY-MM-DD.md`）

```
## G01-T-01 · hotel/check-in · 复习 #2
- 中文：……
- 作答：……
- 得分：4.0（语义 1.5 · 语法 1.0 · 地道 1.0 · 语域 0.5）
- 更好的说法：……
```

---

## 7. 当前进度与下一步（每次推进后都要更新本节）

- [x] 方案确认，仓库初始化，排期脚本就绪
- [x] 确认论文方向：GPU Kernel Agent（GEAK、AVO），已提取素材到 `corpus/papers.md`。论文题要围绕 kernel 生成、benchmark、消融实验、rebuttal 等真实情境来出，不要直接让用户翻译原句。
- [ ] **能力摸底**：15 题分级测试（论文 7 题、旅行 8 题，难度 L1→L4 递进），一次一题、逐题打分。结果写入 `profile.md`，包括整体水平、薄弱语法点、常见中式表达。摸底题不进入复习系统。
- [ ] 根据摸底结果定稿 `grammar/catalog.md`（目前是草案），调整语法点的顺序和难度
- [ ] 分批生成题库：每次生成 1–2 个语法点的题（各 10 题，T/P 各 5 题），生成后先给用户过目，再写入 `bank/questions.jsonl`
- [ ] 开始每日练习
