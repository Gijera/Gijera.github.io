---
layout: article
title: Laravel搭建博客 (会话处理和闪存信息)
category: Laravel
tags: Laravel L5 Blog Session Flash
---
本段介绍Laravel的会话处理和闪存，闪存功能可以把数据保存到下一次Http请求，用来处理某些特定的消息非常适合。

### 会话处理与闪存信息
所有用法可以参考Laravel的中文官网：[Laravel Session](https://d.laravel-china.org/docs/5.1/session#基本用法)。

在这里使用会话处理和闪存来给文章发表时提供一条提示信息。当文章发表时会自动跳转到主页，所以在<samp>layouts/master.blade.php</samp>中添加显示闪存内容的blade代码：
{% highlight html %}
{% raw %}
@include('layouts.nav');
    
@if($flash = session('message'))
<div class="alert alert-success" role="alert">
  {{$flash}}
</div>
@endif
{% endraw %}
{% endhighlight %}
然后到PostsController的store方法中，因为这个方法是在文章发表时处理表单并存储文章，在成功保存Post之后可以添加一个闪存数据：
{% highlight php %}
session()->flash('message', 'Your post has now been published.');
{% endhighlight %}
然后到<samp>/posts/create</samp>下面添加文章测试，发表之后就会看到这条提示信息：

![Flash](http://ozwfmed7j.bkt.clouddn.com/Laravel-Blog-9.png)