---
layout: article
title: Laravel搭建博客 (添加与显示文章)
category: Laravel
tags: Laravel L5 Blog Post
---
本文描述了如何通过表单发送Post请求来添加文章以及显示文章，介绍了Laravel的表单验证及一些安全性。

### 使用表单添加文章
<strong>1.添加Get路由<samp>'/posts/create'</samp></strong>

不过要注意之前添加的<samp>'/posts/{post}'</samp>路由，记得把它注释掉，否则create将会被作为变量传递给<samp>{post}</samp>，就无法显示create页面了。

<strong>2.将路由交给PostsController的create方法处理</strong>

创建create方法即可，然后在里面添加Posts/create.blade.php视图。

<strong>3.创建Posts/create.blade.php文件</strong>

在里面添加要显示的html文件，比如，让它显示‘Create a post’字符串。
{% highlight php %}
//1.routes.php
Route::get('/posts/create','PostsController@create');

//2.PostsController.php
public function create(){
	return view('posts.create');
}

//3.Posts/create.blade.php
@extends ('layouts.master')

@section('content')
	<h1>Create a Post</h1>
@endsection
{% endhighlight %}

<strong>4.给create.blade.php添加表单</strong>
{% highlight php %}
@extends ('layouts.master')

@section('content')
<div class= "col-sm-8 blog-main">
	<h1>Publish a Post</h1>
	<hr>
	<form method="POST" action="/posts">
		{% raw %}{{csrf_field()}}{% endraw %}
	  <div class="form-group">
	    <label for="title">Title</label>
	    <input type="text" class="form-control" id="title" name="title">
	  </div>
	  <div class="form-group">
	    <label for="exampleInputPassword1">Body</label>
	    <textarea id="body" name="body" class="form-control"></textarea>
	  </div>
	  <button type="submit" class="btn btn-primary">Publish</button>
	</form>
</div>
@endsection
{% endhighlight %}
<span class="text-danger">注意其中的csrf验证</span>。效果如下：

