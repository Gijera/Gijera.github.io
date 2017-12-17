---
layout: article
title: Laravel搭建博客 (发送邮件)
category: Laravel
tags: Laravel L5 Blog Email
---
使用Laravel的Email API发送邮件给注册用户，这里使用的是mailtrap。

### 发送邮件
注：发送邮件这个功能在Laravel的各个版本中的使用方法不同，这里介绍的是5.1版本的方法，5.4以后的版本可以直接使用<samp>php artisan make:mail mailObject</samp>来创建。

首先需要在<samp>.env</samp>中配置mail的环境，这里使用的是Laracasts中推荐的<samp>mailtrap</samp>，还有其他的方法，可以参考手册：[Laravel——Mail](https://laravel.com/docs/5.1/mail)。
{% highlight php %}
MAIL_DRIVER=smtp
MAIL_HOST=mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=null
MAIL_PASSWORD=null
MAIL_ENCRYPTION=null
{% endhighlight %}
上面的是env文件中关于mail的配置信息，使用了<samp>smtp</samp>服务，主机是<samp>mailtrap</samp>，所以首先到[mailtrap](https://mailtrap.io)中注册一个账号，可以使用<samp>Github</samp>来授权登录，之后会有50条免费信息的发送数量，进入<samp>Demo inbox</samp>的<samp>SMTP Setting</samp>中，可以看到邮箱的配置信息。

![mailtrap](http://ozwfmed7j.bkt.clouddn.com/Laravel-Blog-8.png)

然后根据上面的配置信息，更改<samp>.env</samp>中相应的信息即可：
{% highlight php %}
MAIL_DRIVER=smtp
MAIL_HOST=mailtrap.io
MAIL_PORT=2525
MAIL_USERNAME=927f5a9b452b16
MAIL_PASSWORD=f56e934796663d
MAIL_ENCRYPTION=tls
{% endhighlight %}
配置好文件之后，创建一个email的视图：<samp>view/emails/welcome.blade.php</samp>，然后在里面随便写点HTML的内容，到Tinker中测试一下：
{% highlight shell %}
>>> $user = App\User::first()
=> App\User {#670
     id: 1,
     name: "Gijera",
     email: "Gijera@example.com",
     created_at: "2017-12-08 05:20:05",
     updated_at: "2017-12-08 05:51:58",
   }
>>> Mail::send('emails.welcome', ['user' => $user], function($m)use($user){
...             $m->from('blog@example.com', 'Blog');
...             $m->to($user->email, $user->name)->subject('Your Blog!');
...         });
=> 1
{% endhighlight %}
首先将User中的第一条用户信息赋给<samp>$user</samp>，然后使用<samp>Mail::send()</samp>来发送相应的邮件，最后返回了<samp>1</samp>代表发送成功，之后可以在mailtrap中看到刚刚发送的邮件。

最后可以把这段代码添加到<samp>RegistrationController的store</samp>方法中，因为是在这里创建用户的，在创建用户后可以发送一条邮件来表示欢迎或是其他信息，当然由于上面的代码中传递了<samp>$user</samp>参数，所以可以在视图中显示参数。

如果在发送邮件的过程中遇到了错误<span class="text-danger">Swift_TransportException with message 'Connection could not be established with host mailtrap.io [php_network_getaddresses: getaddrinfo failed: nodename nor servname provided, or not known #0]'</span>，emmmmmmm...这是因为网络原因，多试几次就行了。