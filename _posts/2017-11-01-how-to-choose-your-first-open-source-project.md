---
title: 如何选择(和贡献)你的第一个开源项目
image: first-open-object.png
---
> 翻译于github的文章推荐：[How to choose (and contribute to) your first open source project](https://github.com/collections/choosing-projects)
 ——作者 [Katrina Owen](https://github.com/kytrinyx?page=2&tab=repositories)

第一个贡献总是令人生畏的，这有点像走进一间全是陌生人的房间，他们大多数人之间似乎都认识对方。你不懂他们的圈内笑话(inside jokes)，或是圈外的笑话，进一步说，他们谈论的流行文化(pop culture)是你从来没有听说过的。你不知道如何融入他们之间，如果有人侧身让你加入他们的交谈，他们可能会给你一个轻蔑的眼神，他们会告诉你，你穿错了衣服，你眼睛的颜色不对，甚至你的发音也不对。

这可能不仅仅发生在你提交第一个pull request，甚至打开一个issue也让你感到胆怯。你遇到的是真正的问题吗？他们可能会告诉你你非常的愚蠢——因为你应该去做点什么小玩意。

作为[Exercism](http://exercism.io)项目的维护者，我看到过许多人开始使用新的编程语言，提交或接受关于代码的反馈，以及对开源项目作出第一个贡献。你的第一个贡献可能很可怕，但是有了正确的指导，我相信你会像我一样热爱开源社区并热衷于成为其中的参与者。

这里有一些我挑出来的资源可以帮助你找到第一个开源项目以及做出有影响力的贡献来提高自己的编程技巧。

### 从你使用的项目开始
将你已经使用过的开源项目作为开始是最好的方法，有以下好处：

* 你会更熟悉这个项目是什么以及它是如何工作的
* 你更加能投入于项目的改进和效果
* 你与项目的关系会更进一步，更加可能使你保持持续进步

想想你喜欢的库、模块、插件或者工具，看看你的工作项目或副项目(side projects)的依赖性列表，找到repository并且浏览下里面的代码，文档，打开issue感受一下该项目的感觉。

不必去寻找你能想到的最大、最令人印象深刻的开源项目，有时候一个小一点项目能够让你的头脑更清醒。而且因为贡献者比较少，项目的维护者有更大的几率感谢你的贡献。

没有办法能够预先知道项目是否会接受你的贡献，但是有两件事可以提高你的代码被采纳的几率。

第一件事就是找到项目中欢迎贡献者的有关信息，第二件事就是弄清楚他们需要贡献的是什么内容。

### 评估项目
你可以通过观察两件事——活动和交流风格，来对项目有一个更好的直觉——你是否想参与它。

查看commits列表，最近有commits吗？更新commit的的频率怎么样？大部分的commit是由一个人提交的还是有许多人们共同参与？

然后看看issues，查看open的issues。里面有多少issue？有新的吗？有时间很长的吗？维护者是否对其中的issue作出回应？他们进行了活跃的讨论了吗？然后再看看已经关闭的issues，近期他们有关闭过issue吗？

然后到pull request里面看看，像commit和issue一样。

当然，这些都不是绝对的，你不是在寻找绝对的数字。即使他们没有很多的活动，这也有可能是一个很好的项目，只不过它已经比较成熟和稳定了，不需要改变很多。但是如果一个项目有很多打开很久的issues和pull requests，却没有得到维护者的回应，这可能是一个危险的信号。

按照评论数量查看 issues 和 pull request，看看评论最多的，熟悉大家交流的风格，他们对贡献者友好吗？他们会处理好分支吗？维护者会对贡献者表示感谢吗？

有些维护者会对新的贡献者表示欢迎，会发送友好的感谢信息或emoji表情。

花点时间读读旧的issues或是邮件列表内容，如果他们有闲聊或是一些社交聊天频道，可以去看看，尽可能的收集关于项目工作的信息。对项目的交流有一个更好的感觉并且确保你愿意花时间跟这些人们共同参与这个项目。

> 当我第一次听到Babel的时候，我对它能够增加开发经验的方式感到非常兴奋。我遵循了Dan Abramov的建议：“观察” Github repo，尝试在项目和它的issues中得到更多的上下文信息，我在2015年3月2日提交了我的第一个 Babel pull request。
—— [@hzoo](https://github.com/open-source/stories/hzoo)

### 尝试
一旦找到一个你想为之贡献的项目，查看它的README文件，Readme通常有项目的贡献指南的链接，通常叫做Contributing.md，如果没有在Readme中找到它，你可以直接在项目中搜索它。

这些文件并不是一个项目的标准需求，但是这对于项目寻找贡献者以及贡献内容是一个很好的途径。

另一个寻找这些内容的地方是issues，你可以查找类似带有“help wanted”或是“good first issue”之类标签的issues。

**不要仓促的打开issue或是pull request**

当你准备好为项目做一个贡献时，最好从小的地方做起。小的贡献能够让项目的维护者更了解你，这使他们可能更容易接受你的一些更大的贡献。

最好的开始贡献的方法之一就是帮助测试项目，当一个新的bug被发现的时候，看看你是否能复制这些错误，然后提交你的发现。

如果你一直观察，你会发现那些重复的问题以及那些被fixed却从未被关闭的issue。人们会问一些你知道答案的问题，你可以指引他们到相应的文档，如果没有文档，你可以向文档提交一个修复的建议。

>我决定开始为这个团队管理电子邮件摘要，这给了我很好的机会来弄清一些话题，但是更重要的是我可以看到人们指出哪些问题需要被修复。
—— @brettcannon in his [Open Source Story](https://github.com/open-source/stories/brettcannon)

文档可以是最简单的，也可能是最难的贡献。有些唾手可得的拼写或是语法上的错误；另外文档的改变经常是在一定的范围内，可能是某一部分重新更改，用来提高可读性；或者是为遇到的一个特殊案例更新文档。一些更具有挑战性的文档可能涉及到重构或是一些底层指导。

从测试和文档开始，你可以看到你所贡献的一些小小的改变。

### 了解别人是怎么做的
如果你很想开始你的第一个贡献，但是又感到非常的紧张，这并不只有你一个人。即使是专业的软件开发人员也会感觉开源软件令人生畏，因为这涉及到你可能要与从未见过的人合作。

读读这些别人的经历来减弱你的害怕，从刚刚起步到成为专业的软件开发者，每个人都有关于第一次贡献代码的故事。

* [A Beginner’s Very Bumpy Journey Through The World of Open Source](https://medium.freecodecamp.org/a-beginners-very-bumpy-journey-through-the-world-of-open-source-4d108d540b39)
* [Lessons from my First Open Source Contribution](https://dev.to/andy/lessons-from-my-first-open-source-contribution)
* [Open Source: 9 steps to my first feature contribution in Babel](https://maurobringolf.ch/2017/07/open-source-9-steps-to-my-first-feature-contribution-in-babel)
* [Figuring out how to contribute to open source](https://jvns.ca/blog/2017/08/06/contributing-to-open-source/)

### 寻找一个陌生的，热情的项目
从一个你已经使用过的项目开始是一件比较容易的事情——如果你想为一个从来没接触过的项目或是想法做贡献，下面这些资源可以帮助你：
* [Your First PR](https://yourfirstpr.github.io/)
* [Up for Grabs: Projects which have curated tasks specifically for new contributors](http://up-for-grabs.net/#/)
* [CodeTriage: Help out your favorite open source projects and become a better developer while doing it.](https://www.codetriage.com/)

如果你正在寻找对新的贡献者特别友好的项目，可以看看这些社区。它们有很好的文件和热情的氛围:

* [rust-lang/rust](https://github.com/rust-lang/rust)
* [HospitalRun / hospitalrun-frontend](https://github.com/HospitalRun/hospitalrun-frontend)
* [hoodiehq / hoodie](https://github.com/hoodiehq/hoodie)
* [pybee / batavia](https://github.com/pybee/batavia)
* [Homebrew / brew](https://github.com/Homebrew/brew)

### 舒服的工作
如果你没有被这个过程吓到，你会对开源贡献感到更有信心。这里有一些资源可以帮助你开始：
* [How to Contribute to Open Source](https://opensource.guide/how-to-contribute/)
* [Make a Pull Request](http://makeapullrequest.com/)
* [Patchwork: Casual, mentored workshops for beginners to Git and GitHub.](http://patchwork.github.io/)

这里有一些组织帮助你了解Git，Github和对贡献开源软件：
* [freeCodeCamp](https://github.com/freeCodeCamp)
* [CodeBuddies Community](https://github.com/codebuddiesdotorg)
* [Your First PR](https://github.com/yourfirstpr)
* [NodeSchool](https://github.com/nodeschool)
* [OpenHatch](https://github.com/openhatch)

### 让这些成为习惯
每个人都有新的一次尝试，你的第一个开源贡献可能要花费一些时间，但这不是结束，规律性的贡献代码对你自己和你的社区都是很棒的事情。这些程序可以帮助你保持动力，让贡献开源代码成为你的习惯：
* [Open Source Friday](https://github.com/ossfriday)
* [24 Pull Requests](https://github.com/24pullrequests)

> 本文遵循自由转载-非商用-非衍生-保持署名（[知识共享3.0协议](https://creativecommons.org/licenses/by-nc-nd/3.0/deed.zh)）
This article follows the CC-3.0 License.