![Post Form](http://ozwfmed7j.bkt.clouddn.com/laravel-blog-3.png)

<strong>5.处理表单</strong>

注意到上面的Form中填写了发送Post请求到<samp>'/posts'</samp>目录之下，所以创建一个Post路由<samp>'/posts'</samp>，然后指定PostsController的store方法来处理请求：
{% highlight php %}
public function store(){
	//创建Post对象
	$post = new \App\Post;
	$post->title = request('title');
	$post->body = request('body');

	//保存到数据库
	$post->save();

	//跳转到主页
	return redirect('/');
}
{% endhighlight %}
然后到create页面中随意测试输入Title和Body，点击Publish，随后页面跳转到主页，可以在终端使用<samp>php artisan tinker</samp>来查看数据是否被存储，在Tinker中输入<samp>App\Post::all()</samp>，按回车键即可看到刚才输入的数据。

创建Model以及保存有许多方法，上面是将request中的单个数据提出来单独赋值到Post对象的属性中，最后save，也可以使用Model的create方法来保存一个新的模型，比如：
{% highlight php %}
Post::create(request()->all());
//or
Post::create([
	'title' => request('title'),
	'body' => request('body')
]);
{% endhighlight %}
如果使用上面这些方法来创建Post Model，那么很可能会得到一个错误：<span class="text-danger">MassAssignmentException</span>，这是因为Laravel对批量赋值做了一些保护，需要在模型中指定<samp>fillable</samp>或是<samp>guarded</samp>属性，才可以这么做，详情可以参考[Laravel Eloquent——批量赋值](https://d.laravel-china.org/docs/5.1/eloquent#批量赋值)。
{% highlight php %}
//指定不可以批量赋值的字段
class Post extends Model
{
    protected $guarded = [];
}

//or 指定可以批量赋值的字段
class Post extends Model
{
    protected $fillable = ['title','body'];
}
{% endhighlight %}

为了后面的其他Model也可以批量赋值，所以可以提出一个Model类作为父类，创建一个文件app/Model.php，将代码统一放在Model.php中：
{% highlight php %}
<?php

namespace App;

use Illuminate\Database\Eloquent\Model as Eloquent;

class Model extends Eloquent
{
    protected $guarded = [];
}
{% endhighlight %}
现在可以把app/Post.php中的有关代码去掉，去掉之后就像这样：
{% highlight php %}
<?php

namespace App;

class Post extends Model
{

}
{% endhighlight %}
后面创建的Model就不用再设置批量赋值了，这样可以减少一些工作量，但是在实际网站中可能会需要批量赋值保护。

### 表单验证
通常情况下，在填写表单的时候，需要验证表单；尤其是有的字段内容不能为空的时候，否则提交一个空表单会导致数据库级别的错误，这对用户来说非常不友好，Laravel提供了一些功能来验证表单。在使用数据创建Post Model之前，可以加入这样一段代码来验证表单：
{% highlight php %}
$this->validate(request(),[
	'title' => 'required|min:2',
	'body' => 'required'
]);
{% endhighlight %}
这要求Title和body都必须填写，并且Title最少要有两个字符，更多的表单验证功能，可以参考[Laravel表单验证——可用的验证规则](https://d.laravel-china.org/docs/5.1/validation#可用的验证规则)

现在如果没有填写<samp>title</samp>与<samp>body</samp>字段，页面将不会发送post请求，并且会生成一些错误信息，可以把错误信息调出来，在view/posts/create.blade.php中加入错误信息段：
{% highlight html %}
@if (count($errors))
<div class="form-group">
	<div class="alert alert-danger">
		<ul>
			@foreach($errors->all() as $error)
				<li>{% raw %}{{$error}}{% endraw %}</li>
			@endforeach
		</ul>
	</div>
</div>
@endif
{% endhighlight %}
现在如果没有错误，这一段代码就不会显示，如果出现错误，错误将会在页面底部显示出来：

![Error](http://ozwfmed7j.bkt.clouddn.com/Laravel-Blog-4.png)

另外可以发现这一段代码用到的<samp>$errors</samp>变量，Laravel中所有错误都会放在里面，所以这段代码可以提取出来，如果其他地方也需要显示错误，可以直接使用<samp>@include</samp>把它包括进来，将它放在view/layouts/errors.blade.php中。

### 显示文章
<strong>1.显示所有文章列表</strong>

<samp>/</samp>路由是Blog的主页，之前使用了Bootstrap中的模版，所以主页显示的还是Bootstrap的示例文章列表，现在首先将Blog数据库中的文章数据取出来显示在首页，首页是由PostsController中的index方法负责，在index方法中：
{% highlight php %}
public function index(){
	$posts = Post::all();

    return view('posts.index', compact('posts'));
}
{% endhighlight %}
将所有的Post数据全部传递给posts/index.blade.php视图，然后由视图文件来负责将文章显示出来：
{% highlight html %}
@extends('layouts.master')

@section('content')
	<div class="col-sm-8 blog-main">
      
      @foreach ($posts as $post)
        @include('posts.post')
      @endforeach
      
      <nav class="blog-pagination">
        <a class="btn btn-outline-primary" href="#">Older</a>
        <a class="btn btn-outline-secondary disabled" href="#">Newer</a>
      </nav>

   </div>
@endsection
{% endhighlight %}
这里可以看到将每篇文章都显示出来了，但是文章内容交给posts/post.blade.php来显示：
{% highlight html %}
<div class="blog-post">
	<h2 class="blog-post-title">{% raw %}{{$post->title}}{% endraw %}</h2>
	<p class="blog-post-meta">January 1,2017 by <a href="#">Mark</a></p>

	{% raw %}{{ $post->body }}{% endraw %}
</div>
{% endhighlight %}
现在刷新主页，可以看到主页显示的是之前在表单中添加的文章数据。

此外，我们可以将时间显示为Laravel在Migrate中自动创建的<samp>created_at</samp>或<samp>updated_at</samp>字段，可以借用[Carbon](http://carbon.nesbot.com/docs/)来格式化时间，Carbon是一个非常好用的PHP时间的API。
{% highlight html %}
<p class="blog-post-meta">
	{% raw %}{{$post->created_at->toFormattedDateString()}}{% endraw %}
</p>
{% endhighlight %}
<strong>2.显示单篇文章页面</strong>

接下来把每篇文章的标题加上<samp>a</samp>标签，这样点击文章标题就可以跳转到单篇文章界面。
{% highlight html %}
{% raw %}
<h2 class="blog-post-title">
	<a href="/posts/{{ $post->id}}">
		{{$post->title}}
	</a>
</h2>
{% endraw %}
{% endhighlight %}
现在来设置每一篇文章的页面，之前添加过一个路由：<samp>Route::get('/posts/{post}','PostsController@show');</samp>，后面在我们添加create路由时将它注释了，这里取消注释。然后到PostsController的show方法中传递post参数给posts/show视图，这里我们使用路由模型绑定，路由模型绑定可以参考[Laravel路由——路由模型绑定](https://d.laravel-china.org/docs/5.1/routing#路由模型绑定)。
{% highlight php %}
{% raw %}
//路由模型绑定：在app/Provider/RouteServiceProvider.php的boot方法中添加:
public function boot(Router $router)
{
    parent::boot($router);
    $router->model('post', 'App\Post');
}

//在PostsController的show方法中直接使用Post Model作为参数
public function show(Post $post){
	return view('posts.show',compact('post'));
}

//如果没有使用路由模型绑定，在show方法中使用id作为参数
public function show($id){
	$post = Post::find($id);
	return view('posts.show',compact('post'));
}
{% endraw %}
{% endhighlight %}
最后在posts/show视图中显示文章：
{% highlight php %}
{% raw %}
@extends('layouts.master')

@section('content')
	<div class="col-sm-8 blog-main">
    	<h1>{{ $post->title}}</h1>

    	{{$post->body}}  
  	</div>
@endsection
{% endraw %}
{% endhighlight %}
现在点击文章的标题，可以直接跳转到相应的文章界面了。不过主页中文章的排列顺序是以id从小到大排列的，通常情况下人们更希望新的文章出现在最前面，所以可以更改一下顺序，在PostsController的index方法中：
{% highlight php %}
{% raw %}
public function index(){
	$posts = Post::latest()->get();

    return view('posts.index', compact('posts'));
}
{% endraw %}
{% endhighlight %}
使用了Eloquent的查询器：<samp>Post::latest()->get()</samp>，这是将数据按照<samp>created_at</samp>的降序排列，所以最新的文章可以显示在最前面。