---
layout: article
title: Laravel搭建博客 (测试与完成)
category: Laravel
tags: Laravel L5 Blog Test
---
这篇文章介绍了一小部分的测试功能，测试的内容为Post.php中用来获取archives变量的函数<samp>$archives</samp>。

### 测试Archives函数
在Post.php中，曾经写过一个Archives函数用于获取不同的文章发表的时间的组合：
{% highlight php %}
static public function archives(){
	return static::selectRaw('year(created_at) year, monthname(created_at) month, count(*) published')
        ->groupBy('year','month')
        ->orderByRaw('min(created_at) desc')
        ->get()
        ->toArray();
}
{% endhighlight %}
接下来以这个函数为例，来大概的了解一下Laravel的测试功能，当然还是要使用PHPUnit。

<strong>1.启动PHPUnit</strong>

Laravel中自带了PHPUnit的功能，直接在Blog的目录下运行<samp>phpunit</samp>即可，但是如果事先已经安装过PHPUnit的话，这样直接运行会显示没有测试文件这样的错误，所以需要使用Laravel自带的PHPUnit的完整的路径：<samp>vendor/bin/phpunit</samp>。

Laravel的测试文件在<samp>/Test</samp>目录之中，关于PhpUnit的详细内容和方法可以参考[PHPUnit](https://phpunit.de/manual/current/zh_cn/installation.html)，这里假定读者已经了解Phpunit的基本测试方法，关于Laravel的测试可以参考[Laravel Test](https://laravel.com/docs/5.5/testing)。

<strong>2.编写测试程序</strong>

为了简便，直接在<samp>Test/ExampleTest.php</samp>中编写测试，编写测试的主要内容是:1.从数据库获取两条post的数据并且每一条数据都在不同的月份中发表；2.调用archives函数；3.结果应该以适当的格式反映给测试。

首先，如何从数据库来获取数据？Laravel提供了一个ModelFactory，用来专门生产数据，它在<samp>database/factories/ModelFactory.php</samp>之中，里面是以User为例，可以在tinker中测试这个factory：
{% highlight shell %}
>>> factory('App\User')->make();
=> App\User {#694
     name: "Wyman Turcotte",
     email: "dbailey@example.com",
   }
>>> factory('App\User')->create();
=> App\User {#690
     name: "Lottie Bogisich",
     email: "ntremblay@example.org",
     updated_at: "2017-12-11 09:34:34",
     created_at: "2017-12-11 09:34:34",
     id: 20,
   }
>>> factory('App\User', 2)->create();
=> Illuminate\Database\Eloquent\Collection {#697
     all: [
       App\User {#685
         name: "Miss Melisa Dickens III",
         email: "zemlak.anthony@example.org",
         updated_at: "2017-12-11 09:34:47",
         created_at: "2017-12-11 09:34:47",
         id: 21,
       },
       App\User {#686
         name: "Henri Aufderhar",
         email: "gpollich@example.com",
         updated_at: "2017-12-11 09:34:47",
         created_at: "2017-12-11 09:34:47",
         id: 22,
       },
     ],
   }
{% endhighlight %}
可以看到，<samp>make</samp>方法可以创建一些临时数据，使用<samp>save()</samp>可以把数据保存到数据库中。<samp>create</samp>方法可以直接创建许多数据。

来创建一个Post数据工厂：
{% highlight php %}
$factory->define(App\Post::class, function (Faker\Generator $faker) {
    return [
    	'user_id' => 1,
        'title' => $faker->sentence,
        'body' => $faker->paragraph
    ];
});
{% endhighlight %}
注意这里赋值<samp>user_id</samp>为1，在这个测试中，user的id值并不重要，在Laravel5.4版本的时候，赋值可以使用闭包，但是5.1中并没有这个功能，所以无法赋一个现有的、正确的id给user_id，所以干脆全部使用1。现在可以继续到测试文件中编写获取数据部分的代码了：
{% highlight php %}
public function testBasicExample()
{
    $first = factory(Post::class)->create();

    $second = factory(Post::class)->create([
    	'created_at' => \Carbon\Carbon::now()->subMonth()
    ]);

    $posts = Post::archives();

    $this->assertCount(2, $posts);
}
{% endhighlight %}
不过现在又出现了一个问题，在我们测试的时候，通常会使用到数据库(这个例子就是如此)，但是在正式开发的时候，不能直接拿客户的数据来进行测试，否则会丢失数据；最好是用本地的其他临时数据库或专门的测试数据库来用；所以先到数据库中建立一个测试用的数据库：<samp>create database blog_testing;</samp>，接下来到Laravel的<samp>phpunit.xml</samp>中配置一下：
{% highlight xml %}
<php>
    <env name="APP_ENV" value="testing"/>
    <env name="CACHE_DRIVER" value="array"/>
    <env name="SESSION_DRIVER" value="array"/>
    <env name="QUEUE_DRIVER" value="sync"/>
    <env name="DB_DATABASE" value="blog_testing"/>        
</php>
{% endhighlight %}
还要记得到<samp>.env</samp>中更改当前数据库：
{% highlight config %}
DB_CONNECTION=mysql
DB_HOST=127.0.0.1
DB_DATABASE=blog_testing
DB_USERNAME=root
DB_PASSWORD=
{% endhighlight %}
最后再到终端执行一遍：<samp>php artisan migrate</samp>重建数据库模型。这里有个问题，更改数据库配置之后Laravel无法更新数据库配置，这个问题我还在寻找答案，找到了再来更新，现在继续使用原来的数据库进行测试。执行测试之后测试成功，并且发现Post表中多出了两条数据，每执行一次数据库中就会多出两条数据，但是这不是想要的效果，让它每次执行完都删除掉数据就好了，幸好这一点很容易做到，在类中添加<samp>use DatabaseTransactions;</samp>语句就行了，再次执行测试，会发现数据保持不变。

前面使用的是通过数量来测试，现在将测试的准确性加大一点：
{% highlight php %}
public function testBasicExample()
{
    $first = factory(Post::class)->create();

    $second = factory(Post::class)->create([
    	'created_at' => \Carbon\Carbon::now()->subMonth()
    ]);

    $posts = Post::archives();

    $this->assertEquals([
        [
            "year" => $first->created_at->format('Y'),
            "month" => $first->created_at->format('F'),
            'published' => 1
        ],
        [
            "year" => $second->created_at->format('Y'),
            "month" => $second->created_at->format('F'),
            'published' => 1
        ]
    ], $posts);
}
{% endhighlight %}
让信息准确的输出，并进行对比。

### 完成
博客开发到这里，差不多已经完成了；这篇博客的搭建大多是参考[Jeffery Way的Laracasts](https://laracasts.com)上面的教程，讲的比较细致，关于第一节像是<samp>'Mix'</samp>以及<samp>'Authentication'</samp>还有一些其他的与Blog搭建无关的内容我就没有写在这里了，一个原因是Laravel5.1有的功能没有，另一个原因就是与Blog没有关系。其实这个Blog的搭建过程中遇到了许多问题，因为Jeffery Way使用的是Laravel5.4，很多功能在5.1里面有些不同，有些没有，所以只能从文档中查找一些资料来完成，最终项目把它存放在[Github Gist](https://github.com/Gijera/Gist/tree/master/Blog/Laravel-Blog)之中，以后可能会修改一些样式，但功能大致已经做得差不多了。

这里我想把过程中参考的一些有用的文章链接放到这里：
* Laravel的官方文档：[Laravel](https://laravel.com)
* Laravel的中文文档：[Laravel China](https://d.laravel-china.org/docs/5.1)
* Laravel的API文档：[Laravel API](https://laravel.com/api/5.5/IlluminateQueueClosure.html)
* 一篇关于服务容器讲的很好的博客：[laravel 学习笔记 —— 神奇的服务容器](https://www.insp.top/learn-laravel-container)
* 一篇关于邮件发送以及队列的不错的博客：[Laravel 5.1 之美：使用队列实现邮件发送](https://blog.wangjunfeng.com/archives/665)