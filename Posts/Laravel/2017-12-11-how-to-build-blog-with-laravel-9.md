---
layout: article
title: Laravel搭建博客 (添加标签)
category: Laravel
tags: Laravel L5 Blog Tag
---
本文介绍了如何给文章添加标签，以及给标签添加分类链接；这涉及到了文章与标签的多对多关系模型。

### 标签和Pivot表
关于Eloquent模型的多对多关联可以参考[Laravel Eloquent关联](https://d.laravel-china.org/docs/5.1/eloquent-relationships#获取中间表字段)。

一个Post文章可以对应许多个Tag标签，同样的一个Tag标签可以对应许多篇文章，这就产生了多对多的关系，在Eloquent中，它可以提供一张Pivot表来连接这种多对多关系，比如id为1的文章对应id为1的标签以及id为1的文章对应id为2的标签，只需要存储post_id=1，tag_id=1即可，下面来具体实现：

<strong>1.创建Tag Model以及Migrate</strong>

使用artisan命令创建Tag Model，然后给Tag Migrate添加必要的标签表字段，以及创建另一张表<samp>post_tag</samp>：
{% highlight php %}
public function up()
{
    Schema::create('tags', function (Blueprint $table) {
        $table->increments('id');
        $table->string('name')->unique();
        $table->timestamps();
    });

    Schema::create('post_tag', function (Blueprint $table) {
        $table->integer('post_id');
        $table->integer('tag_id');
        $table->primary(['post_id', 'tag_id']);
    });
}
{% endhighlight %}
要记得在<samp>down</samp>方法中drop<samp>post_tag</samp>表，还有就是<samp>post_tag</samp>表中的主键<samp>post_id</samp>+<samp>tag_id</samp>，执行migrate命令后更新到数据库。

<strong>2.添加一些数据用于测试</strong>

在<samp>tags</samp>表中添加一些标签比如‘PHP’、‘Laravel’之类的标签好用于测试，还要在<samp>post_tag</samp>中添加post_id与tag_id，比如1-1之类的：
{% highlight sql %}
> select * from tags
+----+---------+---------------------+---------------------+
| id | name    | created_at          | updated_at          |
+----+---------+---------------------+---------------------+
|  1 | php     | 2017-12-11 15:46:36 | 2017-12-11 15:46:36 |
|  2 | laravel | 2017-12-11 15:46:41 | 2017-12-11 15:46:41 |
+----+---------+---------------------+---------------------+

> select * from post_tag;
+---------+--------+
| post_id | tag_id |
+---------+--------+
|       1 |      1 |
|       1 |      2 |
+---------+--------+
{% endhighlight %}
注意要确保Post中有id为1的文章数据，否则可能会出错。

<strong>3.Post与Tag关联</strong>

在Post.php中添加对tags的多对多关系，以及在Tags中添加对posts()的多对多关系：
{% highlight php %}
//post.php
public function tags(){
	return $this->belongsToMany(Tag::class);
}

//tag.php
public function posts(){
	return $this->belongsToMany(Post::class);
}
{% endhighlight %}
可以在tinker中测试它们之间的关系是否成功匹配，记得之前已经把post_id=1的post与tag_id=1的tag添加绑定在<samp>post_tag</samp>的数据表中吗？现在我们在tinker中可以直接使用<samp>detach</samp>命令来解绑它们：
{% highlight shell %}
>>> $post = App\Post::first();
=> App\Post {#710
     id: 1,
     user_id: 3,
     title: "Libai's Post",
     body: "This is a post content by Libai",
     created_at: "2016-10-08 07:23:33",
     updated_at: "2017-12-08 06:25:06",
   }
>>> $tag = App\Tag::where('name', 'php')->first();
=> App\Tag {#706
     id: 1,
     name: "php",
     created_at: "2017-12-11 15:46:36",
     updated_at: "2017-12-11 15:46:36",
   }
>>> $post->tags()->detach($tag);
=> 1
{% endhighlight %}
同样也可以使用<samp>attach</samp>命令来重新绑定它们：
{% highlight shell %}
>>> $post->tags()->attach($tag);
=> null
{% endhighlight %}
这是Eloquent模型一个非常强大的功能。

### 添加标签链接
数据模型已经建好了，接下来给Blog添加Tag的链接，可以实现点击Tag就筛选Tag内容的文章：

<strong>1.添加路由、控制器、视图</strong>

路由：<samp>Route::get('/posts/tags/{tag}', 'TagsController@index');</samp>，控制器：<samp>php artisan make:controller TagsController</samp>
{% highlight php %}
public function index($id){
    $tag = \App\Tag::find($id);
    $posts = $tag->posts()->get();

    return view('posts.index', compact('posts'));
}
{% endhighlight %}
上面的内容添加到控制器中，然后访问<samp>/posts/tags/1</samp>，就可以看到tag=1的所有文章了，这里没有新建视图，而是使用了Posts的index视图，因为是根据Tag筛选文章列表，所以显示的还是文章列表。

<strong>2.添加Tag列表到侧边栏</strong>

就像Archive一样，把日期提取到侧边栏，这里把Tag也提取到侧边栏，这是Blog常用的一个功能；到AppServiceProvider中添加Tags变量到sidebar视图文件，这是使用了<samp>视图组件</samp>，之前在Archive中已经使用过它将<samp>$archives</samp>变量添加进来了：
{% highlight php %}
view()->composer('layouts.sidebar', function($view){
    $view->with('archives', \App\Post::archives());
    $view->with('tags', \App\Tag::all());
});
{% endhighlight %}
然后到<samp>layouts/sidebar.blade.php</samp>中添加相应的html代码：
{% highlight html %}
{% raw %}
<div class="sidebar-module">
<h4>Tags</h4>
<ol class="list-unstyled">
  @foreach ($tags as $tag)
    <li><a href="/posts/tags/{{ $tag->id }}">
      {{$tag->name}}
    </a></li>
  @endforeach
</ol>
</div>
{% endraw %}
{% endhighlight %}
然后刷新浏览器就可以看到侧边栏的Archive栏目的下发出现了Tags栏目，点击其中的Tag标签即可跳转到拥有该标签的文章列表。

这里还存在一个小问题，如果有一个标签没有对应相应的文章，那么当点击这个标签时，会跳转到一个空白文章列表的页面，这样对客户并不友好，所以在获取<samp>$tags</samp>变量的时候，筛选只有标签拥有文章时才显示该标签：
{% highlight php %}
//$view->with('tags', \App\Tag::all());
$view->with('tags', \App\Tag::has('posts')->get());
{% endhighlight %}
这样，如果一个标签没有对应任何文章，它就不会被显示出来。

<strong>3.在文章页面中添加标签</strong>

现在标签能够筛选文章，但是在每一篇文章中还没有显示拥有的标签属性，给它加上标签吧，在posts/show.blade.php中添加：
{% highlight html %}
{% raw %}
@if(count($post->tags))
	<ul>
		@foreach ($post->tags as $tag)
		<li>
			<a href="/posts/tags/{{$tag->id}}">	{{$tag->name}}</a>
		</li>
		@endforeach
	</ul>
@endif
{% endraw %}
{% endhighlight %}

![Tags](http://ozwfmed7j.bkt.clouddn.com/Laravel-Blog-10.png)

这是添加完标签之后的某篇文章的界面。