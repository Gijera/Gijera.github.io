---
layout: article
title: Laravel搭建博客 (添加用户)
category: Laravel
tags: Laravel L5 Blog User
---
文章和评论都已经有了，可以添加用户来控制对文章和评论的管理，主要涉及到用户认证、登陆注册等常用功能。

### 用户功能
Laravel中自带了用户表以及Migrate，直接使用它，用户有‘用户名’、‘密码’、‘邮箱’三个主要字段。

<strong>1.添加Post/Comment与User的关联</strong>

之前的Blog中并没有任何用户功能，现在要添加User，所以首先要将User与Post以及Comment进行关联，在Post以及Comment的<samp>Schema::create</samp>中添加<samp>$table->interger('user_id')</samp>，之后执行<samp>php artisan migrate:refresh</samp>来重新设置数据库，现在Comment以及Post表中的数据都被清除了。同样要记得在Comment.php以及Post.php中添加<samp>user</samp>函数并且在里面指定<samp>belongsTo</samp>的多对一关系，还要在User.php中指定与Post和Comment的一对多关系。

<strong>2.添加注册用户的路由和视图</strong>

首先添加注册路由：<samp>Route::get('/register', 'RegistrationController@create');</samp>，然后添加控制器：<samp>php artisan make:controller RegistrationController</samp>，接下来在RegistrationController中添加create方法：
{% highlight php %}
public function create(){
    return view('sessions.create');
}
{% endhighlight %}
创建视图<samp>sessions/create.blade.php</samp>：
{% highlight html %}
@extends ('layouts.master')

@section('content')
	<div class="col-sm-8">
		<h1>Register</h1>
	</div>
@endsection
{% endhighlight %}
之后跳转到<samp>'/register'</samp>页面，可以看到相应的内容，然后添加表单、并让Form的action指向<samp>'/register'</samp>，添加Post的register到路由：<samp>Route::post('/register', 'RegistrationController@store');</samp>，然后在store中处理注册请求。
{% highlight php %}
public function store(){
    $this->validate(request(), [
        'name' => 'required',
        'email' => 'required|email',
        'password' => 'required'
    ]);

    $user = User::create(request()->all());

    auth()->login($user);

    return redirect('/');
}
{% endhighlight %}
store中现在做了4件事：第一是验证表单，第二是创建用户，第三是使用<samp>auth()->login()</samp>让用户登录，第四是重定向到<samp>'/'</samp>页面。

<strong>3.确认密码以及加密密码</strong>

在注册的时候，密码需要确认输入一次，这样会使密码输错的几率减小。首先在表单中添加一行‘密码确认’：
{% highlight html %}
<div class="form-group">
	<label for="password">Password:</label>
    <input type="password" class="form-control" id="password" name="password">
</div>

<div class="form-group">
	<label for="password_confirmation">Password Confirmation:</label>
    <input type="password" class="form-control" id="password_confirmation" name="password_confirmation">
</div>
{% endhighlight %}
然后把之前在store函数中的<samp>'password' => 'required'</samp>改为<samp>'password' => 'required|confirmed'</samp>，Laravel将会自动匹配两个输入框中的密码，如果不同，会把错误写到<samp>'$errors'</samp>变量中。

前面的步骤与添加文章或是评论没有太大区别，但是在注册用户时，用户的密码直接存储是非常不安全的，<span class="text-danger">一般情况下，用户输入的密码需要加密后再存储</span>，否则很容易被窃取；所以在存储密码之前，需要做加密工作，Laravel的加密很简单，使用<samp>bcrypt</samp>即可，所以对密码进行：<samp>'password' => bcrypt(request('password'));</samp>，可以参考[Laravel——加密与解密](https://d.laravel-china.org/docs/5.1/encryption)。

<strong>4.登录登出</strong>

完成注册之后，就是要实现登录与登出功能，在注册的时候同时使用<samp>auth->login()</samp>完成了登录工作，这是Laravel的Auth模块所实现的，登出功能使用<samp>auth->logout()</samp>同样可以实现。登录页面显示可以参考注册页面来完成，登出页面与功能同样如此：首先创建一个控制器，比如<samp>SessionsController</samp>，由这个控制器来控制登录、登出；然后添加相应的路由即可。可以在导航的右上方添加一个标志，比如如果用户登录则显示用户名，否则什么都不显示，来测试登录与登出功能。

<strong>5.只有注册用户才能添加文章</strong>

之前使用<samp>'/posts/create'</samp>路由来添加文章，现在有了用户功能，应该指定只有用户可以添加文章，给PostsController添加一个构造函数：
{% highlight php %}
public function __construct(){
    $this->middleware('auth')->except(['index','show']);
}
{% endhighlight %}
在这里指定除了<samp>index</samp>和<samp>show</samp>功能以外，其他的功能都需要通过<samp>auth</samp>中间件，也就是登录以后才能使用，对于没有登录的用户会直接报错，这个问题在Laravel后面的版本中换了一个对用户友好一点的界面。

<strong>6.为之前的功能添加用户以及修改一些bug</strong>

* 创建文章的时候添加<samp>user_id</samp>字段
* 将Sessions/create.blade.php复制一份给registration/create.blade.php，因为这是注册界面，然后重写一份登录页面到Sessions/create.blade.php中。
* 添加登录页面后，如果已经登录的用户则不能再登录，在相应的控制器中添加auth中间件即可，比如给SessionsController添加<samp>guest</samp>访客中间件，意味着只有访客才能使用：
{% highlight php %}
public function __construct(){
	$this->middleware('guest',['only' => ['create', 'store']]);
}
{% endhighlight %}