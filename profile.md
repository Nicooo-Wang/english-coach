# 用户能力画像

> 2026-10-14 完成 15 题摸底。之后在日常练习中持续更新。

## 练习偏好

- 每天 8 题
- 反馈极简：只给更 native 的说法和总分，用户提问才展开
- 句子长度：**当前处于阶段 1**（约 15–22 字，一个短背景分句 + 主句；用户觉得 8–15 字太短），升阶段规则见 `AGENTS.md` 5.1

## 整体水平

- 摸底平均分 **2.8 / 5**，15 题中没有一题达到 4.5。
- 按场景：旅行 3.06（8 题）；论文 2.50（7 题）。论文场景明显更弱。
- 按难度：L1 3.75 · L2 3.13 · L3 2.50 · L4 2.38。简单句基本能说对，句子一长、信息一多，就容易漏译、用错词。
- 优势：句子框架意识不错，比如让步 + 诉求（第 13 题）、Although … This might be because …（第 12 题）、条件句（第 7 题），表达的大方向通常是对的。第 14 题语法完全正确。
- 主要短板按影响从大到小排：
  1. **漏译**：几乎每道题都丢了限定词或程度词（好像、以上、默认、今天、至少、往往、手写、高性能、附录）。这些词往往决定了句子的准确性和语气，是语义分丢得最多的地方。
  2. **场景词汇和搭配**：book、connecting flight、upgrade、charge、overbooking；ablation study、module、accuracy、memory access patterns、automate、benchmarks。不会的时候会用直译凑出来。
  3. **论文语域**：容易用 a lot of、That's why、it's still hard、Thanks 等口语表达；rebuttal 不熟悉固定句式。
  4. **语法细节**：冠词和限定词、时态（叙述过去的事用了现在时）、被动语态的分词形式、虚拟语气。

## 每日练习记录

| 日期 | 题数 | 平均分（首次） | 通过率（首次） | 闭环重做 | 主要问题 |
|---|---|---|---|---|---|
| 2026-10-15 | 8 | 3.44 | 0% | 13 次（3 轮） | might + 动词原形（might lost，重做 3 次才改成 might have left）；主谓一致（results shows）；冠词； 仍然漏译关键词（反馈、顾虑、复现）；搭配错（different with、lost 代替 left、safe 说成 secure case）；mind 后接动词原形；把形容词 experimental 当名词用；"很早就到"误解成"到了很久" |

## 摸底得分

| 题号 | 场景 | 难度 | 得分 | 主要问题 |
|---|---|---|---|---|
| 1 | 旅行·酒店入住 | L1 | 4.0 | 订房用了 ordered（应为 booked / have a reservation）；"双人房"译成 a room for two people |
| 2 | 论文·实验设置 | L1 | 3.5 | compared with 缺宾语；漏译"现有的"；benchmark tests 冗余（应为 benchmarks） |
| 3 | 旅行·机场值机 | L2 | 3.0 | 漏译"好像"（缺 hedging）；how to charge 不成问句且视角错误；the overweight part 中式；逗号连接两个句子 |
| 4 | 论文·方法描述 | L2 | 2.5 | Unlike 比较对象错位（rules vs GEAK）；漏译"自动"；"迭代优化"误译成 evolve and evaluate；by feedback 介词不当；human-made rules 应为 hand-crafted |
| 5 | 旅行·酒店投诉 | L2 | 4.0 | after working for half an hour 与"坏了"矛盾；help me fix it 不如 take a look 自然 |
| 6 | 论文·实验结果 | L2 | 3.0 | 漏译"以上""默认"；the kernel 应为复数；most of test cases 缺 the；among 介词误用；two times faster 不如 over 2× speedup |
| 7 | 旅行·航班改签 | L3 | 2.5 | "转机航班"译成 the after flight；is delayed 时态错误；flight provider 应为 airline；give us a place for free 含糊且生硬；漏译"今天" |
| 8 | 论文·消融实验 | L3 | 2.0 | 不会说 ablation study；shows the correctness drop down（缺 that、动词形式错、drop down 冗余）；is take off 被动语态错误；drop 后缺 by；"至关重要"未能表达（letters 疑似语音识别错误，待用户确认） |
| 9 | 旅行·机场免税 | L3 | 3.5 | "听说"译成 I thought；漏译"液体"；I thought I can't 时态未后移；onto the flight 应为 on the plane |
| 10 | 论文·rebuttal | L3 | 2.0 | Thanks for the reviewer 结构错误；agree that（同意观点）误用为 agree to（同意去做）；漏译"宝贵意见""使结论更有说服力""附录"；took our test results 搭配错误；语域偏口语 |
| 11 | 旅行·酒店退房 | L3 | 2.5 | 漏译"迷你吧"（关键信息）；"一笔消费"译成 one thing（应为 charge）；never use 时态错误；help me check 中式 |
| 12 | 论文·局限性 | L4 | 2.0 | 主句结构混乱（it's still hard while ...，应为 struggles with）；memory accessment mode 应为 memory access patterns；"反馈信号"误译成 reflection signal；"不足以"译成 not able；再次出现 most of tasks；缺冠词 |
| 13 | 旅行·超售投诉 | L4 | 2.5 | 再次用 ordered 订航班；overselling 应为 overbooking；not your problem 应为 not your fault；"出发"误译成 go abroad；"升舱"误译成 promotion；three months before 应为 ago / in advance；漏译"至少" |
| 14 | 论文·研究动机 | L4 | 2.5 | "自动化"误译成 generalize；漏译"手写""高性能""往往"；没用 not only … but also；a lot of / That's why 语域偏口语 |
| 15 | 旅行·换房协商 | L4 | 2.5 | 虚拟语气完全没用（If I already know …, I will not …）；第三次用 order 订房；in front of 应为 faces / overlooks；quiet 应为比较级 quieter；Is there any possibility to exchange for 中式；with no extra fees 应为 at no extra charge |

