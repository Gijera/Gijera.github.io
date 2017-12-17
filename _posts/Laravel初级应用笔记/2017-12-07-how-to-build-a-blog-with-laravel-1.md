---
layout: article
title: Laravel搭建博客 (结构与布局)
category: Laravel
tags: Laravel L5 Bootstrap Blog
---
通过使用Laravel搭建一个博客来熟悉Laravel的各种功能，在搭建博客的过程中使用了Bootstrap Css框架，本篇文章实现Blog的基本布局，学习过程主要参考了Laravel官方手册以及JefferyWay的视频教程。

### 结构与布局
首先来完成一些布局，删除原本的welcome.blade.php，创建一个layout.blade.php；然后可以将路由更改一下，因为要搭建的是一个博客，所以可以让主页显示为文章列表页，在路由中更改：
{% highlight php %}
Route::get('/','PostsController@index');
{% endhighlight %}
接下来创建Post(文章)的Controller、Model以及Migration，运行artisan命令：
{% highlight shell %}
php artisan make:controller PostsController
php artisan make:model Post
php artisan make:migration create_posts_table --create=posts
{% endhighlight %}
给Post Migration中添加一些文章需要的字段，例如标题、内容等：
{% highlight php %}
Schema::create('posts', function (Blueprint $table) {
    $table->increments('id');
    $table->string('title');
    $table->text('body');
    $table->timestamps();
});
{% endhighlight %}
使用命令<samp>php artisan migrate</samp>将上面的设置保存到数据库中。由于前面将路由传递给了PostsController中的index方法，所以接下来在PostsController中创建index方法：
{% highlight php %}
public function index(){
    return view('posts.index');
}
{% endhighlight %}
index方法将返回一个posts/index.blade.php的视图，所以继续创建相应的文件，可以让它继承最开始创建的layout.blade.php，这样会使布局结构更为合理。
{% highlight html %}
<!-- layout.blade.php -->
<!DOCTYPE html>
<html>
<head>
	<title>Application</title>
</head>
<body>
	@yield('content')
</body>
</html>

<!-- posts/index.blade.php -->
@extends('layout')

@section('content')
	Hello World
@endsection
{% endhighlight %}
刷新浏览器后可以看到“Hello World"，视图的继承功能以及嵌入功能是Blade模版所实现的。现在到[Bootstrap](https://getbootstrap.com)中来添加一些必要的css文件，这是为了让博客更加美观；并且博客的最终效果也就是[Bootstrap Blog](https://getbootstrap.com/docs/4.0/examples/blog/#)的样子。

首先查看bootstrap blog页面的源代码，复制该页面的html源码到layout.blade.php中，为了让结构更加清楚，在view/下建立一个layouts的文件夹，把layout.blade.php放到里面，然后更名为master.blad.php；同时将posts/index.blade.php中的extends目录更改为相应的位置。在layout.blade.php中，替换bootstrap.css文件为CDN文件，然后将页面中的blog.css拷贝一份到public/css/blog.css中，最后去掉所有的js引用，然后到浏览器中刷新，可以看到跟Bootstrap模版中一样的页面。

![Blog](http://ozwfmed7j.bkt.clouddn.com/%E5%B1%8F%E5%B9%95%E5%BF%AB%E7%85%A7%202017-12-07%2010.43.52.png){:height="100%" width="100%"}

layout/master.blade.php中含有导航、侧边栏、主页内容以及页脚，更好的办法是将它们分开放到不同的文件中。将<samp>nav</samp>中的内容放到layouts/nav.blade.php之中，<samp>aside</samp>标签中的内容则放到layouts/sidebar.blade.php之中，同理，<samp>footer</samp>中的内容放到layouts/footer.blade.php之中。最后将<samp>blog-main</samp>的内容放到posts/index.blade.php之中，替换掉之前的‘Hello World’，最后master.blade.php只剩下一点点的内容：
{% highlight html %}
<!doctype html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta name="viewport" content="width=device-width, initial-scale=1, shrink-to-fit=no">
    <meta name="description" content="">
    <meta name="author" content="">

    <title>Blog Template for Bootstrap</title>

   <link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/4.0.0-beta.2/css/bootstrap.min.css" integrity="sha384-PsH8R72JQ3SOdhVi3uxftmaW6Vc51MKb0q5P2rRUpPvrszuE4W1povHYgTpBfshb" crossorigin="anonymous">

    <link href="/css/blog.css" rel="stylesheet">
  </head>

  <body>

    @include('layouts.nav');

    <main role="main" class="container">

      <div class="row">

        @yield('content')

        @include('layouts.sidebar')

      </div>

    </main>

    @extends('layouts.footer');
  </body>
</html>
{% endhighlight %}
刷新页面之后，效果仍然与模版一样。

最后，尝试到某一篇文章的页面中使用同样的布局；在routes中添加：
{% highlight php %}
Route::get('/posts/{post}','PostsController@show');
{% endhighlight %}
同样的到view/posts/创建show.blade.php：
{% highlight html %}
@extends('layouts.master')

@section('content')
	<h1>A place to show the post</h1>
@endsection
{% endhighlight %}
然后在PostsController中添加show方法：
{% highlight php %}
public function show(){
	return view('posts.show');
}
{% endhighlight %}
然后随便输入一个id，<samp>localhost/posts/1</samp>，可以看到与index内容不同，文章内容全部不见了，但是导航、侧边栏、页脚全部都在，效果图与Bootstrap Templete一样；到此为止，完成了基本布局。