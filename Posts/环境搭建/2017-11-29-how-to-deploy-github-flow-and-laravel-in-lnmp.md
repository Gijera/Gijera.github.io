---
layout: article
title: 如何在lnmp环境下部署Laravel5.1以及Github钩子
category: 环境搭建
tags: lnmp Laravel L5 GithubFlow deploy
---
本文介绍的是如何在(阿里云ESC云服务器)Ubuntu14.04环境下搭建lnmp环境，以及在该环境下部署Laravel和github webhook(钩子)，实现在本地<samp>git pull</samp>到Github仓库中后，通过钩子自动同步到服务器。

### 安装Lnmp环境及配置
这一环节请参考这篇文章:[从零开始部署一个Laravel站点](https://www.codecasts.com/blog/post/deploy-laravel-app-on-ubuntu-vps)

这篇文章是指导如何安装lnmp以及部署Laravel站点，如果不需要部署Github工作流，这篇文章就是完全指南.

### 利用Webhook(钩子)实现PHP自动部署Git代码
这一环节请参考:[利用WebHook实现PHP自动部署Git代码](https://m.aoh.cc/149.html)

这篇文章是指导如何在Nginx环境下部署Github工作流，如果不需要部署Laravel框架，这篇文章可以帮助我们在部署Github钩子的时候少走很多弯路.<span class="text-danger">要注意的是这篇文章比较简单，有些步骤比如Github需要两个公钥，一个是用户公钥，一个是部署公钥，部署公钥是针对项目的，在安装部署公钥之前要自己创建一个.ssh在开发目录而不是根目录</span>,很多人出现错误 <samp>无法创建/var/www/.ssh目录</samp> ，就是因为这一步出了错.可以结合
这个视频: [Github Webhook 实现代码自动部署](https://www.codecasts.com/series/use-git-in-your-own-way/episodes/15).

### 使用github钩子部署Laravel 5
这一环节请参考:[Using github webhooks in Laravel 5](https://victorcruz.me/using-github-webhooks-in-laravel-5/).

这篇文章主要是讲如何在Laravel5中部署github钩子，适合不同的环境，而不限于Lnmp。可以使用简单的办法，创建一个路由然后让该路由执行bash文件或者php文件。这篇文章涉及到使用中间件来构建Laravel与Github的密令验证，然后使用控制器来调用php执行相应的工作，省略了控制器代码，但我在后面会补充PHP控制Github的代码。<span class="text-danger">要注意的就是由于Github钩子发送的是Post请求，而Laravel要求Post请求中必须包含CSRF令牌，否则Github将无法发送请求给Laravel.</span>所以把路由添加到不受保护的CSRF中去，可以参考[Laravel 5.1中文文档 不受-CSRF-保护的-URIs](https://d.laravel-china.org/docs/5.1/routing#不受-CSRF-保护的-URIs)。在app/Http/Middleware/VerifyCsrfToken.php中添加如下代码:
{% highlight php %}
<?php
namespace App\Http\Middleware;
use Illuminate\Foundation\Http\Middleware\VerifyCsrfToken as BaseVerifier;
class VerifyCsrfToken extends BaseVerifier
{
    /**
     * URIs 应被 CSRF 验证执行。
     *
     * @var array
     */
    protected $except = [
        'Github钩子路由',
    ];
}
{% endhighlight %}

如果使用的是Laravel5.1以上的版本，还可以参考这篇文章:[Laravel: automated deployment using a GitHub webhook](http://jeromejaglale.com/doc/php/laravel_github_webhook).这篇文章利用Laravel的新功能，使用api而不是web来跳过CSRF密令检查，所以不需要再多添加代码.


### PHP控制自动更新Github的代码
如果使用的是Laravel的控制器来控制更新Github，那么可以添加下面这个控制器：
{% highlight php %}
<?php
namespace App\Http\Controllers;
use Route;
use Illuminate\Http\Request;
class GithubController extends Controller
{
    /**
     * Update ticket status depending on github action
     * 
     * @param Request $request  Basic Request
     *
     * @return void
     */
    public function githubUpdate(Request $request)
    {
	    error_reporting(7);
	    date_default_timezone_set('UTC');
	    define("WWW_ROOT", "/www/网站根目录");
	    $shell = sprintf("cd %s && git pull 2>&1", WWW_ROOT);
	    $output = shell_exec($shell);
	    $log = sprintf("[%s] %s \n", date('Y-m-d H:i:s', time()), $output);
	    echo $log;
    }
}
{% endhighlight php %}
如果没有使用Laravel，也可以将githubUPdate函数中的代码直接拷贝到webhook.php文件中去.上面这段代码其实是使用php来调用shell命令执行<samp>git pull</samp>.最好首先用一个Get路由来测试，因为上面的代码有一个日志输出，如果成功部署了Github钩子，它会显示Already up-to-date.否则会显示相应的错误，如果出现错误，可以参考后面的错误处理.如果已经成功，可以将打印日志这部分内容从代码中去掉.

<p class="text-danger">要注意的是，为了使php执行shell命令，必须到php.ini下将disable_function里面的exec函数删除，否则php将不能执行shell命令。</p>

### 部署过程常见的错误及解决方法
为了能够显示错误，需要设置两个地方
1. 开启php.ini的display_error
2. 到Laravel的.env下打开debug
如果使用的不是Laravel，那么只需要配置第一条php.ini即可。

#### 跟SSH有关的错误
<dl>
	<dt>1.Could not open a connection to your authentication agent</dt>
	<dd>原因是ssh权限没有启动,启动权限：ssh-agent bash</dd>
	<dt>2.Could not create directory '/var/www/.ssh'</dt>
	<dd>原因是Nginx服务器的权限不够，应该要给予www-data用户足够的权限，或者直接手动创建一个.ssh目录: sudo mkdir /var/www/.ssh</dd>
	<dt>3.error cannot open .git/fetch_head permission denied</dt>
	<dd>这是因为在主机上的用户是root，而在nginx服务器上的用户是www-data，可以通过分别从主机／nginx服务器上运行命令<samp>whoami</samp>看到答案，这个时候一定不要想着如何给www-data root权限，只需要给它github权限即可，需要做三件事，第一就是在服务器上设置ssh的时候不要输入密码，而是直接按<samp>Enter</samp>，这是为了避免输入ssh密码，然后<samp>git clone</samp>的时候要使用ssh而不是http，最后在clone的时候使用<samp>sudo -Hu www-data git clone</samp>，否则就默认是root用户操作git.如果还没解决问题，请参考下面的权限问题</dd>
</dl>

#### 跟Laravel有关的错误
<dl>
	<dt>一片空白无报错，或是HTTP错误代码为500</dt>
	<dd>如果使用的是Laravel 5.1，确保php是5.5.9或以上版本，其余的Laravel版本去看相应的手册，如果php版本没问题，参考下面的权限问题</dd>
</dl>

#### 其他权限问题
假定网站根目录为 /var/www
下面这几条给权限命令基本可以解决所有的权限问题，但是记住，git clone的时候一定要以www-data的身份，否则无法执行git pull
{% highlight bash %}
# 给用户正确的访问网站的权限
sudo chown -R :www-data /var/www
# 给Laravel目录写权限
sudo chmod -R 775 /var/www/laravel/storage
sudo chmod -R 775 /var/www/laravel/bootstrap
{% endhighlight %}