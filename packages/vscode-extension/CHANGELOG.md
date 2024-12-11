# v4.3.2 (2024-12-11)

### 🐛 Bug Fixes
- [`9a366e8`](https://github.com/SpyglassMC/Spyglass/commit/9a366e8d82c407a6f219e0ea4ebc77154115b5a0) Mcodc caching is now disabled by default, added config `env.enableMcdocCaching` to re-enable it ([#1671](https://github.com/SpyglassMC/Spyglass/pull/1671))
- [`0565b6c`](https://github.com/SpyglassMC/Spyglass/commit/0565b6c659f558378f814560267f0f8782e3389c) Hidden `undeclaredSymbol` warnings for resource pack file references ([#1667](https://github.com/SpyglassMC/Spyglass/pull/1667))
- [`d30e9c4`](https://github.com/SpyglassMC/Spyglass/commit/d30e9c49c0126eae5ce98f1c5f97d04eb0789cb4) Fixed `block_crumble` and `trail` particles not allowing options ([#1665](https://github.com/SpyglassMC/Spyglass/pull/1665))
- [`cbbd65c`](https://github.com/SpyglassMC/Spyglass/commit/cbbd65c3b1fb18fb74eaeaad8ed336e3db94fd88) The size of the range in `/random` is now validated ([#1670](https://github.com/SpyglassMC/Spyglass/pull/1670))
- [`ad20d9b`](https://github.com/SpyglassMC/Spyglass/commit/ad20d9bf5c53aa9b8454b8255f8ea1f890bde68e) Ensure the cache root exists before showing it ([#1669](https://github.com/SpyglassMC/Spyglass/pull/1669))
- [`28a9d70`](https://github.com/SpyglassMC/Spyglass/commit/28a9d701125eb254c743a2fc40a62954e1d1b336) Fixed an issue where the language server would crash ([#1668](https://github.com/SpyglassMC/Spyglass/pull/1668))
- [`e8d8d2b`](https://github.com/SpyglassMC/Spyglass/commit/e8d8d2b9b8545edc0e46e3b88dc4f94b1107f547) Fixed spring feature configuration ([#1666](https://github.com/SpyglassMC/Spyglass/pull/1666))
- [`dfe4269`](https://github.com/SpyglassMC/Spyglass/commit/dfe426911c2b6a0037f701344502d135de6a53d2) Fixed "archive has not been loaded into the memory" log spam ([#1664](https://github.com/SpyglassMC/Spyglass/pull/1664))

# v4.3.0 (2024-11-23)
This release adds initial support for resource packs! This also helps with `pack_format` detection when you have both a resource pack and data pack in the same workspace.

### ✨ New Features
- [`1d62c9c`](https://github.com/SpyglassMC/Spyglass/commit/1d62c9c3330612a9c77efec960ff91c86a0b7e7e) Added support for resource packs ([#1603](https://github.com/SpyglassMC/Spyglass/pull/1603))
- [`6e0e705`](https://github.com/SpyglassMC/Spyglass/commit/6e0e705ebbf451860d36e40331b2aabfd3d9ae12) Added validation and autocomplete for block states in JSON and NBT ([#1641](https://github.com/SpyglassMC/Spyglass/pull/1641))

### 🐛 Bug Fixes
- [`ee4fefa`](https://github.com/SpyglassMC/Spyglass/commit/ee4fefac40d84f7add20ba1ac33004433d6c7c9b) The `air` item is now disallowed in a few places ([#1615](https://github.com/SpyglassMC/Spyglass/pull/1615))
- [`dbae237`](https://github.com/SpyglassMC/Spyglass/commit/dbae237487ed0c867d7f01ebbdd2d564a78cbecd) Packed ARGB colors now correctly wrap to negatives ([#1642](https://github.com/SpyglassMC/Spyglass/pull/1642))
- [`74dbb91`](https://github.com/SpyglassMC/Spyglass/commit/74dbb91a8ca64101ee991e4c2abb15ba47abac9c) Fixed a few places in item predicates where whitespace was not allowed ([#1643](https://github.com/SpyglassMC/Spyglass/pull/1643))
- [`3076009`](https://github.com/SpyglassMC/Spyglass/commit/307600953b24bca4bd25f0f9a6d7646a212253a9) The `nameOfScoreHolder` no longer complains for the special `*` score holder ([#1644](https://github.com/SpyglassMC/Spyglass/pull/1644))
- [`89921ff`](https://github.com/SpyglassMC/Spyglass/commit/89921ff3b69d587dcfb2623c0be30d4bfa94fbe7) Component removal syntax added in 1.21 is now supported ([#1645](https://github.com/SpyglassMC/Spyglass/pull/1645))

# v4.2.3 (2024-09-17)

### 🐛 Bug Fixes
- [`c67a9b6`](https://github.com/SpyglassMC/Spyglass/commit/c67a9b64725b5c9f7e447ceb683a4b2bcc8c7d2f) Fixed issues when the workspace path contained special characters ([#1599](https://github.com/SpyglassMC/Spyglass/pull/1599))
- [`2f468d2`](https://github.com/SpyglassMC/Spyglass/commit/2f468d27d000181105b93112261ff706994e0d71) Removed invalid heightmap types from commands ([#1598](https://github.com/SpyglassMC/Spyglass/pull/1598))

# v4.2.0 (2024-08-07)

### ✨ New Features
- [`f4d4588`](https://github.com/SpyglassMC/Spyglass/commit/f4d458894a94237f06db4ab36305c3f44b02bc41) Added a "Game Version" vscode setting ([#1506](https://github.com/SpyglassMC/Spyglass/pull/1506))
- [`87841f6`](https://github.com/SpyglassMC/Spyglass/commit/87841f6a267f37cc88d648a676b29b92e56067ca) Added a "Show Output" vscode command ([1505](https://github.com/SpyglassMC/Spyglass/pull/1505))
- [`956a6a3`](https://github.com/SpyglassMC/Spyglass/commit/956a6a3bb7436daedb47f06ad169f24533f3b576) Added the currently loaded version to the end of error messages ([#1515](https://github.com/SpyglassMC/Spyglass/pull/1515))

### 🐛 Bug Fixes
- [`60694bc`](https://github.com/SpyglassMC/Spyglass/commit/60694bc1b6f294817f537a961bb31d533fb287b5) Added missing `teamkill.*` and `killedByTeam.*` scoreboard objectives ([#1501](https://github.com/SpyglassMC/Spyglass/pull/1501))
- [`db02249`](https://github.com/SpyglassMC/Spyglass/commit/db02249e6b646c6e430cd501d4a4e14156177fbb) Added `env.useFilePolling` config to mitigate folder renaming problems ([#1523](https://github.com/SpyglassMC/Spyglass/pull/1523))
- [`1a469d7`](https://github.com/SpyglassMC/Spyglass/commit/1a469d7ccb7229af956dd2a1e544f23af0f65097) Fixed problems with config merging ([#1519](https://github.com/SpyglassMC/Spyglass/pull/1519))
- [`9ee9ba8`](https://github.com/SpyglassMC/Spyglass/commit/9ee9ba866841500936405c7c9dabbb773d822b65) Removed incorrect collection length errors in some NBT cases ([#1559](https://github.com/SpyglassMC/Spyglass/pull/1559))

# v4.1.2 (2024-07-08)

### 🐛 Bug Fixes
- [`0e920e8`](https://github.com/SpyglassMC/Spyglass/commit/0e920e830cdc3d00c873897aa2a20fcea7d6fb56) Fixed issue where NBT and JSON validation incorrectly used cached types ([#1495](https://github.com/SpyglassMC/Spyglass/pull/1495))

# v4.1.0 (2024-07-08)
This release adds multi-workspace support along with some other new features. Note that multi-versions and overlays are still not supported.

### ✨ New Features
- [`330eb95`](https://github.com/SpyglassMC/Spyglass/commit/330eb95cb684cee0b8754b20a42caa70199a106d) Added support for multiple workspace folders ([#1378](https://github.com/SpyglassMC/Spyglass/pull/1378))
- [`8600c83`](https://github.com/SpyglassMC/Spyglass/commit/8600c834873ef993068f6f8e657dae496f3cbf45) Added validation and autocomplete for pack format values ([#1469](https://github.com/SpyglassMC/Spyglass/pull/1469))
- [`2a9eddd`](https://github.com/SpyglassMC/Spyglass/commit/2a9edddce6f0078b2c6acc9e407040e02521a716) Added progress indicator in status bar during initialization ([#1461](https://github.com/SpyglassMC/Spyglass/pull/1461))
- [`19264a4`](https://github.com/SpyglassMC/Spyglass/commit/19264a4f8af7fa270aa456e2f38ef11594208b8c) Added color pickers to JSON and NBT ([#1484](https://github.com/SpyglassMC/Spyglass/pull/1484))
- [`019aea2`](https://github.com/SpyglassMC/Spyglass/commit/019aea225d542383431d91900053ba5db495badb) Added validation and autocomplete of advancement criteria names ([#1473](https://github.com/SpyglassMC/Spyglass/pull/1473))
- [`e543fe7`](https://github.com/SpyglassMC/Spyglass/commit/e543fe70c2d9c743567a6d654d12527e2e9e2405) Added validation when commands are too long ([#1485](https://github.com/SpyglassMC/Spyglass/pull/1485))
- [`026e817`](https://github.com/SpyglassMC/Spyglass/commit/026e81773cfeeb27e34d5fe2839ed8aa9a497bf3) Improved validation of leading command slashes in JSON and NBT ([#1491](https://github.com/SpyglassMC/Spyglass/pull/1491))
- [`6ac99d2`](https://github.com/SpyglassMC/Spyglass/commit/6ac99d2f39f77d604b08e710e99d5c64401c3c55) Improved performance of JSON and NBT checking by caching expensive operations ([#1391](https://github.com/SpyglassMC/Spyglass/pull/1391))

### 🐛 Bug Fixes
- [`6b1da2e`](https://github.com/SpyglassMC/Spyglass/commit/6b1da2e8aa3d1a585d2d994e7938ef3e73eafa17) Fixed incorrect errors at the end of some NBT paths ([#1472](https://github.com/SpyglassMC/Spyglass/pull/1472))
- [`1234d6d`](https://github.com/SpyglassMC/Spyglass/commit/1234d6d12f1a04ab963e591c0386c0e5eb6e9655) Fixed rare issue when using nested mixed string quotes ([#1486](https://github.com/SpyglassMC/Spyglass/pull/1486))

# v4.0.1 (2024-07-02)

### 🐛 Bug Fixes
- [`601255e`](https://github.com/SpyglassMC/Spyglass/commit/601255e5f05ba64c057b629d0e5e8d2396f6024a) Crash when fileModified before dependencyFiles is set ([#1428](https://github.com/SpyglassMC/Spyglass/pull/1428))
- [`a08b7a8`](https://github.com/SpyglassMC/Spyglass/commit/a08b7a8f4bffc27880d3327974b6f8bf5ae378d4) Require tag resource locations in some places
- [`212cb71`](https://github.com/SpyglassMC/Spyglass/commit/212cb71c14d3135ce55dddf1967d591a224cc55d) Crash when extension activates without workspace folders

# v4.0.0 (2024-06-30)

### ✨ New Features
- Complete rewrite of the extension
- Added support for Minecraft 1.20.6 and 1.21

# [v3.2.0](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v3.1.2...v3.2.0) (2020-11-29)

### ✨ New Features
- [`5053396`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/5053396)  Allow complex regexp with Naming Convention (#38) (Issues: [`#38`](https://github.com/SPGoding/vscode-datapack-helper-plus/issues/38))
- [`34c4034`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/34c4034)  @spgoding/datapack-language-server@3.2.0

# [v3.1.2](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v3.1.1...v3.1.2) (2020-11-22)

### 🐛 Bug Fixes
- [`8131208`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/8131208)  @spgoding/datapack-language-server@3.1.2

# [v3.1.1](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v3.1.0...v3.1.1) (2020-11-12)

### 🐛 Bug Fixes
- [`141d756`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/141d756)  @spgoding/datapack-language-server@3.1.1

# [v3.1.0](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v3.0.11...v3.1.0) (2020-11-12)

### ✨ New Features
- [`9508981`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/9508981)  @spgoding/datapack-language-server@3.1.0

# [v3.0.11](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v3.0.10...v3.0.11) (2020-11-11)

### 🐛 Bug Fixes
- [`feb17db`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/feb17db)  @spgoding/datapack-language-server@3.0.9

# [v3.0.10](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v3.0.9...v3.0.10) (2020-11-10)

### 🐛 Bug Fixes
- [`dcfe2b4`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/dcfe2b4)  @spgoding/datapack-language-server@3.0.8

# [v3.0.9](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v3.0.8...v3.0.9) (2020-10-21)

### 🐛 Bug Fixes
- [`39837e9`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/39837e9)  @spgoding/datapack-language-server@3.0.7

# [v3.0.8](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v3.0.7...v3.0.8) (2020-10-12)

### 🐛 Bug Fixes
- [`c2c113b`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/c2c113b)  @spgoding/datapack-language-server@3.0.6

# [v3.0.7](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v3.0.6...v3.0.7) (2020-10-09)

### 🐛 Bug Fixes
- [`687485f`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/687485f)  @spgoding/datapack-language-server@3.0.5

# [v3.0.6](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v3.0.5...v3.0.6) (2020-10-02)

### 🐛 Bug Fixes
- [`8612b4e`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/8612b4e)  @spgoding/datapack-language-server@3.0.4

# [v3.0.5](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v3.0.4...v3.0.5) (2020-09-26)

### 🐛 Bug Fixes
- [`23c3c02`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/23c3c02)  Add missing strictScoreHolderCheck (#28) (Issues: [`#28`](https://github.com/SPGoding/vscode-datapack-helper-plus/issues/28))
- [`dae233f`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/dae233f)  @spgoding/datapack-language-server@3.0.3

# [v3.0.3](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v3.0.2...v3.0.3) (2020-09-26)

### 🐛 Bug Fixes
- [`b107d67`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/b107d67)  @spgoding/datapack-language-server@3.0.2 
- [`cb113ac`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/cb113ac)  Update GitHub action and README

# [v3.0.3](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v3.0.2...v3.0.3) (2020-09-26)

### 🐛 Bug Fixes
- [`71eadb6`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/71eadb6)  @spgoding/datapack-language-server@3.0.2

# [v3.0.2](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v3.0.1...v3.0.2) (2020-08-15)

### 🐛 Bug Fixes
- [`0f23c9c`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/0f23c9c)  @spgoding/datapack-language-server@3.0.1

# [v3.0.1](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v3.0.0...v3.0.1) (2020-08-14)

### 🐛 Bug Fixes
- [`67c25b5`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/67c25b5)  @spgoding/datapack-language-server@3.0.0

# [v3.0.0](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v2.1.14...v3.0.0) (2020-08-14)

### 🐛 Bug Fixes
- [`ff97c91`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/ff97c91)  @spgoding/datapack-language-server@2.1.13 

### 💥 Breaking Changes
- [`b7dd0f1`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/b7dd0f1)  Install @spgoding/datapack-language-server@3.0.0

# [v2.1.14](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v2.1.13...v2.1.14) (2020-07-14)

### 🐛 Bug Fixes
- [`126ac05`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/126ac05)  @spgoding/datapack-language-server@2.1.13

# [v2.1.13](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v2.1.12...v2.1.13) (2020-07-09)

### 🐛 Bug Fixes
- [`1f7c1d8`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/1f7c1d8)  Install @spgoding/datapack-language-server@2.1.13

# [v2.1.12](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v2.1.11...v2.1.12) (2020-07-08)

### 🐛 Bug Fixes
- [`9b59606`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/9b59606)  Install @spgoding/datapack-language-server@2.1.12

# [v2.1.11](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v2.1.10...v2.1.11) (2020-07-07)

### 🐛 Bug Fixes
- [`de3c65d`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/de3c65d)  Install @spgoding/datapack-language-server@2.1.11

# [v2.1.10](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v2.1.9...v2.1.10) (2020-07-06)

### 🐛 Bug Fixes
- [`ed20164`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/ed20164)  Install @spgoding/datapack-language-server@2.1.10

# [v2.1.9](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v2.1.8...v2.1.9) (2020-07-02)

### 🐛 Bug Fixes
- [`3685951`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/3685951)  Install @spgoding/datapack-language-server@2.1.9

# [v2.1.8](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v2.1.7...v2.1.8) (2020-07-02)

### 🐛 Bug Fixes
- [`5350313`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/5350313)  Update @spgoding/datapack-language-server to 2.1.8

# [v2.1.7](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v2.1.6...v2.1.7) (2020-06-29)

### 🐛 Bug Fixes
- [`1301512`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/1301512)  Update @spgoding/datapack-language-server to 2.1.7

# [v2.1.6](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v2.1.5...v2.1.6) (2020-06-28)

### 🐛 Bug Fixes
- [`3d05dcc`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/3d05dcc)  Update @spgoding/datapack-language-server to 2.1.6

# [v2.1.5](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v2.1.4...v2.1.5) (2020-06-28)

### 🐛 Bug Fixes
- [`5934ef8`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/5934ef8)  Update @spgoding/datapack-language-server to 2.1.5

# [v2.1.4](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v2.1.3...v2.1.4) (2020-06-28)

### 🐛 Bug Fixes
- [`03825a1`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/03825a1)  Update @spgoding/datapack-language-server to 2.1.4

# [v2.1.3](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v2.1.2...v2.1.3) (2020-06-28)

### 🐛 Bug Fixes
- [`411766a`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/411766a)  Update @spgoding/datapack-language-server to 2.1.3

# [v2.1.2](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v2.1.1...v2.1.2) (2020-06-26)

### 🐛 Bug Fixes
- [`be84368`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/be84368)  Update @spgoding/datapack-language-server to 2.1.2

# [v2.1.1](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v2.1.0...v2.1.1) (2020-06-26)

### 🐛 Bug Fixes
- [`362029f`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/362029f)  Upgrade @spgoding/datapack-language-server to 2.1.1

# [v2.1.0](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v2.0.5...v2.1.0) (2020-06-24)

### ✨ New Features
- [`df9e87d`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/df9e87d)  Add new language config 
- [`68ffcd0`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/68ffcd0)  Upgrade language server to 2.1.0

# [v2.0.5](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v2.0.4...v2.0.5) (2020-05-22)

### 🐛 Bug Fixes
- [`911e0b2`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/911e0b2)  Upgrade @spgoding/datapack-language-server to 2.0.4

# [v2.0.4](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v2.0.3...v2.0.4) (2020-05-21)

### 🐛 Bug Fixes
- [`deef71f`](https://github.com/SPGoding/vscode-datapack-helper-plus/commit/deef71f)  Upgrade @spgoding/datapack-language-server

# [v2.0.3](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v2.0.2...v2.0.3) (2020-05-17)

# [v2.0.1](https://github.com/SPGoding/vscode-datapack-helper-plus/compare/v2.0.0...v2.0.1) (2020-05-14)
