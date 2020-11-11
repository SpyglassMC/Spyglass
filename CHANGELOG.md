# [v3.0.9](https://github.com/SPGoding/datapack-language-server/compare/v3.0.8...v3.0.9) (2020-11-11)

## 🐛 Bug Fixes
- [`e27c993`](https://github.com/SPGoding/datapack-language-server/commit/e27c993)  Fix not executable on *nix; add shebang to bin/server 
- [`e8bf056`](https://github.com/SPGoding/datapack-language-server/commit/e8bf056)  Fix not supporting item modifiers and /item

# [v3.0.8](https://github.com/SPGoding/datapack-language-server/compare/v3.0.7...v3.0.8) (2020-11-10)

## 🐛 Bug Fixes
- [`0623039`](https://github.com/SPGoding/datapack-language-server/commit/0623039)  Fix not completing vanilla structures (Issues: [`#661`](https://github.com/SPGoding/datapack-language-server/issues/661) [`#662`](https://github.com/SPGoding/datapack-language-server/issues/662))
- [`8411c5d`](https://github.com/SPGoding/datapack-language-server/commit/8411c5d)  Fix unable to remove descriptions from #declare (Issues: [`#678`](https://github.com/SPGoding/datapack-language-server/issues/678))
- [`122debe`](https://github.com/SPGoding/datapack-language-server/commit/122debe)  Fix unable to add IMP-Doc to #alias commands (Issues: [`#669`](https://github.com/SPGoding/datapack-language-server/issues/669))

## 🚑 Critical Hotfixes
- [`b9269c9`](https://github.com/SPGoding/datapack-language-server/commit/b9269c9)  Fix crashing when strings in JSON aren&#x27;t closed (Issues: [`#671`](https://github.com/SPGoding/datapack-language-server/issues/671))
- [`364e6a2`](https://github.com/SPGoding/datapack-language-server/commit/364e6a2)  Fix showing errors for Unicode escapes in JSONs (Issues: [`#665`](https://github.com/SPGoding/datapack-language-server/issues/665))

# [v3.0.7](https://github.com/SPGoding/datapack-language-server/compare/v3.0.6...v3.0.7) (2020-10-21)

## 🐛 Bug Fixes
- [`b98a853`](https://github.com/SPGoding/datapack-language-server/commit/b98a853)  Fix parser type of &lt;count&gt; for /particle (Issues: [`#724`](https://github.com/SPGoding/datapack-language-server/issues/724))

# [v3.0.6](https://github.com/SPGoding/datapack-language-server/compare/v3.0.5...v3.0.6) (2020-10-12)

## 🐛 Bug Fixes
- [`1d82110`](https://github.com/SPGoding/datapack-language-server/commit/1d82110)  Fix missing /spawnpoint angle arguments (#716) (Issues: [`#716`](https://github.com/SPGoding/datapack-language-server/issues/716) [`#720`](https://github.com/SPGoding/datapack-language-server/issues/720))

# [v3.0.5](https://github.com/SPGoding/datapack-language-server/compare/v3.0.4...v3.0.5) (2020-10-09)

## 🐛 Bug Fixes
- [`d2993f2`](https://github.com/SPGoding/datapack-language-server/commit/d2993f2)  Fix @within * ** not working 

## 🚑 Critical Hotfixes
- [`eedc19d`](https://github.com/SPGoding/datapack-language-server/commit/eedc19d)  Fix @within wildcards not working (Issues: [`#706`](https://github.com/SPGoding/datapack-language-server/issues/706))

# [v3.0.4](https://github.com/SPGoding/datapack-language-server/compare/v3.0.3...v3.0.4) (2020-10-02)

## 🐛 Bug Fixes
- [`cf530fd`](https://github.com/SPGoding/datapack-language-server/commit/cf530fd)  Optimize validations for various vector ranges (#699) (Issues: [`#699`](https://github.com/SPGoding/datapack-language-server/issues/699) [`#698`](https://github.com/SPGoding/datapack-language-server/issues/698))
- [`e9359b0`](https://github.com/SPGoding/datapack-language-server/commit/e9359b0)  Fix showing align actions for int vectors (#705) (Issues: [`#705`](https://github.com/SPGoding/datapack-language-server/issues/705) [`#704`](https://github.com/SPGoding/datapack-language-server/issues/704))

# [v3.0.3](https://github.com/SPGoding/datapack-language-server/compare/v3.0.2...v3.0.3) (2020-09-26)

## 🐛 Bug Fixes
- [`fec3da0`](https://github.com/SPGoding/datapack-language-server/commit/fec3da0)  Fix crashes related to @mcschema (Issues: [`#700`](https://github.com/SPGoding/datapack-language-server/issues/700))

# [v3.0.2](https://github.com/SPGoding/datapack-language-server/compare/v3.0.1...v3.0.2) (2020-09-26)

## 🐛 Bug Fixes
- [`11d6542`](https://github.com/SPGoding/datapack-language-server/commit/11d6542)  Fix not detecting data packs deeper than 1 (Issues: [`#660`](https://github.com/SPGoding/datapack-language-server/issues/660))
- [`c576b9d`](https://github.com/SPGoding/datapack-language-server/commit/c576b9d)  Fix crashes when selecting JSON version 1.15 (Issues: [`#681`](https://github.com/SPGoding/datapack-language-server/issues/681))
- [`59a4aea`](https://github.com/SPGoding/datapack-language-server/commit/59a4aea)  Fix crashing when @within has meta characters (Issues: [`#670`](https://github.com/SPGoding/datapack-language-server/issues/670))
- [`c8f851b`](https://github.com/SPGoding/datapack-language-server/commit/c8f851b)  Add strictScoreHolderCheck config (#694) (Issues: [`#694`](https://github.com/SPGoding/datapack-language-server/issues/694))

# [v3.0.1](https://github.com/SPGoding/datapack-language-server/compare/v3.0.0...v3.0.1) (2020-08-15)

## 🐛 Bug Fixes
- [`a08e116`](https://github.com/SPGoding/datapack-language-server/commit/a08e116)  Fix not completing customized dimensions (Issues: [`#652`](https://github.com/SPGoding/datapack-language-server/issues/652))
- [`38b4267`](https://github.com/SPGoding/datapack-language-server/commit/38b4267)  Fix structure validations for nbtdoc registry (Issues: [`#654`](https://github.com/SPGoding/datapack-language-server/issues/654))
- [`983ee2e`](https://github.com/SPGoding/datapack-language-server/commit/983ee2e)  Fix obsolete data when cache is updated (Issues: [`#421`](https://github.com/SPGoding/datapack-language-server/issues/421) [`#653`](https://github.com/SPGoding/datapack-language-server/issues/653))
- [`692d8bd`](https://github.com/SPGoding/datapack-language-server/commit/692d8bd)  Fix not supporting noise settings (Issues: [`#655`](https://github.com/SPGoding/datapack-language-server/issues/655))
- [`786bb06`](https://github.com/SPGoding/datapack-language-server/commit/786bb06)  Fix not supporting standalone functions (Issues: [`#656`](https://github.com/SPGoding/datapack-language-server/issues/656))

# [v3.0.0](https://github.com/SPGoding/datapack-language-server/compare/v2.1.14...v3.0.0) (2020-08-14)

## ✨ New Features
- [`18dba51`](https://github.com/SPGoding/datapack-language-server/commit/18dba51)  Provide support for JSONs in datapacks (#528) (Issues: [`#528`](https://github.com/SPGoding/datapack-language-server/issues/528) [`#435`](https://github.com/SPGoding/datapack-language-server/issues/435) [`#594`](https://github.com/SPGoding/datapack-language-server/issues/594) [`#592`](https://github.com/SPGoding/datapack-language-server/issues/592) [`#595`](https://github.com/SPGoding/datapack-language-server/issues/595) [`#593`](https://github.com/SPGoding/datapack-language-server/issues/593) [`#445`](https://github.com/SPGoding/datapack-language-server/issues/445))
- [`36106ea`](https://github.com/SPGoding/datapack-language-server/commit/36106ea)  Treat files as definitions of namespaced IDs (#608) (Issues: [`#608`](https://github.com/SPGoding/datapack-language-server/issues/608) [`#605`](https://github.com/SPGoding/datapack-language-server/issues/605))
- [`b3ad765`](https://github.com/SPGoding/datapack-language-server/commit/b3ad765)  Add nbtArrayLengthCheck and nbtListLengthCheck (Issues: [`#410`](https://github.com/SPGoding/datapack-language-server/issues/410))
- [`568827f`](https://github.com/SPGoding/datapack-language-server/commit/568827f)  Add too-many-block warning for /clone and /fill (Issues: [`#582`](https://github.com/SPGoding/datapack-language-server/issues/582))
- [`33312b5`](https://github.com/SPGoding/datapack-language-server/commit/33312b5)  Fully support text components in commands (Issues: [`#434`](https://github.com/SPGoding/datapack-language-server/issues/434))
- [`e00b9c2`](https://github.com/SPGoding/datapack-language-server/commit/e00b9c2)  Add declaration support 
- [`1aad44c`](https://github.com/SPGoding/datapack-language-server/commit/1aad44c)  Support #declare and #register commands (Issues: [`#597`](https://github.com/SPGoding/datapack-language-server/issues/597) [`#623`](https://github.com/SPGoding/datapack-language-server/issues/623))
- [`0dfe373`](https://github.com/SPGoding/datapack-language-server/commit/0dfe373)  Support hover requests for JSONs 
- [`fc4103e`](https://github.com/SPGoding/datapack-language-server/commit/fc4103e)  Support SwitchNode in minecraft-schemas (Issues: [`#631`](https://github.com/SPGoding/datapack-language-server/issues/631))
- [`75d44e6`](https://github.com/SPGoding/datapack-language-server/commit/75d44e6)  Add quick fix to create non-existent files (Issues: [`#366`](https://github.com/SPGoding/datapack-language-server/issues/366))
- [`2047abd`](https://github.com/SPGoding/datapack-language-server/commit/2047abd)  Support showing hover information for identities (Issues: [`#237`](https://github.com/SPGoding/datapack-language-server/issues/237))
- [`1b3c145`](https://github.com/SPGoding/datapack-language-server/commit/1b3c145)  Support IMP-Doc and access modifiers (Issues: [`#1`](https://github.com/SPGoding/datapack-language-server/issues/1) [`#319`](https://github.com/SPGoding/datapack-language-server/issues/319))
- [`17cd6dc`](https://github.com/SPGoding/datapack-language-server/commit/17cd6dc)  Add datapack.env.defaultVisibility config (Issues: [`#646`](https://github.com/SPGoding/datapack-language-server/issues/646))
- [`d72b791`](https://github.com/SPGoding/datapack-language-server/commit/d72b791)  Allow IMP-Doc to be applied to multiple commands (Issues: [`#647`](https://github.com/SPGoding/datapack-language-server/issues/647))

## 🐛 Bug Fixes
- [`4646b3d`](https://github.com/SPGoding/datapack-language-server/commit/4646b3d)  Fix not completing minecraft:empty loot table (#607) (Issues: [`#607`](https://github.com/SPGoding/datapack-language-server/issues/607) [`#606`](https://github.com/SPGoding/datapack-language-server/issues/606))
- [`d74038f`](https://github.com/SPGoding/datapack-language-server/commit/d74038f)  Fix delay of publishing diagnostics (#609) (Issues: [`#609`](https://github.com/SPGoding/datapack-language-server/issues/609) [`#604`](https://github.com/SPGoding/datapack-language-server/issues/604))
- [`d1705e8`](https://github.com/SPGoding/datapack-language-server/commit/d1705e8)  Improve the error message for quote types (#612) (Issues: [`#612`](https://github.com/SPGoding/datapack-language-server/issues/612) [`#580`](https://github.com/SPGoding/datapack-language-server/issues/580))
- [`8d0754f`](https://github.com/SPGoding/datapack-language-server/commit/8d0754f)  Fix wrong calculation of vector volumes 
- [`8815501`](https://github.com/SPGoding/datapack-language-server/commit/8815501)  Fix ignoring the severity of strictTagCheck (Issues: [`#603`](https://github.com/SPGoding/datapack-language-server/issues/603))
- [`40e7151`](https://github.com/SPGoding/datapack-language-server/commit/40e7151)  Fix decimal places for dust color presentation 
- [`d847395`](https://github.com/SPGoding/datapack-language-server/commit/d847395)  Fix WorkDoneProgress and cache saving (Issues: [`#621`](https://github.com/SPGoding/datapack-language-server/issues/621))
- [`5e9e089`](https://github.com/SPGoding/datapack-language-server/commit/5e9e089)  Fix replacing range of IdentityArgumentParser 
- [`c30e42b`](https://github.com/SPGoding/datapack-language-server/commit/c30e42b)  Fix not providing code snippet completions (Issues: [`#619`](https://github.com/SPGoding/datapack-language-server/issues/619))
- [`5e61660`](https://github.com/SPGoding/datapack-language-server/commit/5e61660)  Fix validation for the block_entity copy source (Issues: [`#590`](https://github.com/SPGoding/datapack-language-server/issues/590))
- [`8d42470`](https://github.com/SPGoding/datapack-language-server/commit/8d42470)  Fix the support for JSON schema&#x27;s MapNode (Issues: [`#589`](https://github.com/SPGoding/datapack-language-server/issues/589))
- [`d10365a`](https://github.com/SPGoding/datapack-language-server/commit/d10365a)  Fix not recognizing minecraft:empty loot table (Issues: [`#606`](https://github.com/SPGoding/datapack-language-server/issues/606))
- [`cb8a3c7`](https://github.com/SPGoding/datapack-language-server/commit/cb8a3c7)  Fix not supporting Sublime Text 
- [`a1675ed`](https://github.com/SPGoding/datapack-language-server/commit/a1675ed)  Fix not showing document links (Issues: [`#638`](https://github.com/SPGoding/datapack-language-server/issues/638))
- [`2dfeeba`](https://github.com/SPGoding/datapack-language-server/commit/2dfeeba)  Fix not showing diagnostic rule for unknown IDs (Issues: [`#534`](https://github.com/SPGoding/datapack-language-server/issues/534))
- [`9fbcbc3`](https://github.com/SPGoding/datapack-language-server/commit/9fbcbc3)  Fix the delay of updating identity hovers (Issues: [`#642`](https://github.com/SPGoding/datapack-language-server/issues/642))
- [`0f12e69`](https://github.com/SPGoding/datapack-language-server/commit/0f12e69)  Fix showing undefined errors for definitions (Issues: [`#643`](https://github.com/SPGoding/datapack-language-server/issues/643))
- [`e1d7567`](https://github.com/SPGoding/datapack-language-server/commit/e1d7567)  Fix folding ranges for IMP-Doc (Issues: [`#648`](https://github.com/SPGoding/datapack-language-server/issues/648))
- [`88a75e7`](https://github.com/SPGoding/datapack-language-server/commit/88a75e7)  Standardize IDs in IMP-Doc @within annotations (Issues: [`#644`](https://github.com/SPGoding/datapack-language-server/issues/644))

## 🚑 Critical Hotfixes
- [`fadac51`](https://github.com/SPGoding/datapack-language-server/commit/fadac51)  Make renaming no longer affect zero-width pos (Issues: [`#650`](https://github.com/SPGoding/datapack-language-server/issues/650))

## 💥 Breaking Changes
- [`af5431a`](https://github.com/SPGoding/datapack-language-server/commit/af5431a)  Re-design API structure

# [v2.1.14](https://github.com/SPGoding/datapack-language-server/compare/v2.1.13...v2.1.14) (2020-07-14)

## 🐛 Bug Fixes
- [`50c8b0f`](https://github.com/SPGoding/datapack-language-server/commit/50c8b0f)  Remove vector range limit from dust particles (#587) (Issues: [`#587`](https://github.com/SPGoding/datapack-language-server/issues/587) [`#576`](https://github.com/SPGoding/datapack-language-server/issues/576))

# [v2.1.13](https://github.com/SPGoding/datapack-language-server/compare/v2.1.12...v2.1.13) (2020-07-09)

## 🐛 Bug Fixes
- [`c0c7116`](https://github.com/SPGoding/datapack-language-server/commit/c0c7116)  Fix not merging all keys in NbtdocHelper (Issues: [`#572`](https://github.com/SPGoding/datapack-language-server/issues/572))

# [v2.1.12](https://github.com/SPGoding/datapack-language-server/compare/v2.1.11...v2.1.12) (2020-07-08)

# [v2.1.11](https://github.com/SPGoding/datapack-language-server/compare/v2.1.10...v2.1.11) (2020-07-07)

## 🐛 Bug Fixes
- [`01739d7`](https://github.com/SPGoding/datapack-language-server/commit/01739d7)  Fix warnings for bossbars in add command (#564) (Issues: [`#564`](https://github.com/SPGoding/datapack-language-server/issues/564) [`#561`](https://github.com/SPGoding/datapack-language-server/issues/561))
- [`ff315aa`](https://github.com/SPGoding/datapack-language-server/commit/ff315aa)  Fix merging tags when compile fallback docs (#565) (Issues: [`#565`](https://github.com/SPGoding/datapack-language-server/issues/565) [`#563`](https://github.com/SPGoding/datapack-language-server/issues/563))
- [`f187fbf`](https://github.com/SPGoding/datapack-language-server/commit/f187fbf)  Fix warning custom compound children in itt (#567) (Issues: [`#567`](https://github.com/SPGoding/datapack-language-server/issues/567) [`#562`](https://github.com/SPGoding/datapack-language-server/issues/562))
- [`e17d279`](https://github.com/SPGoding/datapack-language-server/commit/e17d279)  Fix bad handling of Or doc in NBT paths (#570) (Issues: [`#570`](https://github.com/SPGoding/datapack-language-server/issues/570) [`#566`](https://github.com/SPGoding/datapack-language-server/issues/566))

# [v2.1.10](https://github.com/SPGoding/datapack-language-server/compare/v2.1.9...v2.1.10) (2020-07-06)

## 🐛 Bug Fixes
- [`11d3264`](https://github.com/SPGoding/datapack-language-server/commit/11d3264)  Fix no completions for comments (#559) (Issues: [`#559`](https://github.com/SPGoding/datapack-language-server/issues/559) [`#556`](https://github.com/SPGoding/datapack-language-server/issues/556))
- [`41ee3c6`](https://github.com/SPGoding/datapack-language-server/commit/41ee3c6)  Fix semantic coloring (#560) (Issues: [`#560`](https://github.com/SPGoding/datapack-language-server/issues/560) [`#558`](https://github.com/SPGoding/datapack-language-server/issues/558))

# [v2.1.9](https://github.com/SPGoding/datapack-language-server/compare/v2.1.8...v2.1.9) (2020-07-02)

## 🐛 Bug Fixes
- [`926e7e6`](https://github.com/SPGoding/datapack-language-server/commit/926e7e6)  Fix unknown keys for storage (#555) (Issues: [`#555`](https://github.com/SPGoding/datapack-language-server/issues/555) [`#554`](https://github.com/SPGoding/datapack-language-server/issues/554))

# [v2.1.8](https://github.com/SPGoding/datapack-language-server/compare/v2.1.7...v2.1.8) (2020-07-02)

## 🐛 Bug Fixes
- [`f1d921e`](https://github.com/SPGoding/datapack-language-server/commit/f1d921e)  Fix unexpected-nbt-path-sub warning for null doc (#549) (Issues: [`#549`](https://github.com/SPGoding/datapack-language-server/issues/549) [`#548`](https://github.com/SPGoding/datapack-language-server/issues/548))
- [`d20b61e`](https://github.com/SPGoding/datapack-language-server/commit/d20b61e)  Complete all vanilla keys when type is unknown  (#553) (Issues: [`#553`](https://github.com/SPGoding/datapack-language-server/issues/553) [`#515`](https://github.com/SPGoding/datapack-language-server/issues/515))

# [v2.1.7](https://github.com/SPGoding/datapack-language-server/compare/v2.1.6...v2.1.7) (2020-06-29)

## 🐛 Bug Fixes
- [`cc3514d`](https://github.com/SPGoding/datapack-language-server/commit/cc3514d)  Fix quick fixes destroying integer vectors (#544) (Issues: [`#544`](https://github.com/SPGoding/datapack-language-server/issues/544) [`#543`](https://github.com/SPGoding/datapack-language-server/issues/543))

# [v2.1.6](https://github.com/SPGoding/datapack-language-server/compare/v2.1.5...v2.1.6) (2020-06-28)

## 🐛 Bug Fixes
- [`db524e4`](https://github.com/SPGoding/datapack-language-server/commit/db524e4)  Fix not logging errors thrown by executeCommand (#537) (Issues: [`#537`](https://github.com/SPGoding/datapack-language-server/issues/537) [`#536`](https://github.com/SPGoding/datapack-language-server/issues/536))
- [`89ba2d3`](https://github.com/SPGoding/datapack-language-server/commit/89ba2d3)  Fix not aborting progress when there are errors (#541) (Issues: [`#541`](https://github.com/SPGoding/datapack-language-server/issues/541) [`#538`](https://github.com/SPGoding/datapack-language-server/issues/538))
- [`62c0e7d`](https://github.com/SPGoding/datapack-language-server/commit/62c0e7d)  Fix ENOENT when fixing all in workspace (#542) (Issues: [`#542`](https://github.com/SPGoding/datapack-language-server/issues/542) [`#539`](https://github.com/SPGoding/datapack-language-server/issues/539))
- [`2317958`](https://github.com/SPGoding/datapack-language-server/commit/2317958)  Fix bugs about loading info

# [v2.1.5](https://github.com/SPGoding/datapack-language-server/compare/v2.1.4...v2.1.5) (2020-06-28)

## 🐛 Bug Fixes
- [`74b0dc8`](https://github.com/SPGoding/datapack-language-server/commit/74b0dc8)  Fix lag of workspace code actions

# [v2.1.4](https://github.com/SPGoding/datapack-language-server/compare/v2.1.3...v2.1.4) (2020-06-28)

## 🐛 Bug Fixes
- [`2f338b6`](https://github.com/SPGoding/datapack-language-server/commit/2f338b6)  Fix low performance of handling requests

# [v2.1.3](https://github.com/SPGoding/datapack-language-server/compare/v2.1.2...v2.1.3) (2020-06-28)

## 🐛 Bug Fixes
- [`63156fb`](https://github.com/SPGoding/datapack-language-server/commit/63156fb)  Fix not providing any support sometimes

# [v2.1.2](https://github.com/SPGoding/datapack-language-server/compare/v2.1.1...v2.1.2) (2020-06-26)

## 🐛 Bug Fixes
- [`aa1fe93`](https://github.com/SPGoding/datapack-language-server/commit/aa1fe93)  Fix throwing tolerable error for invalid numbers (#532) (Issues: [`#532`](https://github.com/SPGoding/datapack-language-server/issues/532) [`#529`](https://github.com/SPGoding/datapack-language-server/issues/529))
- [`9a03114`](https://github.com/SPGoding/datapack-language-server/commit/9a03114)  Fix not showing document links on startup (#533) (Issues: [`#533`](https://github.com/SPGoding/datapack-language-server/issues/533) [`#530`](https://github.com/SPGoding/datapack-language-server/issues/530))

# [v2.1.1](https://github.com/SPGoding/datapack-language-server/compare/v2.1.0...v2.1.1) (2020-06-26)

## 🐛 Bug Fixes
- [`9ae025a`](https://github.com/SPGoding/datapack-language-server/commit/9ae025a)  Fix not coloring values inside strings (#511) (Issues: [`#511`](https://github.com/SPGoding/datapack-language-server/issues/511) [`#436`](https://github.com/SPGoding/datapack-language-server/issues/436))
- [`aac178d`](https://github.com/SPGoding/datapack-language-server/commit/aac178d)  Fix getNbtdocRegistryId from storage IDs (#521) (Issues: [`#521`](https://github.com/SPGoding/datapack-language-server/issues/521) [`#512`](https://github.com/SPGoding/datapack-language-server/issues/512))
- [`100bca4`](https://github.com/SPGoding/datapack-language-server/commit/100bca4)  Fix not keeping diagnostics for closed documents (#522) (Issues: [`#522`](https://github.com/SPGoding/datapack-language-server/issues/522) [`#517`](https://github.com/SPGoding/datapack-language-server/issues/517))
- [`19581c9`](https://github.com/SPGoding/datapack-language-server/commit/19581c9)  Fix completions for chat components (#523) (Issues: [`#523`](https://github.com/SPGoding/datapack-language-server/issues/523) [`#513`](https://github.com/SPGoding/datapack-language-server/issues/513))
- [`34f50a7`](https://github.com/SPGoding/datapack-language-server/commit/34f50a7)  Fix allowing floats in block positions (#524) (Issues: [`#524`](https://github.com/SPGoding/datapack-language-server/issues/524) [`#520`](https://github.com/SPGoding/datapack-language-server/issues/520))
- [`6e2dac8`](https://github.com/SPGoding/datapack-language-server/commit/6e2dac8)  Fix completing THIS under unrelevant categories (#525) (Issues: [`#525`](https://github.com/SPGoding/datapack-language-server/issues/525) [`#516`](https://github.com/SPGoding/datapack-language-server/issues/516))
- [`8f8dd1e`](https://github.com/SPGoding/datapack-language-server/commit/8f8dd1e)  Fix annoying warnings for unknown keys in NBTs (#526) (Issues: [`#526`](https://github.com/SPGoding/datapack-language-server/issues/526) [`#515`](https://github.com/SPGoding/datapack-language-server/issues/515))
- [`50f5dd5`](https://github.com/SPGoding/datapack-language-server/commit/50f5dd5)  Fix loading wrong info for non-opened documents (#527) (Issues: [`#527`](https://github.com/SPGoding/datapack-language-server/issues/527) [`#519`](https://github.com/SPGoding/datapack-language-server/issues/519))

# [v2.1.0](https://github.com/SPGoding/datapack-language-server/compare/v2.0.4...v2.1.0) (2020-06-24)

## ✨ New Features
- [`3b55b15`](https://github.com/SPGoding/datapack-language-server/commit/3b55b15)  Add new env.language config (Issues: [`#481`](https://github.com/SPGoding/datapack-language-server/issues/481))
- [`4f9a9ea`](https://github.com/SPGoding/datapack-language-server/commit/4f9a9ea)  Complete &#x27;THIS&#x27; for identities (Issues: [`#402`](https://github.com/SPGoding/datapack-language-server/issues/402))
- [`935258c`](https://github.com/SPGoding/datapack-language-server/commit/935258c)  Complete &#x27;RANDOM&#x27; for UUIDs (Issues: [`#440`](https://github.com/SPGoding/datapack-language-server/issues/440))
- [`c197192`](https://github.com/SPGoding/datapack-language-server/commit/c197192)  Add fix-all code actions (#509) (Issues: [`#509`](https://github.com/SPGoding/datapack-language-server/issues/509) [`#504`](https://github.com/SPGoding/datapack-language-server/issues/504))
- [`65bf362`](https://github.com/SPGoding/datapack-language-server/commit/65bf362)  Add an action to convert Zombified Piglin&#x27;s ID (#510) (Issues: [`#510`](https://github.com/SPGoding/datapack-language-server/issues/510) [`#508`](https://github.com/SPGoding/datapack-language-server/issues/508))

## 🐛 Bug Fixes
- [`b12061d`](https://github.com/SPGoding/datapack-language-server/commit/b12061d)  Fix TypeError in getVanillaData (Issues: [`#480`](https://github.com/SPGoding/datapack-language-server/issues/480))
- [`7871d10`](https://github.com/SPGoding/datapack-language-server/commit/7871d10)  Fix worldborder add showing an error for negative values (#484) (Issues: [`#484`](https://github.com/SPGoding/datapack-language-server/issues/484) [`#483`](https://github.com/SPGoding/datapack-language-server/issues/483))
- [`d3ff235`](https://github.com/SPGoding/datapack-language-server/commit/d3ff235)  Rename attribute registry to singular (Issues: [`#489`](https://github.com/SPGoding/datapack-language-server/issues/489))
- [`46d8b29`](https://github.com/SPGoding/datapack-language-server/commit/46d8b29)  Fix not completing NBT for certain selectors (Issues: [`#482`](https://github.com/SPGoding/datapack-language-server/issues/482))
- [`8c55765`](https://github.com/SPGoding/datapack-language-server/commit/8c55765)  Fix resolving Registry Supers incorrectly (Issues: [`#494`](https://github.com/SPGoding/datapack-language-server/issues/494))
- [`417f4a4`](https://github.com/SPGoding/datapack-language-server/commit/417f4a4)  Fix not resolve Index nbtdoc (Issues: [`#448`](https://github.com/SPGoding/datapack-language-server/issues/448) [`#487`](https://github.com/SPGoding/datapack-language-server/issues/487))
- [`49666bb`](https://github.com/SPGoding/datapack-language-server/commit/49666bb)  Fix not allowing multiple spaces in vectors (Issues: [`#500`](https://github.com/SPGoding/datapack-language-server/issues/500))
- [`12656f7`](https://github.com/SPGoding/datapack-language-server/commit/12656f7)  Fix showing deleted definitions in completions (Issues: [`#458`](https://github.com/SPGoding/datapack-language-server/issues/458))
- [`4db95b5`](https://github.com/SPGoding/datapack-language-server/commit/4db95b5)  Fix no completions for NBT in selectors w/o type (#507) (Issues: [`#507`](https://github.com/SPGoding/datapack-language-server/issues/507))

# [v2.0.4](https://github.com/SPGoding/datapack-language-server/compare/v2.0.3...v2.0.4) (2020-05-22)

## 🐛 Bug Fixes
- [`75963a3`](https://github.com/SPGoding/datapack-language-server/commit/75963a3)  Fix completions for dimension types (Issues: [`#475`](https://github.com/SPGoding/datapack-language-server/issues/475))

# [v2.0.3](https://github.com/SPGoding/datapack-language-server/compare/v2.0.2...v2.0.3) (2020-05-21)

## 🐛 Bug Fixes
- [`a234486`](https://github.com/SPGoding/datapack-language-server/commit/a234486)  Support new command syntax of 20w21a

# [v2.0.2](https://github.com/SPGoding/datapack-language-server/compare/v2.0.1...v2.0.2) (2020-05-17)

## 🐛 Bug Fixes
- [`40e33d3`](https://github.com/SPGoding/datapack-language-server/commit/40e33d3)  Fix Request textDocument/codeAction failed (Issues: [`#467`](https://github.com/SPGoding/datapack-language-server/issues/467))

# [v2.0.1](https://github.com/SPGoding/datapack-language-server/compare/v2.0.0...v2.0.1) (2020-05-14)

# [v2.0.0](https://github.com/SPGoding/datapack-language-server/compare/v1.13.8...v2.0.0) (2020-04-27)

# [v1.13.8](https://github.com/SPGoding/datapack-language-server/compare/v1.13.7...v1.13.8) (2020-03-19)

## 🐛 Bug Fixes
- [`22c0907`](https://github.com/SPGoding/datapack-language-server/commit/22c0907)  Fix crashing for missing namespaces in #define

# [v1.13.7](https://github.com/SPGoding/datapack-language-server/compare/v1.13.6...v1.13.7) (2020-03-10)

## 🐛 Bug Fixes
- [`8d5a3fc`](https://github.com/SPGoding/datapack-language-server/commit/8d5a3fc)  Fix crashing when encountering invalid rel

# [v1.13.6](https://github.com/SPGoding/datapack-language-server/compare/v1.13.5...v1.13.6) (2020-02-28)

## 🐛 Bug Fixes
- [`3f6b84d`](https://github.com/SPGoding/datapack-language-server/commit/3f6b84d)  Fix treating the forth element in dust as alpha (Issues: [`#350`](https://github.com/SPGoding/datapack-language-server/issues/350))
- [`531f13d`](https://github.com/SPGoding/datapack-language-server/commit/531f13d)  Fix keeping retrying downloading reports (Issues: [`#353`](https://github.com/SPGoding/datapack-language-server/issues/353))

# [v1.13.5](https://github.com/SPGoding/datapack-language-server/compare/v1.13.4...v1.13.5) (2020-02-25)

## 🐛 Bug Fixes
- [`81cae2d`](https://github.com/SPGoding/datapack-language-server/commit/81cae2d)  Ensure parsing is after getting latest verisons

# [v1.13.4](https://github.com/SPGoding/datapack-language-server/compare/v1.13.3...v1.13.4) (2020-02-22)

## 🐛 Bug Fixes
- [`8846b09`](https://github.com/SPGoding/datapack-language-server/commit/8846b09)  Fix not packaging package.nls.json (Issues: [`#344`](https://github.com/SPGoding/datapack-language-server/issues/344))

# [v1.13.3](https://github.com/SPGoding/datapack-language-server/compare/v1.13.2...v1.13.3) (2020-02-22)

## 🐛 Bug Fixes
- [`a860db6`](https://github.com/SPGoding/datapack-language-server/commit/a860db6)  Catch errors occurring while reading cache (Issues: [`#331`](https://github.com/SPGoding/datapack-language-server/issues/331))

# [v1.13.2](https://github.com/SPGoding/datapack-language-server/compare/v1.13.1...v1.13.2) (2020-02-22)

## 🐛 Bug Fixes
- [`8e2fa68`](https://github.com/SPGoding/datapack-language-server/commit/8e2fa68)  Fix error messages for unknown commands (Issues: [`#340`](https://github.com/SPGoding/datapack-language-server/issues/340))

# [v1.13.1](https://github.com/SPGoding/datapack-language-server/compare/v1.13.0...v1.13.1) (2020-02-20)

## 🐛 Bug Fixes
- [`629bf48`](https://github.com/SPGoding/datapack-language-server/commit/629bf48)  Fix unhandled rejects for ‘.git’ files (Issues: [`#337`](https://github.com/SPGoding/datapack-language-server/issues/337))
- [`1ff4fbf`](https://github.com/SPGoding/datapack-language-server/commit/1ff4fbf)  Fix not showing document links at start (Issues: [`#331`](https://github.com/SPGoding/datapack-language-server/issues/331) [`#336`](https://github.com/SPGoding/datapack-language-server/issues/336))

# [v1.13.0](https://github.com/SPGoding/datapack-language-server/compare/v1.12.0...v1.13.0) (2020-02-18)

## ✨ New Features
- [`105d84e`](https://github.com/SPGoding/datapack-language-server/commit/105d84e) ♻️ Support multiple versions (Issues: [`#236`](https://github.com/SPGoding/datapack-language-server/issues/236))
- [`9c61d95`](https://github.com/SPGoding/datapack-language-server/commit/9c61d95) 🌐 Internationalization 
- [`594a312`](https://github.com/SPGoding/datapack-language-server/commit/594a312)  Use URIs to access files (Issues: [`#275`](https://github.com/SPGoding/datapack-language-server/issues/275))
- [`258dcf3`](https://github.com/SPGoding/datapack-language-server/commit/258dcf3)  Support untitled files (Issues: [`#288`](https://github.com/SPGoding/datapack-language-server/issues/288))
- [`10aeba6`](https://github.com/SPGoding/datapack-language-server/commit/10aeba6)  Support semantic coloring (Issues: [`#239`](https://github.com/SPGoding/datapack-language-server/issues/239))
- [`5c4a4af`](https://github.com/SPGoding/datapack-language-server/commit/5c4a4af)  Add a command to regenerate the cache file (Issues: [`#247`](https://github.com/SPGoding/datapack-language-server/issues/247))
- [`0752273`](https://github.com/SPGoding/datapack-language-server/commit/0752273)  Support function tag analysis (Issues: [`#315`](https://github.com/SPGoding/datapack-language-server/issues/315))
- [`bf8f70e`](https://github.com/SPGoding/datapack-language-server/commit/bf8f70e)  Support call hierarchy (Issues: [`#298`](https://github.com/SPGoding/datapack-language-server/issues/298))
- [`5a544c1`](https://github.com/SPGoding/datapack-language-server/commit/5a544c1)  Support work done progress (Issues: [`#321`](https://github.com/SPGoding/datapack-language-server/issues/321))
- [`f60f573`](https://github.com/SPGoding/datapack-language-server/commit/f60f573)  Support selection range request (Issues: [`#297`](https://github.com/SPGoding/datapack-language-server/issues/297))
- [`c9c2c8e`](https://github.com/SPGoding/datapack-language-server/commit/c9c2c8e)  Support multi-root (Issues: [`#251`](https://github.com/SPGoding/datapack-language-server/issues/251))
- [`298d1ef`](https://github.com/SPGoding/datapack-language-server/commit/298d1ef)  Show selected token in documentHighlight request (Issues: [`#325`](https://github.com/SPGoding/datapack-language-server/issues/325))
- [`4b1882e`](https://github.com/SPGoding/datapack-language-server/commit/4b1882e)  Support JE 1.16 (Issues: [`#327`](https://github.com/SPGoding/datapack-language-server/issues/327))

## 🐛 Bug Fixes
- [`ca31e72`](https://github.com/SPGoding/datapack-language-server/commit/ca31e72)  Fix not prefixing completions with hashes (Issues: [`#277`](https://github.com/SPGoding/datapack-language-server/issues/277))
- [`0aebcff`](https://github.com/SPGoding/datapack-language-server/commit/0aebcff)  Fix /data ... from &lt;nbtHolder&gt; is not executable (Issues: [`#282`](https://github.com/SPGoding/datapack-language-server/issues/282))
- [`fa88331`](https://github.com/SPGoding/datapack-language-server/commit/fa88331)  Fix /playsound ... &lt;pos&gt; is not executable (Issues: [`#284`](https://github.com/SPGoding/datapack-language-server/issues/284))
- [`4da8b40`](https://github.com/SPGoding/datapack-language-server/commit/4da8b40)  Fix the wrong type of Invul for withers (Issues: [`#281`](https://github.com/SPGoding/datapack-language-server/issues/281))
- [`98c85b6`](https://github.com/SPGoding/datapack-language-server/commit/98c85b6)  Fix bad performance of incremental update (Issues: [`#289`](https://github.com/SPGoding/datapack-language-server/issues/289) [`#230`](https://github.com/SPGoding/datapack-language-server/issues/230))
- [`16a75c8`](https://github.com/SPGoding/datapack-language-server/commit/16a75c8)  Fix unwanted capitalized letter in error message (Issues: [`#279`](https://github.com/SPGoding/datapack-language-server/issues/279))
- [`94b8f59`](https://github.com/SPGoding/datapack-language-server/commit/94b8f59)  Fix formatting [secure] selectors (Issues: [`#294`](https://github.com/SPGoding/datapack-language-server/issues/294))
- [`5cfc274`](https://github.com/SPGoding/datapack-language-server/commit/5cfc274)  Fix BlockEntityTag not using the base tag (Issues: [`#317`](https://github.com/SPGoding/datapack-language-server/issues/317))
- [`3285e0f`](https://github.com/SPGoding/datapack-language-server/commit/3285e0f)  Fix not watching files in other roots 
- [`e0206b6`](https://github.com/SPGoding/datapack-language-server/commit/e0206b6)  Fix faild to find ‘en-us’ locale 
- [`25e7f61`](https://github.com/SPGoding/datapack-language-server/commit/25e7f61)  Fix wrong uri in CallHierarchyItems 
- [`5b1a7bd`](https://github.com/SPGoding/datapack-language-server/commit/5b1a7bd)  Fix not coloring tokens anymore 
- [`ed07748`](https://github.com/SPGoding/datapack-language-server/commit/ed07748)  Fix not using base tags for some tags (Issues: [`#329`](https://github.com/SPGoding/datapack-language-server/issues/329))
- [`398a655`](https://github.com/SPGoding/datapack-language-server/commit/398a655)  Complete NBT Schema for 1.15 
- [`5fa71ad`](https://github.com/SPGoding/datapack-language-server/commit/5fa71ad)  Add missing registries added in 20w07a

# [v1.11.14](https://github.com/SPGoding/datapack-language-server/compare/v1.11.13...v1.11.14) (2020-01-19)

## 🐛 Bug Fixes
- [`f336e05`](https://github.com/SPGoding/datapack-language-server/commit/f336e05)  Fix allowing uppercased letters in IDs (Issues: [`#270`](https://github.com/SPGoding/datapack-language-server/issues/270))
- [`cb53a1f`](https://github.com/SPGoding/datapack-language-server/commit/cb53a1f)  Fix not allowing indexes after indexes (Issues: [`#271`](https://github.com/SPGoding/datapack-language-server/issues/271))

# [v1.11.13](https://github.com/SPGoding/datapack-language-server/compare/v1.11.12...v1.11.13) (2020-01-17)

## 🐛 Bug Fixes
- [`f2ff95a`](https://github.com/SPGoding/datapack-language-server/commit/f2ff95a)  Fix not allowing tags in /schedule clear (Issues: [`#258`](https://github.com/SPGoding/datapack-language-server/issues/258))
- [`fc5186b`](https://github.com/SPGoding/datapack-language-server/commit/fc5186b)  Fix relative file paths in the nbt schema (Issues: [`#260`](https://github.com/SPGoding/datapack-language-server/issues/260))

# [v1.11.12](https://github.com/SPGoding/datapack-language-server/compare/v1.11.11...v1.11.12) (2020-01-15)

## 🐛 Bug Fixes
- [`7e42944`](https://github.com/SPGoding/datapack-language-server/commit/7e42944)  Fix allowing multiple entities in /team join (Issues: [`#255`](https://github.com/SPGoding/datapack-language-server/issues/255))
- [`84391b8`](https://github.com/SPGoding/datapack-language-server/commit/84391b8)  Fix not allowing function tags in /schedule (Issues: [`#258`](https://github.com/SPGoding/datapack-language-server/issues/258))
- [`eeae5bd`](https://github.com/SPGoding/datapack-language-server/commit/eeae5bd)  Fix ‘&gt;&lt;’ in /scoreboard players operation (Issues: [`#261`](https://github.com/SPGoding/datapack-language-server/issues/261))

# [v1.11.11](https://github.com/SPGoding/datapack-language-server/compare/v1.11.10...v1.11.11) (2020-01-10)

## 🐛 Bug Fixes
- [`9ee46fe`](https://github.com/SPGoding/datapack-language-server/commit/9ee46fe)  Fix outdated registries file (Issues: [`#250`](https://github.com/SPGoding/datapack-language-server/issues/250))

# [v1.11.10](https://github.com/SPGoding/datapack-language-server/compare/v1.11.9...v1.11.10) (2020-01-09)

## 🐛 Bug Fixes
- [`189566d`](https://github.com/SPGoding/datapack-language-server/commit/189566d)  Fix missing ‘rendertype’ (Issues: [`#245`](https://github.com/SPGoding/datapack-language-server/issues/245))
- [`dc708e1`](https://github.com/SPGoding/datapack-language-server/commit/dc708e1)  Fix not allowing amount larger than 64 in give command (Issues: [`#244`](https://github.com/SPGoding/datapack-language-server/issues/244))

# [v1.11.9](https://github.com/SPGoding/datapack-language-server/compare/v1.11.8...v1.11.9) (2020-01-05)

## 🐛 Bug Fixes
- [`7c5bf14`](https://github.com/SPGoding/datapack-language-server/commit/7c5bf14)  Fix showing errors when parsing empty lines

# [v1.11.8](https://github.com/SPGoding/datapack-language-server/compare/v1.11.7...v1.11.8) (2020-01-05)

## 🐛 Bug Fixes
- [`4fcf7f2`](https://github.com/SPGoding/datapack-language-server/commit/4fcf7f2)  Fix teleport commands (Issues: [`#241`](https://github.com/SPGoding/datapack-language-server/issues/241))

# [v1.11.7](https://github.com/SPGoding/datapack-language-server/compare/v1.11.6...v1.11.7) (2020-01-01)

## 🐛 Bug Fixes
- [`1a3f89e`](https://github.com/SPGoding/datapack-language-server/commit/1a3f89e)  Fix type of SkullOwner (Issues: [`#235`](https://github.com/SPGoding/datapack-language-server/issues/235))

# [v1.11.6](https://github.com/SPGoding/datapack-language-server/compare/v1.11.5...v1.11.6) (2019-12-31)

## 🐛 Bug Fixes
- [`b58ad8e`](https://github.com/SPGoding/datapack-language-server/commit/b58ad8e)  Fix fill &lt;vec3&gt; &lt;vec3&gt; &lt;block&gt; replace not executable (Issues: [`#234`](https://github.com/SPGoding/datapack-language-server/issues/234))
- [`e183e6e`](https://github.com/SPGoding/datapack-language-server/commit/e183e6e)  Fix reporting errors for x_rotation (Issues: [`#232`](https://github.com/SPGoding/datapack-language-server/issues/232))

# [v1.11.5](https://github.com/SPGoding/datapack-language-server/compare/v1.11.4...v1.11.5) (2019-12-30)

## 🐛 Bug Fixes
- [`f27f2d8`](https://github.com/SPGoding/datapack-language-server/commit/f27f2d8)  Fix deleting files doesn&#x27;t update the cache (Issues: [`#231`](https://github.com/SPGoding/datapack-language-server/issues/231))

# [v1.11.4](https://github.com/SPGoding/datapack-language-server/compare/v1.11.3...v1.11.4) (2019-12-26)

## 🐛 Bug Fixes
- [`f39bf1b`](https://github.com/SPGoding/datapack-language-server/commit/f39bf1b)  Fix completions for text components (Issues: [`#227`](https://github.com/SPGoding/datapack-language-server/issues/227))
- [`0dcab65`](https://github.com/SPGoding/datapack-language-server/commit/0dcab65)  Fix not escaping code snippets (Issues: [`#228`](https://github.com/SPGoding/datapack-language-server/issues/228))

# [v1.11.3](https://github.com/SPGoding/datapack-language-server/compare/v1.11.2...v1.11.3) (2019-12-25)

## 🐛 Bug Fixes
- [`eac8363`](https://github.com/SPGoding/datapack-language-server/commit/eac8363)  Fix not recognizing JSON escape characters (Issues: [`#219`](https://github.com/SPGoding/datapack-language-server/issues/219))
- [`deea9a8`](https://github.com/SPGoding/datapack-language-server/commit/deea9a8)  Fix formatting JSON components 
- [`04caab3`](https://github.com/SPGoding/datapack-language-server/commit/04caab3)  Fix formatting JSONs

# [v1.11.2](https://github.com/SPGoding/datapack-language-server/compare/v1.11.1...v1.11.2) (2019-12-25)

## 🐛 Bug Fixes
- [`f43106a`](https://github.com/SPGoding/datapack-language-server/commit/f43106a)  Fix missing RadiusPerTick tag for AECs (Issues: [`#224`](https://github.com/SPGoding/datapack-language-server/issues/224))
- [`29a269e`](https://github.com/SPGoding/datapack-language-server/commit/29a269e)  Fix the base schema for entities (Issues: [`#225`](https://github.com/SPGoding/datapack-language-server/issues/225))
- [`f410d11`](https://github.com/SPGoding/datapack-language-server/commit/f410d11)  Fix quoted strings for name in entity selectors (Issues: [`#226`](https://github.com/SPGoding/datapack-language-server/issues/226))
- [`c28d46c`](https://github.com/SPGoding/datapack-language-server/commit/c28d46c)  Fix ranges of the forth element in dust particle (Issues: [`#223`](https://github.com/SPGoding/datapack-language-server/issues/223))

# [v1.11.1](https://github.com/SPGoding/datapack-language-server/compare/v1.11.0...v1.11.1) (2019-12-24)

## 🐛 Bug Fixes
- [`978419e`](https://github.com/SPGoding/datapack-language-server/commit/978419e)  Fix wrong item in the Passengers tag (Issues: [`#220`](https://github.com/SPGoding/datapack-language-server/issues/220))
- [`ce79926`](https://github.com/SPGoding/datapack-language-server/commit/ce79926)  Fix missing Color tag for arrow entities (Issues: [`#221`](https://github.com/SPGoding/datapack-language-server/issues/221))
- [`61595a0`](https://github.com/SPGoding/datapack-language-server/commit/61595a0)  Fix not able to define an objective via comments (Issues: [`#222`](https://github.com/SPGoding/datapack-language-server/issues/222))

# [v1.11.0](https://github.com/SPGoding/datapack-language-server/compare/v1.10.5...v1.11.0) (2019-12-24)

## ✨ New Features
- [`8a8154b`](https://github.com/SPGoding/datapack-language-server/commit/8a8154b)  Add strictBlockCheck and many other configs (Issues: [`#170`](https://github.com/SPGoding/datapack-language-server/issues/170))

## 🐛 Bug Fixes
- [`24e88de`](https://github.com/SPGoding/datapack-language-server/commit/24e88de)  Fix the completion order of ‘~’ and ‘^’ (Issues: [`#203`](https://github.com/SPGoding/datapack-language-server/issues/203))
- [`6444117`](https://github.com/SPGoding/datapack-language-server/commit/6444117)  Fix the code snippet for scoreboard players set (Issues: [`#206`](https://github.com/SPGoding/datapack-language-server/issues/206))
- [`0206330`](https://github.com/SPGoding/datapack-language-server/commit/0206330)  Fix not recognizing UUIDs (Issues: [`#208`](https://github.com/SPGoding/datapack-language-server/issues/208))
- [`c089af8`](https://github.com/SPGoding/datapack-language-server/commit/c089af8)  Fix the completions for non-definition comments (Issues: [`#207`](https://github.com/SPGoding/datapack-language-server/issues/207))
- [`a4c675b`](https://github.com/SPGoding/datapack-language-server/commit/a4c675b)  Fix duplicated definition cache (Issues: [`#218`](https://github.com/SPGoding/datapack-language-server/issues/218))
- [`b9659c4`](https://github.com/SPGoding/datapack-language-server/commit/b9659c4)  Fix not renaming tags in NBTs (Issues: [`#194`](https://github.com/SPGoding/datapack-language-server/issues/194))
- [`93b462c`](https://github.com/SPGoding/datapack-language-server/commit/93b462c)  Fix errors with text components (Issues: [`#170`](https://github.com/SPGoding/datapack-language-server/issues/170))

# [v1.10.5](https://github.com/SPGoding/datapack-language-server/compare/v1.10.4...v1.10.5) (2019-12-15)

## 🐛 Bug Fixes
- [`b044635`](https://github.com/SPGoding/datapack-language-server/commit/b044635)  Not returning error for long entity names (Issues: [`#199`](https://github.com/SPGoding/datapack-language-server/issues/199))
- [`fc97c75`](https://github.com/SPGoding/datapack-language-server/commit/fc97c75)  Fix bossbar set player not executable (Issues: [`#200`](https://github.com/SPGoding/datapack-language-server/issues/200))

# [v1.10.4](https://github.com/SPGoding/datapack-language-server/compare/v1.10.3...v1.10.4) (2019-12-09)

## 🐛 Bug Fixes
- [`761b6db`](https://github.com/SPGoding/datapack-language-server/commit/761b6db)  Fix not providing completions for namespaced IDs (Issues: [`#192`](https://github.com/SPGoding/datapack-language-server/issues/192))
- [`2a5babc`](https://github.com/SPGoding/datapack-language-server/commit/2a5babc)  Fix not always showing document links (Issues: [`#191`](https://github.com/SPGoding/datapack-language-server/issues/191))
- [`cbce65b`](https://github.com/SPGoding/datapack-language-server/commit/cbce65b)  Fix multiple entities in /execute store (Issues: [`#198`](https://github.com/SPGoding/datapack-language-server/issues/198))
- [`0495806`](https://github.com/SPGoding/datapack-language-server/commit/0495806)  Fix cache not updating for folder operations (Issues: [`#137`](https://github.com/SPGoding/datapack-language-server/issues/137) [`#197`](https://github.com/SPGoding/datapack-language-server/issues/197))

# [v1.10.3](https://github.com/SPGoding/datapack-language-server/compare/v1.10.2...v1.10.3) (2019-11-30)

## 🐛 Bug Fixes
- [`2e5652a`](https://github.com/SPGoding/datapack-language-server/commit/2e5652a)  Fix CRLF (Issues: [`#190`](https://github.com/SPGoding/datapack-language-server/issues/190))

# [v1.10.2](https://github.com/SPGoding/datapack-language-server/compare/v1.10.1...v1.10.2) (2019-11-30)

## 🐛 Bug Fixes
- [`8a7aaf9`](https://github.com/SPGoding/datapack-language-server/commit/8a7aaf9)  Fix not activating (Issues: [`#189`](https://github.com/SPGoding/datapack-language-server/issues/189))

# [v1.10.1](https://github.com/SPGoding/datapack-language-server/compare/v1.10.0...v1.10.1) (2019-11-29)

## 🐛 Bug Fixes
- [`7fcd246`](https://github.com/SPGoding/datapack-language-server/commit/7fcd246)  Fix not formatting when hints or warnings exist 
- [`c56d320`](https://github.com/SPGoding/datapack-language-server/commit/c56d320)  Fix parsing some namespaced IDs in NBTs 

## 🔒 Security Issues
- [`832dee8`](https://github.com/SPGoding/datapack-language-server/commit/832dee8)  Fix 9 vulnerabilities

# [v1.10.0](https://github.com/SPGoding/datapack-language-server/compare/v1.9.4...v1.10.0) (2019-11-29)

## ✨ New Features
- [`6d453c7`](https://github.com/SPGoding/datapack-language-server/commit/6d453c7)  Add several code snippets (Issues: [`#182`](https://github.com/SPGoding/datapack-language-server/issues/182))
- [`389c467`](https://github.com/SPGoding/datapack-language-server/commit/389c467)  Support allCommitCharacters (Issues: [`#183`](https://github.com/SPGoding/datapack-language-server/issues/183))
- [`3ff65aa`](https://github.com/SPGoding/datapack-language-server/commit/3ff65aa)  Add colors for NBT tags (Issues: [`#185`](https://github.com/SPGoding/datapack-language-server/issues/185))
- [`09ae2cc`](https://github.com/SPGoding/datapack-language-server/commit/09ae2cc)  Support workspace configuration (Issues: [`#171`](https://github.com/SPGoding/datapack-language-server/issues/171))
- [`98d6075`](https://github.com/SPGoding/datapack-language-server/commit/98d6075)  Finish formatting code 

## 🐛 Bug Fixes
- [`ec9a4ee`](https://github.com/SPGoding/datapack-language-server/commit/ec9a4ee)  Fix showing errors when typing execute if data (Issues: [`#168`](https://github.com/SPGoding/datapack-language-server/issues/168))
- [`f3a0b34`](https://github.com/SPGoding/datapack-language-server/commit/f3a0b34)  Fix not triming cache if auto save is disabled (Issues: [`#178`](https://github.com/SPGoding/datapack-language-server/issues/178))
- [`ca342e1`](https://github.com/SPGoding/datapack-language-server/commit/ca342e1)  Fix &#x27;blue&#x27; is misspelled as &#x27;bule&#x27; (Issues: [`#184`](https://github.com/SPGoding/datapack-language-server/issues/184))
- [`af3e08e`](https://github.com/SPGoding/datapack-language-server/commit/af3e08e)  Fix freezing for traling data after the value (Issues: [`#176`](https://github.com/SPGoding/datapack-language-server/issues/176))
- [`f76a502`](https://github.com/SPGoding/datapack-language-server/commit/f76a502)  Fix type of BrewTime in brewing_stand 
- [`9558a48`](https://github.com/SPGoding/datapack-language-server/commit/9558a48)  Fix not returning errors for illegal omitting (Issues: [`#169`](https://github.com/SPGoding/datapack-language-server/issues/169))
- [`8019fd6`](https://github.com/SPGoding/datapack-language-server/commit/8019fd6)  Fix parsing empty value in entity selectors (Issues: [`#188`](https://github.com/SPGoding/datapack-language-server/issues/188))

# [v1.9.4](https://github.com/SPGoding/datapack-language-server/compare/v1.9.3...v1.9.4) (2019-11-17)

## 🐛 Bug Fixes
- [`627ac38`](https://github.com/SPGoding/datapack-language-server/commit/627ac38)  Fix missing Tags tag for falling blocks (Issues: [`#162`](https://github.com/SPGoding/datapack-language-server/issues/162))
- [`add9d9b`](https://github.com/SPGoding/datapack-language-server/commit/add9d9b)  Fix missing Item tag in snowballs (Issues: [`#164`](https://github.com/SPGoding/datapack-language-server/issues/164))
- [`e071859`](https://github.com/SPGoding/datapack-language-server/commit/e071859)  Add missing spawnpoint command (Issues: [`#165`](https://github.com/SPGoding/datapack-language-server/issues/165))
- [`b28bff8`](https://github.com/SPGoding/datapack-language-server/commit/b28bff8)  Fix errors for block states of a block tag (Issues: [`#166`](https://github.com/SPGoding/datapack-language-server/issues/166))
- [`9adcbf7`](https://github.com/SPGoding/datapack-language-server/commit/9adcbf7)  Fix warnings for booleans in text components (Issues: [`#163`](https://github.com/SPGoding/datapack-language-server/issues/163))

# [v1.9.3](https://github.com/SPGoding/datapack-language-server/compare/v1.9.2...v1.9.3) (2019-11-17)

## 🐛 Bug Fixes
- [`b8005b9`](https://github.com/SPGoding/datapack-language-server/commit/b8005b9)  Add missing contributors

# [v1.9.2](https://github.com/SPGoding/datapack-language-server/compare/v1.9.1...v1.9.2) (2019-11-17)

## 🐛 Bug Fixes
- [`44d1572`](https://github.com/SPGoding/datapack-language-server/commit/44d1572)  Fix folding regions

# [v1.9.1](https://github.com/SPGoding/datapack-language-server/compare/v1.9.0...v1.9.1) (2019-11-16)

## 🐛 Bug Fixes
- [`d590faa`](https://github.com/SPGoding/datapack-language-server/commit/d590faa)  Fix folding regions

# [v1.9.0](https://github.com/SPGoding/datapack-language-server/compare/v1.8.4...v1.9.0) (2019-11-16)

## ✨ New Features
- [`942373b`](https://github.com/SPGoding/datapack-language-server/commit/942373b)  Add folding regions for comments (Issues: [`#158`](https://github.com/SPGoding/datapack-language-server/issues/158))

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
