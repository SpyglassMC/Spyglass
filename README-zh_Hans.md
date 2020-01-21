![banner](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/banner.png)

[![Discord](https://img.shields.io/discord/666020457568403505?logo=discord&style=flat-square)](https://discord.gg/EbdseuS)
[![CircleCI](https://img.shields.io/circleci/build/github/SPGoding/datapack-language-server.svg?logo=circleci&style=flat-square)](https://circleci.com/gh/SPGoding/datapack-language-server)
[![npm](https://img.shields.io/npm/v/datapack-language-server.svg?logo=npm&style=flat-square)](https://npmjs.com/package/datapack-language-server)
[![VSCode Marketplace](https://img.shields.io/visual-studio-marketplace/v/SPGoding.datapack-language-server.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server)
[![VSCode Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/SPGoding.datapack-language-server.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server)
[![VSCode Marketplace Installs](https://img.shields.io/visual-studio-marketplace/i/SPGoding.datapack-language-server.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server)
[![VSCode Marketplace Rating](https://img.shields.io/visual-studio-marketplace/stars/SPGoding.datapack-language-server.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server)
[![Codecov](https://img.shields.io/codecov/c/gh/SPGoding/datapack-language-server.svg?logo=codecov&style=flat-square)](https://codecov.io/gh/SPGoding/datapack-language-server)
[![License](https://img.shields.io/github/license/SPGoding/datapack-language-server.svg?style=flat-square)](https://github.com/SPGoding/datapack-language-server/blob/master/LICENSE)
[![semantic-release](https://img.shields.io/badge/%20%20%F0%9F%93%A6%F0%9F%9A%80-semantic--release-e10079.svg?style=flat-square)](https://github.com/semantic-release/semantic-release)
[![Gitmoji](https://img.shields.io/badge/gitmoji-%20%F0%9F%98%9C%20%F0%9F%98%8D-FFDD67.svg?style=flat-square)](https://gitmoji.carloscuesta.me/)

Datapack Helper Plus，简称 DHP，中文名大憨批，是 [pca006132](https://www.mcbbs.net/home.php?mod=space&uid=193048) 前辈制作的 [Datapack Helper](https://www.mcbbs.net/thread-772929-1-1.html) 的精神续作，是一组能够为 Minecraft Java版 1.15 的数据包提供支持的插件。您可以将其安装在 [VSCode](https://code.visualstudio.com/) 编辑器上。

大憨批被分为了两部分：JSON 部分与 MCF 部分。前者提供数据包中 JSON 文件（如进度、配方、战利品表、断言、标签等）的支持，后者提供函数文件的支持。您当前正在阅读的帖子是为 MCF 部分编写的。

| 名称 | 版本 | 下载量 |
| - | - | - |
| [大憨批（JSON）](https://www.mcbbs.net/thread-897610-1-1.html) | [![VSCode Marketplace](https://img.shields.io/visual-studio-marketplace/v/SPGoding.datapack-json.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-json) | [![VSCode Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/SPGoding.datapack-json.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-json) |
| [大憨批（MCF）](https://www.mcbbs.net/thread-926724-1-1.html) | [![VSCode Marketplace](https://img.shields.io/visual-studio-marketplace/v/SPGoding.datapack-language-server.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server) | [![VSCode Marketplace Downloads](https://img.shields.io/visual-studio-marketplace/d/SPGoding.datapack-language-server.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server) |

# 安装

点这个图标就可以从网页安装：[![VSCode Marketplace](https://img.shields.io/visual-studio-marketplace/v/SPGoding.datapack-language-server.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server)。

或者，您也可以直接打开 VSCode，按 Ctrl + P，复制粘贴 `ext install spgoding.datapack-language-server` 并回车。

# 特性

## 工作区支持

请使用数据包的根文件夹（也就是 `data` 文件夹与 `pack.mcmeta` 文件所处的文件夹）作为你的工作区的根文件夹，以获得最佳的体验。

此外，大憨批完全支持多个根文件夹的工作区，只需要确保在使用「文件」→「将文件夹添加到工作区…」功能添加数据包时添加的都是数据包的根文件夹即可。然而，有关 VSCode 的工作区的优质中文资料十分匮乏，不想花时间了解怎么使用多根文件夹的工作区的用户可以忽略掉大憨批的这个特性。工作区中其他的非数据包根文件夹不会受到大憨批影响。

工作区中根文件夹的顺序将会影响它们在大憨批当中的优先级。最开始的根文件夹会第一个被加载，最后的根文件夹会在最后加载，也就是说根文件夹出现得**越早**，它在大憨批中的的优先级**越低**。这和游戏在加载数据包时决定用哪个数据包中的文件覆盖另一个文件的逻辑是完全一致的。举个例子，如果你的多根文件夹工作区的文件结构是这个样子：

```
─── （根文件夹）数据包A
   ├── data
   |   └── spgoding
   |       └── functions
   |           └── foo.mcfunction
   └── pack.mcmeta
─── （根文件夹）数据包B
   ├── data
   |   └── spgoding
   |       └── functions
   |           └── foo.mcfunction
   └── pack.mcmeta
```

然后你使用 `F2` 功能在一个函数文件中把函数 `spgoding:foo` 重命名为了 `wtf:foo`，只有在数据包 B 中的文件（`数据包B/data/spgoding/functions/foo.mcfunction`）会被移动到 `Datapack B/data/wtf/functions/foo.mcfunction`，即使在数据包A中也有一个具有同样命名空间 ID 的函数文件（`Datapack A/data/spgoding/functions/foo.mcfunction`）。

如果你尝试在 Minecraft 中执行以下命令，你也会发现被执行的函数是数据包B中的。
```mcfunction
datapack enable "file/Datapack A" first
datapack enable "file/Datapack B" last
function spgoding:foo
```

通过这样的逻辑，大憨批确保了它处理数据包的行为是和 Minecraft 一致的。

**提示**：你可以在 VSCode 中拖放根文件夹来排序它们，大憨批会自动更新它们在大憨批中的优先级，十分方便。

## 多语言支持

DHP支持多种语言。目前以下语言已经完全支持：

| 语言 | VSCode 语言 ID | 贡献者 |
| ---- | ---- | ----------- |
| 英语 | `en` | [SPGoding](https://github.com/SPGoding) |
| 日语 | `ja` | [ChenCMD](https://github.com/ChenCMD) |
| 简体中文 | `zh-cn` | [SPGoding](https://github.com/SPGoding) |

如果您愿意帮助翻译大憨批至其他语言，我们将不胜感激！请查看 [CONTRIBUTING.md](https://github.com/SPGoding/datapack-language-server/blob/master/CONTRIBUTING.md) 了解更多信息。

## 语义化高亮

不存在的。近阶段请使用 [Arcensoth](https://github.com/Arcensoth) 制作的 [language-mcfunction](https://marketplace.visualstudio.com/items?itemName=arcensoth.language-mcfunction) 插件。下面的截图都是既使用了 Arcensoth 的高亮插件、也使用了我的大憨批来截图的。

## 签名信息

您可以在敲打命令的过程中得到该命令的签名提示。

![signature-help](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/signature-help.gif)

## 自动补全

当您敲击了以下任意字符时，大憨批将自动计算补全提示：`[' ', ',', '{', '[', '=', ':', '/', '!', "'", '"', '.', '@']`。此外您也可以使用 Ctrl + Space 快捷键（或其他自行设定的按键）来手动触发自动补全。不过请注意：并非所有地方都能提供自动补全。通常只在参数或文本的开头能够提供。

大憨批能够提供简单命令的自动补全：
![simple-completions](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/simple-completions.gif)

复杂的 NBT 标签的自动补全（感谢 MrYurihi、Levertion 与 Bassab03 贡献的 [mc-nbt-paths](https://github.com/MrYurihi/mc-nbt-paths)）：
![nbt-tag-completions](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/nbt-tag-completions.gif)

以及 NBT 路径的自动补全：
![nbt-path-completions](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/nbt-path-completions.gif)

**甚至是物品标签里面的 JSON 文本里面的命令里面的 NBT**的自动补全，返回的结果将会自动进行转义：
![ohhhh-completions](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/ohhhh-completions.gif)

## 代码片段

大憨批提供了一些有用的代码片段。有关代码片段是什么可以参考 [VSCode 的官方文档](https://code.visualstudio.com/docs/editor/userdefinedsnippets)。大憨批与 VSCode 均提供了让你自定义代码片段的功能，并且由于大憨批基于 VSCode，它们定义代码片段的语法也完全一致。对于 mcfunction 函数文件来说，由大憨批添加的代码片段将只会在光标位于命令开头时出现在补全提示的列表中，而由 VSCode 的 `Code/User/snippets/mcfunction.json` 文件添加的代码片段则会在任何情况下都能出现在补全提示中。如果你想用 VSCode 来自定义代码片段，看[他们的官方文档](https://code.visualstudio.com/docs/editor/userdefinedsnippets)；如果你想用大憨批来自定义代码片段，则需要看本文的[配置](#配置)部分.

![code-snippets](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/code-snippets.gif)

## 定义注释

你可以使用形如 `#define (bossbar|entity|objective|storage|tag|team) <标识符: string> [描述: string]` 的格式来定义一个实体、数据储存或记分板标签。定义注释中定义的内容将会参与到补全提示的计算、符号的重命名、查找引用或定义等操作当中。Minecraft 本身会把这些定义注释当作普通的注释并直接忽略掉，只有大憨批会读取这些注释。

![definition-comments](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/definition-comments.png)

## 错误提示

大憨批能够提供实时的错误提示。它既能像 Minecraft 一样展现语法错误，也能给予你更加详细的警告信息。

![diagnostics](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/diagnostics.gif)

## 折叠区域

您可以使用注释来定义折叠区域，使得 mcfunction 文件结构更加清晰。

```mcfunction
#region 这是一吨穷举命令，不穷举你会变得更强？
execute if score @s test matches 1 run say 1
execute if score @s test matches 2 run say 2
execute if score @s test matches 3 run say 3
execute if score @s test matches 4 run say 4
execute if score @s test matches 5 run say 5
#endregion
```

![folding-region](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/folding-region.gif)

## 颜色信息

大憨批能够为 `dust` 粒子以及一些 NBT 标签提供颜色信息，这是真正的憨批行为。你可以把光标悬浮在颜色上几秒钟，这样就能直接更改颜色了。

![color-information](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/color-information.gif)

## 悬浮信息

不好意思，没做。

## 解析命名空间 ID

您可以通过按着 Ctrl 左击进度、战利品表、函数、断言以及各种标签的命名空间 ID 来跳转到对应的文件。

![document-link](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/document-link.gif)

## 跳转到定义

您可以通过按着 Ctrl 左击记分项名、实体名、标签名、队伍名、bossbar ID、数据储存 ID 来跳转到对应的定义行数。

![goto-definition](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/goto-definition.gif)

## 查找引用

您可以通过 Shift + F12 快捷键或其他自行设定的按键来查找所有该进度、战利品表、函数、断言、数据包标签、实体、标签、计分项、队伍、bossbar 或数据储存在当前工作区中的所有引用。

![peek-references](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/peek-references.gif)

## 重命名

您可以通过 F2 或其他自行设定的按键来重命名进度、战利品表、函数、断言、数据包标签、实体、标签、队伍、bossbar 或数据储存。

在整个工作区中相应的引用都会被重命名。

**警告**：重命名可能导致您的函数内容损坏，请及时备份。使用风险请自行承担。

![rename-objective](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/rename-objective.gif)

此外，如果您重命名了一个有着文件定义的命名空间 ID（例如进度、战利品表、函数、断言以及各种标签的命名空间 ID），在工作区当中的对应文件也将会被移动或重命名。

![rename-function](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/rename-function.gif)

*然而*，直接手动重命名工作区中的一个文件并*不会*更新它的命名空间 ID，并且可能会导致缓存错误。

## 格式化与校验

您可以通过按下 Shift + Alt + F 或其他自行设定的快捷键来格式化当前文档。

您可以在配置中设置一些格式化与校验的规则。

**警告**：格式化功能可能导致您的函数内容损坏，请及时备份。使用风险请自行承担。格式化功能默认是禁用的，如果您要使用，应当在设置界面中勾选 `datapackLanguageServer.lint.enableFormatting`。

![formatting](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/formatting.gif)

## 配置

使用 Ctrl + `,`（或其他绑定的快捷键）来打开 VSCode 的设置页，并搜索 `datapacklanguageserver` 来查看所有由大憨批提供的配置选项。通过修改这些选项，你可以自行添加代码片段、设置格式化与校验偏好，以及修改运行环境的相关信息。这些选项既可以是为当前用户设置的，也可以是为当前工作区设置的。有关修改配置选项的具体内容请查看 [VSCode 的官方文档](https://code.visualstudio.com/docs/getstarted/settings)。

# 贡献者

大憨批目前已有 36 名直接贡献者，没有他们就没有大憨批的今天。完整的贡献者列表请在 [README.md](https://github.com/SPGoding/datapack-language-server#contributors) 查看。

# Q：大憨批就是个垃圾！

请把您的意见、建议、遇到的问题等发布在 [GitHub issues](https://github.com/SPGoding/datapack-language-server/issues)，或直接回复在论坛发布帖之下。发布在 GitHub 有利于本人对其进行追踪，并便于将您加入到贡献者列表中；发布在论坛有利于我个人给予您相应积分奖励。如果您乐意，当然可以**在两处都进行反馈**。

# Q：大憨批真好用！

谢谢。您有很多种对大憨批表示支持的方式。

- 如果您喜欢大憨批的话，这就足够了。
- 如果您的 MCBBS 帐号有权限的话，在本人的论坛发布页评满各项分值，这对本人申请精华有很大帮助；
- 如果您有 GitHub 帐号的话，给本人的 [GitHub 仓库](https://github.com/SPGoding/datapack-language-server)点一个 Star；
- 如果您有微软帐号的话，在本人的[插件发布页](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server&ssr=false#review-details)给一个五星好评。
- 如果您有 CBer 朋友的话，把大憨批安利给 TA；
- 如果您有钱的话，留着自己买点儿好吃的吧。
