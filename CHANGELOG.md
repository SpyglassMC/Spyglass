# [v1.8.4](https://github.com/SPGoding/datapack-language-server/compare/v1.8.3...v1.8.4) (2019-11-16)

## 🐛 Bug Fixes
- [`a0d7ff8`](https://github.com/SPGoding/datapack-language-server/commit/a0d7ff8)  Fix bugs of completions for text components 
- [`20e5335`](https://github.com/SPGoding/datapack-language-server/commit/20e5335)  Complete completions for text components (Issues: [`#155`](https://github.com/SPGoding/datapack-language-server/issues/155))

# [v1.8.3](https://github.com/SPGoding/datapack-language-server/compare/v1.8.2...v1.8.3) (2019-11-16)

## 🐛 Bug Fixes
- [`9d7b2d2`](https://github.com/SPGoding/datapack-language-server/commit/9d7b2d2)  Fix not providing completions for escaped string (Issues: [`#138`](https://github.com/SPGoding/datapack-language-server/issues/138))
- [`3c65a08`](https://github.com/SPGoding/datapack-language-server/commit/3c65a08)  Fix completions for NBT tags and NBT paths (Issues: [`#138`](https://github.com/SPGoding/datapack-language-server/issues/138))

# [v1.8.2](https://github.com/SPGoding/datapack-language-server/compare/v1.8.1...v1.8.2) (2019-11-14)

## 🐛 Bug Fixes
- [`cdfdc64`](https://github.com/SPGoding/datapack-language-server/commit/cdfdc64)  Fix not activating on multi workspaces (Issues: [`#146`](https://github.com/SPGoding/datapack-language-server/issues/146))
- [`fc7e568`](https://github.com/SPGoding/datapack-language-server/commit/fc7e568)  Fix dependency errors (Issues: [`#132`](https://github.com/SPGoding/datapack-language-server/issues/132) [`#133`](https://github.com/SPGoding/datapack-language-server/issues/133))
- [`2029504`](https://github.com/SPGoding/datapack-language-server/commit/2029504)  Fix reporting warning for vanilla namespaced IDs (Issues: [`#148`](https://github.com/SPGoding/datapack-language-server/issues/148))

# [v1.8.1](https://github.com/SPGoding/datapack-language-server/compare/v1.8.0...v1.8.1) (2019-11-14)

## 🐛 Bug Fixes
- [`4cde2b7`](https://github.com/SPGoding/datapack-language-server/commit/4cde2b7)  Fix reporting errors for comments (Issues: [`#136`](https://github.com/SPGoding/datapack-language-server/issues/136))
- [`441e4a9`](https://github.com/SPGoding/datapack-language-server/commit/441e4a9)  Fix not supporting quotes in entity selectors (Issues: [`#139`](https://github.com/SPGoding/datapack-language-server/issues/139))
- [`09a6fe7`](https://github.com/SPGoding/datapack-language-server/commit/09a6fe7)  Make entity selector parser less greedy (Issues: [`#142`](https://github.com/SPGoding/datapack-language-server/issues/142))
- [`f9c9918`](https://github.com/SPGoding/datapack-language-server/commit/f9c9918)  Fix not throwing error for non-vector arguments (Issues: [`#143`](https://github.com/SPGoding/datapack-language-server/issues/143))
- [`bb20a27`](https://github.com/SPGoding/datapack-language-server/commit/bb20a27)  Fix setblock not executable (Issues: [`#145`](https://github.com/SPGoding/datapack-language-server/issues/145))
- [`7c3368d`](https://github.com/SPGoding/datapack-language-server/commit/7c3368d)  Fix completions for NBTs (Issues: [`#132`](https://github.com/SPGoding/datapack-language-server/issues/132))

# [v1.8.0](https://github.com/SPGoding/datapack-language-server/compare/v1.7.0...v1.8.0) (2019-11-13)

## ✨ New Features
- [`8313ec5`](https://github.com/SPGoding/datapack-language-server/commit/8313ec5)  Finish completions for namespaced IDs (Issues: [`#101`](https://github.com/SPGoding/datapack-language-server/issues/101))

## 🐛 Bug Fixes
- [`afd537f`](https://github.com/SPGoding/datapack-language-server/commit/afd537f)  Fix cache updating 
- [`13cb439`](https://github.com/SPGoding/datapack-language-server/commit/13cb439)  Fix weird signature help (Issues: [`#124`](https://github.com/SPGoding/datapack-language-server/issues/124))
- [`e33e937`](https://github.com/SPGoding/datapack-language-server/commit/e33e937)  Fix entity argument parser (Issues: [`#128`](https://github.com/SPGoding/datapack-language-server/issues/128))
- [`62caef8`](https://github.com/SPGoding/datapack-language-server/commit/62caef8)  Remove redundant errors for leading whitespaces (Issues: [`#131`](https://github.com/SPGoding/datapack-language-server/issues/131))
- [`639f370`](https://github.com/SPGoding/datapack-language-server/commit/639f370)  Fix not allowing tags in function command (Issues: [`#134`](https://github.com/SPGoding/datapack-language-server/issues/134))
- [`392187a`](https://github.com/SPGoding/datapack-language-server/commit/392187a)  Fix Pose tag of armor stands (Issues: [`#133`](https://github.com/SPGoding/datapack-language-server/issues/133))

# [v1.7.0](https://github.com/SPGoding/datapack-language-server/compare/v1.6.0...v1.7.0) (2019-11-12)

## ✨ New Features
- [`c85ef42`](https://github.com/SPGoding/datapack-language-server/commit/c85ef42)  Support document links (Issues: [`#73`](https://github.com/SPGoding/datapack-language-server/issues/73))

## 🐛 Bug Fixes
- [`94c9a4d`](https://github.com/SPGoding/datapack-language-server/commit/94c9a4d)  Fix bugs about renaming 
- [`5c633ba`](https://github.com/SPGoding/datapack-language-server/commit/5c633ba)  Fix not parsing count argument in /loot command (Issues: [`#121`](https://github.com/SPGoding/datapack-language-server/issues/121))

# [v1.6.0](https://github.com/SPGoding/datapack-language-server/compare/v1.5.0...v1.6.0) (2019-11-09)

## ✨ New Features
- [`a3a7826`](https://github.com/SPGoding/datapack-language-server/commit/a3a7826)  Support renaming (Issues: [`#71`](https://github.com/SPGoding/datapack-language-server/issues/71) [`#74`](https://github.com/SPGoding/datapack-language-server/issues/74) [`#76`](https://github.com/SPGoding/datapack-language-server/issues/76))

# [v1.5.0](https://github.com/SPGoding/datapack-language-server/compare/v1.4.0...v1.5.0) (2019-11-09)

## ✨ New Features
- [`a14a056`](https://github.com/SPGoding/datapack-language-server/commit/a14a056)  Finish cache 

## 🐛 Bug Fixes
- [`b69c39e`](https://github.com/SPGoding/datapack-language-server/commit/b69c39e)  Fix gamerule and completions (Issues: [`#98`](https://github.com/SPGoding/datapack-language-server/issues/98) [`#99`](https://github.com/SPGoding/datapack-language-server/issues/99))
- [`3fd66c8`](https://github.com/SPGoding/datapack-language-server/commit/3fd66c8)  Fix errors while parsing comments (Issues: [`#99`](https://github.com/SPGoding/datapack-language-server/issues/99))

# [v1.4.0](https://github.com/SPGoding/datapack-language-server/compare/v1.3.0...v1.4.0) (2019-11-06)

## ✨ New Features
- [`882d9f0`](https://github.com/SPGoding/datapack-language-server/commit/882d9f0)  Support color provider (Issues: [`#89`](https://github.com/SPGoding/datapack-language-server/issues/89))

# [v1.3.0](https://github.com/SPGoding/datapack-language-server/compare/v1.2.3...v1.3.0) (2019-11-06)

## ✨ New Features
- [`c5d191d`](https://github.com/SPGoding/datapack-language-server/commit/c5d191d)  Add signature help (Issues: [`#95`](https://github.com/SPGoding/datapack-language-server/issues/95))

# [v1.2.3](https://github.com/SPGoding/datapack-language-server/compare/v1.2.2...v1.2.3) (2019-11-06)

## 🐛 Bug Fixes
- [`6382ac3`](https://github.com/SPGoding/datapack-language-server/commit/6382ac3)  Fix dependencies problems 
- [`3ae2be2`](https://github.com/SPGoding/datapack-language-server/commit/3ae2be2)  Fix not providing completions for block states (Issues: [`#91`](https://github.com/SPGoding/datapack-language-server/issues/91))
- [`1a5f121`](https://github.com/SPGoding/datapack-language-server/commit/1a5f121)  Fix completions for entity selectors (Issues: [`#94`](https://github.com/SPGoding/datapack-language-server/issues/94))

# [v1.2.2](https://github.com/SPGoding/datapack-language-server/compare/v1.2.1...v1.2.2) (2019-11-05)

## 🐛 Bug Fixes
- [`f9dcaa4`](https://github.com/SPGoding/datapack-language-server/commit/f9dcaa4)  Try fixing 
- [`5e7f7b9`](https://github.com/SPGoding/datapack-language-server/commit/5e7f7b9)  Fix a lot 
- [`22e40b8`](https://github.com/SPGoding/datapack-language-server/commit/22e40b8)  Fix tests 
- [`c4e7f25`](https://github.com/SPGoding/datapack-language-server/commit/c4e7f25)  Fix comment 
- [`08dd0a5`](https://github.com/SPGoding/datapack-language-server/commit/08dd0a5)  Fix comments 
- [`64a9151`](https://github.com/SPGoding/datapack-language-server/commit/64a9151)  Fix comment 
- [`8d89e5f`](https://github.com/SPGoding/datapack-language-server/commit/8d89e5f)  Fix a lot

# [v1.2.1](https://github.com/SPGoding/datapack-language-server/compare/v1.2.0...v1.2.1) (2019-11-05)

## 🐛 Bug Fixes
- [`9fdeede`](https://github.com/SPGoding/datapack-language-server/commit/9fdeede)  Try fixing loading bug

# [v1.2.0](https://github.com/SPGoding/datapack-language-server/compare/v1.1.0...v1.2.0) (2019-11-05)

## ✨ New Features
- [`c11aad8`](https://github.com/SPGoding/datapack-language-server/commit/c11aad8)  Add completions and diagnostics sender (Issues: [`#88`](https://github.com/SPGoding/datapack-language-server/issues/88))

# [v1.1.0](https://github.com/SPGoding/datapack-language-server/compare/v1.0.0...v1.1.0) (2019-11-04)

## ✨ New Features
- [`26bd344`](https://github.com/SPGoding/datapack-language-server/commit/26bd344)  Finish FunctionParser 
- [`27c31ac`](https://github.com/SPGoding/datapack-language-server/commit/27c31ac)  Add LiteralParser 
- [`eab6a6a`](https://github.com/SPGoding/datapack-language-server/commit/eab6a6a)  Add StringReader 
- [`1ff4801`](https://github.com/SPGoding/datapack-language-server/commit/1ff4801)  Add DefinitionArgumentParsers 
- [`2885b47`](https://github.com/SPGoding/datapack-language-server/commit/2885b47)  Add combineLocalCache() 
- [`01cd93b`](https://github.com/SPGoding/datapack-language-server/commit/01cd93b)  Close #2 (Issues: [`#2`](https://github.com/SPGoding/datapack-language-server/issues/2) [`#2`](https://github.com/SPGoding/datapack-language-server/issues/2))
- [`8f436ae`](https://github.com/SPGoding/datapack-language-server/commit/8f436ae)  Add NbtTag 
- [`8de7949`](https://github.com/SPGoding/datapack-language-server/commit/8de7949)  Add lint rule &#x27;snbtSortKeys&#x27; 
- [`1f846e7`](https://github.com/SPGoding/datapack-language-server/commit/1f846e7)  Finish NbtSchemaWalker (#6) (Issues: [`#6`](https://github.com/SPGoding/datapack-language-server/issues/6) [`#5`](https://github.com/SPGoding/datapack-language-server/issues/5))
- [`0e1e06c`](https://github.com/SPGoding/datapack-language-server/commit/0e1e06c)  Add new argument &#x27;cursor&#x27; to compute completions (Issues: [`#25`](https://github.com/SPGoding/datapack-language-server/issues/25))
- [`d981f20`](https://github.com/SPGoding/datapack-language-server/commit/d981f20)  Finish all validations in NbtTagArgumentParser (Issues: [`#27`](https://github.com/SPGoding/datapack-language-server/issues/27))
- [`e2b42d0`](https://github.com/SPGoding/datapack-language-server/commit/e2b42d0)  Finish handling suggestion parser redirections 
- [`15d6119`](https://github.com/SPGoding/datapack-language-server/commit/15d6119)  Finish all completions in NbtTagArgumentParser (Issues: [`#28`](https://github.com/SPGoding/datapack-language-server/issues/28))
- [`039f143`](https://github.com/SPGoding/datapack-language-server/commit/039f143)  Finish TagArgumentParser (Issues: [`#41`](https://github.com/SPGoding/datapack-language-server/issues/41))
- [`86a6989`](https://github.com/SPGoding/datapack-language-server/commit/86a6989)  Finish ObjectiveArgumentParser (Issues: [`#42`](https://github.com/SPGoding/datapack-language-server/issues/42))
- [`7caa8d3`](https://github.com/SPGoding/datapack-language-server/commit/7caa8d3)  Add NumericIDArgumentParser (Issues: [`#40`](https://github.com/SPGoding/datapack-language-server/issues/40))
- [`e8b97cf`](https://github.com/SPGoding/datapack-language-server/commit/e8b97cf)  Add NamespacedIDArgumentParser (Issues: [`#39`](https://github.com/SPGoding/datapack-language-server/issues/39))
- [`360be8c`](https://github.com/SPGoding/datapack-language-server/commit/360be8c)  Add TeamArgumentParser (Issues: [`#52`](https://github.com/SPGoding/datapack-language-server/issues/52))
- [`dccb725`](https://github.com/SPGoding/datapack-language-server/commit/dccb725)  Add NumberRangeArgumentParser (Issues: [`#53`](https://github.com/SPGoding/datapack-language-server/issues/53))
- [`63b2345`](https://github.com/SPGoding/datapack-language-server/commit/63b2345)  Add NumberArgumentParser (Issues: [`#19`](https://github.com/SPGoding/datapack-language-server/issues/19))
- [`d871a2d`](https://github.com/SPGoding/datapack-language-server/commit/d871a2d)  Finish EntityArgumentParser (Issues: [`#15`](https://github.com/SPGoding/datapack-language-server/issues/15))
- [`302c5fd`](https://github.com/SPGoding/datapack-language-server/commit/302c5fd)  Finish VectorArgumentParser (Issues: [`#21`](https://github.com/SPGoding/datapack-language-server/issues/21))
- [`11f5f88`](https://github.com/SPGoding/datapack-language-server/commit/11f5f88)  Add ItemSlotArgumentParser (Issues: [`#55`](https://github.com/SPGoding/datapack-language-server/issues/55))
- [`b962246`](https://github.com/SPGoding/datapack-language-server/commit/b962246)  Finish ScoreboardSlotArgumentParser (Issues: [`#59`](https://github.com/SPGoding/datapack-language-server/issues/59))
- [`7b7c1e6`](https://github.com/SPGoding/datapack-language-server/commit/7b7c1e6)  Add ObjectiveCriterionArgumentParser (Issues: [`#57`](https://github.com/SPGoding/datapack-language-server/issues/57))
- [`001a997`](https://github.com/SPGoding/datapack-language-server/commit/001a997)  Add TimeArgumentParser (Issues: [`#61`](https://github.com/SPGoding/datapack-language-server/issues/61))
- [`88d5a58`](https://github.com/SPGoding/datapack-language-server/commit/88d5a58)  Add Block 
- [`627269f`](https://github.com/SPGoding/datapack-language-server/commit/627269f)  Add BlockArgumentParser (Issues: [`#13`](https://github.com/SPGoding/datapack-language-server/issues/13))
- [`87d6dd1`](https://github.com/SPGoding/datapack-language-server/commit/87d6dd1)  Add ItemArgumentParser (Issues: [`#17`](https://github.com/SPGoding/datapack-language-server/issues/17))
- [`3845444`](https://github.com/SPGoding/datapack-language-server/commit/3845444)  Add ParticleArgumentParser (Issues: [`#58`](https://github.com/SPGoding/datapack-language-server/issues/58))
- [`531e56f`](https://github.com/SPGoding/datapack-language-server/commit/531e56f)  Add MessageArgumentParser (Issues: [`#18`](https://github.com/SPGoding/datapack-language-server/issues/18))
- [`f5e0477`](https://github.com/SPGoding/datapack-language-server/commit/f5e0477)  Add NbtPathArgumentParser (Issues: [`#56`](https://github.com/SPGoding/datapack-language-server/issues/56))
- [`214042d`](https://github.com/SPGoding/datapack-language-server/commit/214042d)  Complete the command tree (Issues: [`#48`](https://github.com/SPGoding/datapack-language-server/issues/48))

## 🐛 Bug Fixes
- [`5e964f9`](https://github.com/SPGoding/datapack-language-server/commit/5e964f9)  Fix the performance of parsing spaces 
- [`c9dda2d`](https://github.com/SPGoding/datapack-language-server/commit/c9dda2d)  Fix not quoting boolean-like strings (Issues: [`#30`](https://github.com/SPGoding/datapack-language-server/issues/30))
- [`bc3d47a`](https://github.com/SPGoding/datapack-language-server/commit/bc3d47a)  Fix EntityArgumentParser 

## 🔒 Security Issues
- [`525c377`](https://github.com/SPGoding/datapack-language-server/commit/525c377)  Fix a vulnerability 
- [`93007b1`](https://github.com/SPGoding/datapack-language-server/commit/93007b1)  Fix 3 vulnerabilities 
- [`0743985`](https://github.com/SPGoding/datapack-language-server/commit/0743985)  Fix some vulnerabilities

# v1.0.0 (2019-07-23)

## ✨ New Features
- [`1582f0c`](https://github.com/SPGoding/datapack-language-server/commit/1582f0c)  Write onInitialize() 
- [`b4ec644`](https://github.com/SPGoding/datapack-language-server/commit/b4ec644)  Add more providers
