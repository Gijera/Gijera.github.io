---
layout: article
title: Laravel搭建博客 (文章归档)
category: Laravel
tags: Laravel L5 Blog
---
将文章按照时间顺序归档，进一步了解查询构造器。

### 数据库语句与查询构造器
使用这些语句能够帮助查询所有不同的年月组合的数据，并且把它们存储为变量：
{% highlight sql %}
select year(created_at) year, monthname(created_at) month, count(*) published from posts group by year,month;
{% endhighlight %}
将年份存储在<samp>year</samp>中，月份名字存储在<samp>monthname</samp>中，并且将年份、月份相同的数量存储在<samp>published</samp>中，然后按照年份+月份筛选，这样可以得到类似下面的数据：
{% highlight sql %}
+------+----------+-----------+
| year | month    | published |
+------+----------+-----------+
| 2016 | October  |         1 |
| 2017 | December |         1 |
| 2017 | October  |         1 |
+------+----------+-----------+
{% endhighlight %}
同样的可以在Laravel中来使用这些语句，首先打开tinker测试一下：
{% highlight shell %}
>>> App\Post::selectRaw('year(created_at) year, monthname(created_at) month, count(*) published')->groupBy('year','month')->get()
=> Illuminate\Database\Eloquent\Collection {#676
     all: [
       App\Post {#677
         year: 2016,
         month: "October",
         published: 1,
       },
       App\Post {#678
         year: 2017,
         month: "December",
         published: 1,
       },
       App\Post {#679
         year: 2017,
         month: "October",
         published: 1,
       },
     ],
   }
{% endhighlight %}
这是Laravel中为了方便使用数据库的原始表达式而设置的，具体可以参考[Laravel-Raw Methods](https://laravel.com/docs/5.5/queries#raw-methods)；还可以在<samp>get()</samp>后面继续添加<samp>toArray()</samp>来把数据转化成一个数组。

接下来可以在PostsController的index方法中把查询结果赋值给一个变量，然后传给相应的视图：
{% highlight php %}
public function index(){
	$posts = Post::latest()->get();
    $archives = Post::selectRaw('year(created_at) year, monthname(created_at) month, count(*) published')
        ->groupBy('year','month')
        ->get()
        ->toArray();
    return view('posts.index', compact('posts', 'archives'));
}
{% endhighlight %}
之前将侧边栏放在一个单独的视图中：<samp>layouts/sidebar.blade.php</samp>，现在将Bootstrap原本的模版替换掉：
{% highlight html%}
{% raw %}
//原本的模版
<div class="sidebar-module">
<h4>Archives</h4>
	<ol class="list-unstyled">
	  <li><a href="#">March 2014</a></li>
	  <li><a href="#">February 2014</a></li>
	  <li><a href="#">January 2014</a></li>
	  <li><a href="#">December 2013</a></li>
	  ...
	</ol>
</div>

//替换为
<div class="sidebar-module">
<h4>Archives</h4>
	<ol class="list-unstyled">
	  @foreach ($archives as $stats)
	    <li><a href="#">{{$stats['month'].' '.$stats['year']}}</a>
	  @endforeach
	</ol>
</div>
{% endraw %}
{% endhighlight %}
完成之后，主页的侧边栏的Archives效果：

{:.center}
![Archives](http://ozwfmed7j.bkt.clouddn.com/Laravel-Blog-7.png)

### 对文章归档
视图已经完成，但是点击归档链接还无法对文章进行归档，可以使用url参数来对文章归档，修改a标签的herf：
{% highlight html %}
{% raw %}
<a href="/?month={{$stats['month']}}&year={{$stats['year']}}"></a>{% endraw %}
{% endhighlight %}
接下来到PostsController中去更改<samp>$posts</samp>变量的内容：
{% highlight php %}
//原本$posts变量的获取方法
$posts = Post::latest()->get();

//更改为根据url参数来获取
$posts = Post::latest();
if($month = request('month')){
    $posts->whereMonth('created_at', '=', Carbon::parse($month)->month);
}
if($year = request('year')){
    $posts->whereYear('created_at', '=', $year);
}
$posts = $posts->get();
{% endhighlight %}
这样能够筛选出特定数据的数据集，但是这里还有一个问题，url里传递的月份是以<samp>monthname</samp>也就是<samp>October</samp>这样的形式，而筛选的时候使用的<samp>whereMonth</samp>是数字，所以需要把它们进行一个转换，这里还是使用<samp>Carbon</samp>这个强大的PHP时间API来完成这项工作，首先引入<samp>use Carbon\Carbon</samp>，然后把原本的<samp>$month</samp>换成<samp>Carbon::parse($month)->month</samp>即可，这一步也可以在tinker中测试，可以查看[Laravel——查询构造器](https://laravel.com/docs/5.5/queries#where-clauses)。

### Scope查询与筛选器
这一节内容中文文档中没有，可以参考英文文档：[Eloquent:Getting started#Scope query](https://laravel.com/docs/5.1/eloquent#query-scopes)。

上面的查询工作还可以使用筛选器，把index方法中获得<samp>$posts</samp>变量的语句用筛选器来代替：
{% highlight php %}
$posts = Post::latest()
    ->filter([
        'month' => request('month'),
        'year' => request('year')
    ])
    ->get();
{% endhighlight %}
随后在Post的Model中添加一个Scope筛选器方法：
{% highlight php %}
public function scopeFilter($query, $filters){
    if($month = $filters['month']){
        $query->whereMonth('created_at', '=', Carbon::parse($month)->month);
    }
    if($year = $filters['year']){
        $query->whereYear('created_at', '=', $year);
    }
}
{% endhighlight %}
然后刷新浏览器，效果与之前一样。

### 视图组件
把文章归档之后又出现了一个问题，由于是在PostsController的index方法中添加了<samp>$archive</samp>这个变量，之后在<samp>sidebar.blade.php</samp>中引用了这个变量，当跳转到其他页面的时候却没有这个<samp>$archive</samp>变量，但是又会显示<samp>sidebar.blade.php</samp>的侧边栏，所以就会出现找不到<samp>$archive</samp>变量的错误，这个时候可以使用[Laravel的视图组件](https://d.laravel-china.org/docs/5.1/views#view-composers)功能，来把一些数据组织到同一个地方。

首先，把获取<samp>$archive</samp>变量的功能提取到Post.php的一个静态函数<samp>archives()</samp>之中：
{% highlight php %}
static public function archives(){
	return static::selectRaw('year(created_at) year, monthname(created_at) month, count(*) published')
        ->groupBy('year','month')
        ->orderByRaw('min(created_at) desc')
        ->get()
        ->toArray();
}
{% endhighlight %}
然后在index函数中去掉原来的<samp>$archives</samp>变量，到app/Provider/AppServiceProvider.php的boot方法中注册View Composer：
{% highlight php %}
public function boot()
{
    view()->composer('layouts.sidebar', function($view){
        $view->with('archives', \App\Post::archives());
    });
}
{% endhighlight %}
将<samp>$archives</samp>变量注册在<samp>layouts.sidebar</samp>视图中，而无需在index或其他方法中指定<samp>$archives</samp>变量，现在再次刷新浏览器，每个页面都可以正确的显示Archives栏目。