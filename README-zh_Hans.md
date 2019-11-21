![banner](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/banner.png)

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

Datapack Helper Plus，简称 DHP，中文名大憨批，是 [pca006132](https://www.mcbbs.net/home.php?mod=space&uid=193048) 前辈制作的 [Datapack Helper](https://www.mcbbs.net/thread-772929-1-1.html) 的精神续作，是一个能够为 Minecraft Java版 1.15 的数据包提供补全、签名信息、重命名、查找定义或引用、错误提示、折叠、颜色信息、悬浮信息与文档链接的重型语言服务器。您可以将其安装在 [VSCode](https://code.visualstudio.com/) 编辑器上。大憨批目前仍在制作当中，因此有些功能还未完成，均在下文有所标注。

# 安装

点这个图标就可以从网页安装：[![VSCode Marketplace](https://img.shields.io/visual-studio-marketplace/v/SPGoding.datapack-language-server.svg?logo=visual-studio-code&style=flat-square)](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server)。

或者，您也可以直接打开 VSCode，按 Ctrl + P，复制粘贴 `ext install spgoding.datapack-language-server` 并回车。

# 注意

0. 大憨批使用缓存文件来加速重命名、查找引用或定义。缓存文件存储在工作空间的 `.datapack/cache.json` 文件当中。该文件不应当手动编辑。如果你用了 Git 一类的版本控制工具，记得把它加到 `.gitignore` 里面。
1. 请使用数据包的根目录（即和 `data`、`pack.mcmeta` 的同目录）作为你的工作空间（右键文件夹空白处，选择「在此处打开 VSCode」即可）。否则一切涉及到缓存的功能（例如重命名、查找引用或定义、部分自动补全等）将不能正常运作。

# 特性

## 语义化高亮

不存在的。近阶段请使用 [Arcensoth](https://github.com/Arcensoth) 制作的 [language-mcfunction](https://marketplace.visualstudio.com/items?itemName=arcensoth.language-mcfunction) 插件。下面的截图都是既使用了 Arcensoth 的高亮插件、也使用了我的大憨批来截图的。

## 签名信息

您可以在敲打命令的过程中得到该命令的签名提示。

![signature-help](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/signature-help.gif)

## 自动补全

当您敲击了以下任意字符时，大憨批将自动计算补全提示：`[' ', ',', '{', '[', '=', ':', '/', '!', "'", '"', '.', '@']`。此外您也可以使用 Ctrl + Space 快捷键（或其他自行设定的按键）来手动触发自动补全。不过请注意：并非所有地方都能提供自动补全。通常只在参数或文本的开头能够提供。

大憨批能够提供简单命令的自动补全：
![simple-completions](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/simple-completions.gif)

复杂的 NBT 标签的自动补全：
![nbt-tag-completions](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/nbt-tag-completions.gif)

以及 NBT 路径的自动补全：
![nbt-path-completions](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/nbt-path-completions.gif)

**甚至是物品标签里面的 JSON 文本里面的命令里面的 NBT**的自动补全，返回的结果将会自动进行转义：
![ohhhh-completions](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/ohhhh-completions.gif)

## 定义注释

你可以使用形如 `#define (entity|storage|tag) <标识符: string> [描述: string]` 的格式来定义一个实体、数据储存或记分板标签。定义注释中定义的内容将会参与到补全提示的计算、符号的重命名、查找引用或定义等操作当中。Minecraft 本身会把这些定义注释当作普通的注释并直接忽略掉，只有大憨批会读取这些注释。

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

大憨批能够为 `dust` 粒子提供颜色信息，这是真正的憨批行为。你可以把光标悬浮在颜色上几秒钟，这样就能直接更改颜色了。

![color-particle](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/color-particle.gif)

## 悬浮信息

不好意思，没做。

## 解析命名空间 ID

您可以通过按着 Ctrl 左击进度、战利品表、函数、断言以及各种标签的命名空间 ID 来跳转到对应的文件。

![document-link](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/document-link.gif)

## 跳转到定义

您可以通过按着 Ctrl 左击记分项名、实体名、标签名、队伍名、bossbar ID、数据储存 ID 来跳转到对应的定义行数。

![goto-definition](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/goto-definition.gif)

## 查找引用

您可以通过 Shift + F12 快捷键或其他自行设定的按键来查找所有该进度、战利品表、函数、断言、数据包标签、实体、标签、计分项、队伍、bossbar 或数据储存在当前工作空间中的所有引用。

![peek-references](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/peek-references.gif)

## 重命名

您可以通过 F2 或其他自行设定的按键来重命名进度、战利品表、函数、断言、数据包标签、实体、标签、队伍、bossbar 或数据储存。

在整个工作空间中相应的引用都会被重命名。

**警告**：重命名可能导致您的函数内容损坏，请及时备份。使用风险请自行承担。

![rename-objective](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/rename-objective.gif)

此外，如果您重命名了一个有着文件定义的命名空间 ID（例如进度、战利品表、函数、断言以及各种标签的命名空间 ID），在工作空间当中的对应文件也将会被移动或重命名。

![rename-function](https://raw.githubusercontent.com/SPGoding/datapack-language-server/master/img/rename-function.gif)

*然而*，直接手动重命名工作空间中的一个文件并*不会*更新它的命名空间 ID，并且可能会导致缓存错误。

## 格式化与校验

不好意思，没做。

# 贡献者

感谢这些可爱的人们对本项目的各种帮助。为更新及时，请查看 [README.md](https://github.com/SPGoding/datapack-language-server#contributors) 中的相应部分。下方仅放置截图作为预览。

[attachimg]1411491[/attachimg]

# Q：大憨批就是个垃圾！

请把您意见、建议、遇到的问题等发布在 [GitHub issues](https://github.com/SPGoding/datapack-language-server/issues)，或直接回复在论坛发布帖之下。发布在 GitHub 有利于本人对其进行追踪，并便于将您加入到贡献者列表中；发布在论坛有利于我个人给予您相应积分奖励。如果您乐意，当然可以**在两处都进行反馈**。

# Q：大憨批真好用！

谢谢。您有很多种对大憨批表示支持的方式。

- 如果您喜欢大憨批的话，这就足够了。
- 如果您的 MCBBS 帐号有权限的话，在本人的论坛发布页评满各项分值，这对本人申请精华有很大帮助；
- 如果您有 GitHub 帐号的话，给本人的 [GitHub 仓库](https://github.com/SPGoding/datapack-language-server)点一个 Star；
- 如果您有微软帐号的话，在本人的[插件发布页](https://marketplace.visualstudio.com/items?itemName=SPGoding.datapack-language-server&ssr=false#review-details)给一个五星好评。
- 如果您有 CBer 朋友的话，把大憨批安利给 TA；
- 如果您有钱的话，留着自己买点儿好吃的吧。
