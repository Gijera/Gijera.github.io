---
layout: article
title: Laravel搭建博客 (表单请求对象)
category: Laravel
tags: Laravel L5 Blog Form
---
使用请求对象来发送注册表单请求。

### 表单请求对象
Laravel中有一个东西叫做<samp>FormRequest</samp>，这个对象可以用来作为表单请求的对象，之前在注册用户的时候，将表单验证、添加对象、发送邮件等等功能统统放在<samp>RegistrationController的store</samp>方法中，现在来尝试将它们放到<samp>FormRequest</samp>之中。

首先生成一个FormRequest：<samp>php artisan make:request RegistrationForm</samp>，然后可以在app/Http/Requests/RegistrationForm.php中看到这个请求对象，里面有两个方法：<samp>authorize</samp>与<samp>rules</samp>，具体可以参考[Laravel——Validation](https://laravel.com/docs/5.5/validation#form-request-validation)。authorize是授权方法，这里简单的把它设置返回为<samp>true</samp>；rules则是表单验证的内容，它会自动验证表单，可以把之前放在store中验证的内容移到该方法中：
{% highlight php %}
public function rules()
{
    return [
        'name' => 'required',
        'email' => 'required|email',
        'password' => 'required|confirmed'
    ];
}
{% endhighlight %}
store中还做了许多别的事情，现在把它们都统一移到新建的这个请求对象中，新建一个<samp>persist</samp>方法，把前面的东西移过来：
{% highlight php %}
public function persist(){
    $user = User::create(
        $this->only(['name', 'email', 'password'])
    );

    auth()->login($user);

    Mail::send('emails.welcome', ['user' => $user], function($m)use($user){
        $m->from('blog@example.com', 'Blog');
        $m->to($user->email, $user->name)->subject('Your Blog!');
    });
}
{% endhighlight %}
注意到<span class="text-danger">由于这本身是个Request对象，所以不再需要用<samp>request('name')</samp>来调用它，而是直接使用了<samp>$this</samp>变量来指定。</span>。

现在store方法中非常干净了，只需要引用<samp>persist</samp>方法，然后跳转到主页即可：
{% highlight php %}
public function store(RegistrationForm $request){
    $request->persist();
    return redirect('/');
}
{% endhighlight %}
移动这些函数的时候要特别注意命名空间也要移动，否则经常会发生命名空间错误，现在刷新浏览器，到<samp>/register</samp>中注册一下用户，发现效果与之前相同，但是代码更加清楚了，注册功能完全由表单对象来完成。