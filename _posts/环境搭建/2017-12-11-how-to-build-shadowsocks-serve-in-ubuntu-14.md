---
layout: article
title: 如何在Ubuntu14.04上搭建Shadowsocks服务器
category: 环境搭建
tags: Shadowsocks
---
文本介绍了如何在ECS云服务器上搭建ss服务器，ss服务器使用特定的中转服务器来完成数据传输，这意味着首先需要一台能够访问到外网的服务器。

### 使用SSH连接服务器
打开终端键入<samp>ssh -p port username@IPaddress</samp>即可，如果要访问Google，这台服务器不应该在大陆地区。

### 下载ss服务器
连上服务器后，需要下载一个ss服务器，现在的shadowsocks基本没法动弹了，所以更好的办法是使用<samp>shadowsocks-libev</samp>，可以参考这份文档：[README](https://github.com/iMeiji/shadowsocks_install/wiki/shadowsocks-libev)，里面介绍了比较详细的安装方法，下面是Ubuntu14.04的安装方法：
{% highlight shell %}
sudo apt-get install software-properties-common -y
sudo add-apt-repository ppa:max-c-lv/shadowsocks-libev -y
sudo apt-get update
sudo apt install shadowsocks-libev
{% endhighlight %}

### 配置ss服务器
使用Vim打开配置文件：<samp>vi /etc/shadowsocks-libev/config.json</samp>

然后修改：
{% highlight json %}
{
    "server":"example.com or X.X.X.X",
    "server_port":443,
    "password":"password",
    "timeout":300,
    "method":"rc4-md5"
}
{% endhighlight %}
其中<samp>server</samp>是服务器的IP，还可以使用<samp>0.0.0.0</samp>来默认为服务器地址；<samp>server_port</samp>为服务器监听端口号；<samp>password</samp>可以自由设置，这个密码将会在登录客户端的时候用到；<samp>timeout</samp>为等待时间，超时则会自动断开与服务器的连接，数值越大，等待的时间越长，可以根据网络环境来相应的设置；<samp>method</samp>为加密方法，只要跟客户端设置一致即可。

配置好之后，重启服务器：<samp>service shadowsocks-libev restart</samp>。

### 下载ss客户端
下载<samp>ShadowsocksX-NG</samp>，可以到[Github](https://github.com/shadowsocks/ShadowsocksX-NG/releases/)下载最新版本或历史版本。

下载之后打开它，然后添加一个服务器，配置它与服务器端配置保持一致即可。

![options](http://upload-images.jianshu.io/upload_images/8727489-d50c051ad501e1a4.png?imageMogr2/auto-orient/strip%7CimageView2/2/w/1240)

Good Luck and Enjoy it 😉!!!