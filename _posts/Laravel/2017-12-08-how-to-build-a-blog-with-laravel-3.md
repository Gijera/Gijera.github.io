---
layout: article
title: Laravel搭建博客 (给文章添加评论)
category: Laravel
tags: Laravel L5 Blog
---
本文介绍了如何给文章添加评论，使用Eloquent给评论与文章建立模型关联，让数据库之间的关系能够直接在对象中反映出来。

### Eloquent模型关联
本段内容参考[Laravel Eloquent——关联](https://d.laravel-china.org/docs/5.5/eloquent-relationships#Eloquent关联)

<strong>1.建立Comment Model以及Migration</strong>

使用命令<samp>php artisan make:model Comment -m</samp>建立Comment的Model以及Migration，记得之前为了去掉表单批量赋值的限制，建立了一个Model类为超类，所以这里同样要把命名空间去掉，让Comment直接继承Model类：
{% highlight php %}
<?php

namespace App;

class Comment extends Model
{
    //
}
{% endhighlight %}
评论表需要评论内容、以及所属文章字段，所以在migration中给comments表中添加<samp>body</samp>以及<samp>post_id</samp>字段：
{% highlight php %}
Schema::create('comments', function (Blueprint $table) {
    $table->increments('id');
    $table->integer('post_id');
    $table->string('body');
    $table->timestamps();
});
{% endhighlight %}
执行<samp>php artisan migrate</samp>保存到数据库中。

<strong>2.为Comment和Post添加模型关联</strong>

随意给Comment添加几条数据，然后在app/Post.php中添加与Comment的关系，注意<span class="text-danger">Post与Comment是一对多的关系</span>,所以在Post中添加：
{% highlight php %}
public function comments(){
	return $this->hasMany(Comment::class);
}
{% endhighlight %}
接下来使用<samp>php artisan tinker</samp>测试一下comments函数：
{% highlight shell %}
>>> $post = App\Post::find(7)
>>> $post->comments
=> Illuminate\Database\Eloquent\Collection {#658
     all: [
       App\Comment {#657
         id: 1,
         post_id: 7,
         body: "good job",
         created_at: "2017-12-08 01:14:44",
         updated_at: "2017-12-08 01:14:44",
       },
     ],
   }
{% endhighlight %}
因为在我的数据库中添加了7篇文章，并且添加了一条‘Good Job’的评论给了第七篇文章，所以调用第七篇文章的comments方法得到了所有对该篇文章的评论。接下来使用同样的方法在Comment.php中添加<span class="text-danger">它与Post的多对一关系</span>：
{% highlight php %}
public function post(){
	return $this->belongsTo(Post::class);
}
{% endhighlight %}

<strong>3.将评论显示在对应的文章页面中</strong>

在post/show.blade.php中把评论添加到文章显示之后：
{% highlight html %}
{% raw %}
<div class="comments">
	<ul class="list-group">
		@foreach ($post->comments as $comment)
			<li class="list-group-item">
				<strong>
					{{$comment->created_at->diffForHumans()}}: &nbsp;
				</strong>
				{{$comment->body}}		
			</li>
		@endforeach
	</ul>
</div>
{% endraw %}
{% endhighlight %}
<samp>diffForHumans</samp>是Carbon中的一个函数，它可以把时间转换成xxx之前，增加了交互感，其他的一些代码做了一些美化工作，评论看起来像这个样子：

![Coment](http://ozwfmed7j.bkt.clouddn.com/Laravel-Blog-6.png)

### 页面中添加评论
上面显示的评论是之前直接在数据库中添加的，接下来设置在文章面板中可以自由的添加评论，首先添加一个表单：
{% highlight php %}
{% raw %}
<div>
	<form method="POST" action="/posts/{{$post->id}}/comments">
		{{csrf_field()}}
		<div class="form-group">
			<textarea name="body" class="form-control">
			</textarea>
		</div>
		<div class="form-group">
			<button type="submit" class="btn btn-primary">Add Comment</button>
		</div>
	</form>
</div>
{% endraw %}
{% endhighlight %}
注意这里将表单传递给<samp>/posts/$post->id/comments</samp>，所以在路由中添加<samp>{% raw %}Route::post('/posts/{post}/comments', 'CommentsController@store');{% endraw %}</samp>。将添加评论的工作交给CommentsController的store方法，继续创建CommentsController，然后在里面添加store方法：
{% highlight php %}
{% raw %}
public function store(Post $post){
    Comment::create([
        'body' => request('body'),
        'post_id' => $post->id
    ]);

    return back();
}
{% endraw %}
{% endhighlight %}
为了让这段代码更加直观，这里用了一个小技巧，因为创建评论可以理解为给文章添加评论，所以实际上这个工作由Post来做会更加自然，所以把这段代码移到Post.php中：
{% highlight php %}
//CommentsController.php更改后
public function store(Post $post){
    $post->addComment(request('body'));
    return back();
}

//Post.php中增加一个addComment函数
public function addComment($body){
	Comment::create([
        'body' => $body,
        'post_id' => $this->id
    ]);
}

//更进一步由comments函数来完成工作
public function addComment($body){
	$this->comments()->create(compact('body'));
}
{% endhighlight %}
同样的可以完成添加评论的工作，并且代码更加简洁。最后给评论表单添加一下验证功能：
{% highlight php %}
public function store(Post $post){
    $this->validate(request(), ['body' => 'required|min:2']);

    $post->addComment(request('body'));
    return back();
}
{% endhighlight %}
之前在添加文章表单的时候，把错误提取到了layouts/errors.blade.php中，现在同样的可以在post/show.blade.php的表单后面添加<samp>@include('layouts.errors')</samp>，这样当没有输入评论或是字数太少时，会在下面显示错误。