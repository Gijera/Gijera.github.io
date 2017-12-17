---
layout: article
title: 使用Comm(ent|it)为Jekyll静态博客添加评论
category: Jekyll
tags: Jekyll Comm(ent/it)
---
本文介绍了如何使用Comm(ent/it)为Jekyll静态博客添加评论，Comm(ent/it)使用的原理是：评论时需要授权Github、Facebook或Twitter账号，当有人评论时会自动提交一个Pull Request，作者通过合并请求来为博客添加评论，评论即添加在每篇文章的yml头信息里，可以在网站中调用comments变量来获得所有的评论。

### 什么是Comm(ent|it)
参考Comm(ent/it)的官方主页: [Comm(ent/it)](https://commentit.io)

Comm(ent/it)是一个Jekyll静态网站评论系统，使用Github API和Jekyll将评论存储到你自己的github仓库之中，不需要借助其他库或数据库。另外，支持Github、Facebook以及Twitter，效果可以看到文章末尾。

### 如何使用Comm(ent|it)
参考Comm(ent/it)的[Getting started](https://commentit.io/getting-started)

这个页面可能需要登陆后才能看见，因为要根据你的登陆数据生成JS脚本。主要来说有两个步骤：
1. 添加评论框
2. 使用Liquid语言显示所有评论

另外Comm(ent/it)可以设置:是否使用分支的pull request提交，或是直接使用master的gh分支；另外就是设置是否为每个页面提交不同的分支，或是所有的评论都使用一个分支。

### 为什么选择Comm(ent|it)
Jekyll博客的评论系统大致分为两种：一种是博客评论系统，类似于Disqus，国内有畅言，多说之类的；另一种是通过Github的issue或是pull request。

<strong>1.博客评论系统</strong>

众所周知，Disqus已经被墙了，所以之前的很多使用Disqus评论系统的Git Page已经无法显示评论，而国内的多说已经差不多了，搜狐旗下的畅言需要进行备案才能使用，如果想使用Disqus，可以参考Fooleap的这篇文章：[科学使用 Disqus](http://blog.fooleap.org/use-disqus-correctly.html)，以及他在Github中为Disqus的php请求写的一个[Disqus-PHP-API](https://github.com/fooleap/disqus-php-api/blob/master/api/init.php#L37)。

<strong>2.Github评论系统</strong>

除了Comm(ent/it)以外，通过issue提交评论的一款叫做[gitment](https://github.com/imsun/gitment)的应用也可以，使用方法可以参考这篇文章：[Jekyll博客添加评论系统gitment篇](http://www.qingpingshan.com/jianzhan/cms/301109.html)，不过据说存在一些安全问题。