## 薄弱语法点

按优先级排序，括号里是对应的 `grammar/catalog.md` 编号和摸底题号。

1. **Hedging 与情态（G10）**：好像、往往、不足以、可能，不是漏掉就是说得太绝对。（第 3、12、14 题）
2. **委婉请求与许可（G01）**：习惯用 help me + 动词、Is there any possibility to、Can you；不熟悉 Would it be possible to / Would you mind …ing。（第 3、5、11、15 题）
3. **虚拟语气（G03）**：对过去的假设用了真实条件句。（第 15 题）
4. **比较级与程度（G13）**：over 2×、by 15%、quieter、Unlike 的比较对象必须同类。（第 4、6、8、15 题）
5. **时态与完成体（G14）**：叙述已发生的事用了现在时；rebuttal 中"已补充"应该用现在完成时。（第 7、9、10、11 题）
6. **礼貌拒绝与协商 / rebuttal（G20）**：We thank the reviewer for、We agree that … would、we have added … in the appendix。（第 10、13 题）
7. **被动语态（G06）**：is take off。（第 8 题）
8. **冠词与限定词（不单独设语法点，贯穿所有题目，见 `grammar/catalog.md`）**：most of tasks 出现了两次；the kernel / kernels；guide model 缺 the；get promotion 缺 an。（第 6、12、13 题）

## 常见中式表达

| 中式说法 | 地道说法 | 出现次数 |
|---|---|---|
| order a room / flight | book a room / flight | 3（第 1、13、15 题） |
| most of tasks / most of test cases | most tasks / most of the tasks | 2（第 6、12 题） |
| help me check / help me fix / help me order | double-check that for me / take a look / Could you book me … | 3（第 5、11 题；10-15 G01-T-02） |
| the overweight part | excess baggage fee / the extra weight | 1 |
| the after flight | connecting flight | 1 |
| flight provider | airline | 1 |
| give us a place for free | cover the hotel / put us up | 1 |
| not your problem（不是你的责任） | not your fault | 1 |
| promotion（升舱） | upgrade | 1 |
| overselling | overbooking | 1 |
| human-made rules | hand-crafted rules | 1 |
| benchmark tests | benchmarks | 1 |
| generalize（自动化） | automate | 1 |
| memory access mode | memory access patterns | 1 |
| correctness drop down | accuracy drops by … | 1 |
| Thanks for the reviewer | We thank the reviewer for … | 1 |
| Is there any possibility to … | Would it be possible to …? | 1 |
| with no extra fees | at no extra charge | 1 |
| different with | different from / doesn't match | 1（10-15） |
| lost my passport in …（落在） | left my passport in … | 1（10-15） |
| secure case（保险箱） | safe / room safe | 1（10-15） |
| laboratory settings（实验设置） | experimental setup | 1（10-15） |
| the ablation experimental | the ablation results / study | 1（10-15） |
| Do you mind send … | Would you mind sending …? | 1（10-15） |
