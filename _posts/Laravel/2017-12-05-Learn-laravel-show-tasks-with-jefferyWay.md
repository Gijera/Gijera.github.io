---
layout: article
title: Laravel显示任务清单
category: Laravel
tags: Laravel Bootstrap L5
---
通过使用Laravel显示一个在数据库中的任务清单来初步学习Laravel的基本使用，学习过程主要参考了Laravel官方手册以及JefferyWay的视频教程。

### 数据库设置
这部分可以参考[Laravel数据库——配置信息](https://d.laravel-china.org/docs/5.1/database#配置信息)。

<span class="text-danger">注意要配置.env文件以及config/database.php文件</span>。可以通过使用命令<samp>php artisan migrate --pretend</samp>来预运行命令，如果没有报错，说明数据库配置没有问题。

通过<samp>php artisan migrate</samp>来建立数据库，可以使用<samp>php artisan migrate:rollback</samp>来回滚操作，使操作回到前一个版本，再次运行<samp>php artisan migrate</samp>来建立当前数据库，Laravel中自带了users和password_resets两个migrate模型。

### 传递参数到视图
在视图文件resource/view/welcome.blade.php中添加一个参数：
{% highlight php %}
<?php echo $name; ?>
{% endhighlight %}
为了将$name参数传递给welcome视图文件，在routes.php中有以下方式可以传递参数:
{% highlight php %}
//基本的数组传递方式
Route::get('/', function () {
    return view('welcome',[
    	'name' => 'world'
    ]);
});

//使用with函数传递
Route::get('/', function () {
    return view('welcome')->with('name','world');
});

//使用compact函数将变量转化为数组
Route::get('/', function () {
	$name = 'world';
    return view('welcome', compact('name'));
});

{% endhighlight %}
传递一个数组文件到视图后，使用blade模版语句来显示数组数据，顺便说一句，blade语句与Jekyll中的Liquid模版语句非常相似。
{% highlight php %}
//routes.php
Route::get('/', function () {
	$tasks = [
		'Go to the store',
		'Finish my screencast',
		'Clean the house'
	];

    return view('welcome', compact('tasks'));
});

//welcome.blade.php
@foreach ($tasks as $task)
	{% raw %}{{ $task }}{% endraw %}
@endforeach
{% endhighlight %}
更多传递参数到视图的资料请参考[Laravel视图——数据](https://d.laravel-china.org/docs/5.1/views#视图的数据)。

### 查询构建器
首先可以通过artisan命令来建立一个tasks migration模型:
{% highlight shell %}
//create选项默认添加id、时间戳等字段到up函数中
php artisan make:migration create_tasks_table --create=tasks
{% endhighlight %}
如果执行语句的时候出现错误<span class="text-danger">“include(...):failed to open stream: No such file or directory"</span>。可以输入<samp>composer dump-autoload</samp>命令解决，这一部分的内容可以参考[composer文档——打印自动加载索引dump-autoload](https://docs.phpcomposer.com/03-cli.html#dump-autoload)。
然后设置Tasks的所有字段：
{% highlight php %}
Schema::create('tasks', function (Blueprint $table) {
    $table->increments('id');
    $table->text('body');
    $table->timestamps();
});
{% endhighlight %}
在里面添加了text类型的‘body’字段，然后执行<samp>php artisan migrate</samp>可以将新建的表添加到数据库。如果添加完毕之后你发现需要再添加/删除/修改字段，可以在上面的代码中修改字段，然后执行<samp>php artisan migrate:refresh</samp>，这句命令代表重新执行所有的migrate模型。

接下来添加一些数据到数据库中：
{% highlight sql %}
Insert Into tasks Value(null,'Go to the store',now(),now());
Insert Into tasks Value(null,'Finish screencast',now(),now());
Insert Into tasks Value(null,'Clean the house',now(),now());
{% endhighlight %}
现在把之前的tasks数组替换成数据库中的文件：
{% highlight php %}
//routes.php
Route::get('/', function () {
	$tasks = DB::table('tasks')->get();

	return view('welcome', compact('tasks'));
});

//welcome.blade.php
@foreach ($tasks as $task)
	{% raw %}{{ $task->body }}{% endraw %}
@endforeach
{% endhighlight %}
和之前的效果一样，但是数据从数组转换成了数据库数据。我们还可以通过一些查询构建函数来构建我们需要的结果，而不需要编写数据库语句：
{% highlight php %}
//逆序返回数据
$tasks = DB::table('tasks')->latest()->get();
{% endhighlight %}
上面的代码实现了索引task数据，更多关于查询构造器的资料请参考[Laravel数据库——查询构造器](https://d.laravel-china.org/docs/5.1/queries#数据库查询构造器)。下面通过给路由添加参数来显示指定的数据，首先添加一个路由：
{% highlight php %}
Route::get('/tasks/{task}', function ($id) {
	$task = DB::table('tasks')->find($id);
   	return view('tasks.show', compact('task'));
});
{% endhighlight %}
在路由中我们使用<samp>find</samp>函数来查找数据，最后将数据传递给相应的视图，这里我们添加了一个视图，在Laravel中可以使用<samp>.</samp>来表示路径，上面的视图文件应该添加在resource/view/tasks/show.blade.php中：
{% highlight html %}
<!DOCTYPE html>
<html>
<head>
	<title></title>
</head>
<body>
	{% raw %}{{ $task->body }}{% endraw %}
</body>
</html>
{% endhighlight %}
现在访问<samp>localhost/tasks/1</samp>就可以看到第一条数据了，同理，也可以访问其他数据；如果数据不存在的话，Laravel会报错。现在可以把<samp>/</samp>目录下的视图文件中的<samp>$task->body</samp>加上a标签使之链接到相应的数据之中：
{% highlight html %}
<!DOCTYPE html>
<html>
<head>
    <title></title>
</head>
<body>
	{% raw %}
    @foreach ($tasks as $task)
        <li>
            <a href="/tasks/{{ $task->id }}">
            {{ $task->body }}
            </a>
        </li>
    @endforeach
    {% endraw %}
</body>
</html>

{% endhighlight %}

### 参考目录
在Laravel的官方网站中，有两套教程分别指导大家如何构建一个完整的任务清单，可以实现删除、添加、索引等功能，具体可参考
* [Laravel——初级任务清单](https://d.laravel-china.org/docs/5.1/quickstart)
* [Laravel——中级任务清单](https://d.laravel-china.org/docs/5.1/quickstart-intermediate)。