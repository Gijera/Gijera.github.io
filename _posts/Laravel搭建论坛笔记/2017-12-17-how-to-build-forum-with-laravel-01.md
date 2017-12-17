---
layout: article
title: 使用Seeding填充数据库
category: Laravel搭建论坛笔记
tags: Laravel Forum Seed
---
本篇文章记录如何使用Seed工具来生成一些填充数据用于测试，为后面的测试工作做准备。

## 生成数据
配置好数据库设置以后，在执行`migrate`命令的时候，如果数据库的版本低于5.7，可能会遇到这样的错误：

```
In Connection.php line 647:

  SQLSTATE[42000]: Syntax error or access violation: 1071 Specified key was t
  oo long; max key length is 767 bytes (SQL: alter table `users` add unique `
  users_email_unique`(`email`))


In Connection.php line 449:

  SQLSTATE[42000]: Syntax error or access violation: 1071 Specified key was t
  oo long; max key length is 767 bytes
```
解决方法见[Laravel5.4 key too long](https://laravel-news.com/laravel-5-4-key-too-long-error)。

由于使用TDD的方法开发，所以先编写测试，然后再进行开发。所以首先使用数据工厂来产生一些数据，可以在tinker中执行

```
$threads = factory('App\Thread',5)->create();
$threads->each(function($thread){factory('App\Reply',2)->create(['thread_id' => $thread->id]);})
```
以上命令生成了5条Thread数据，以及为每条Thread数据产生了2条Reply数据。现在在数据库中，就拥有了一些数据，这种方法，就是Seeding，也叫数据填充。

官网参考指南——[Seeding](https://laravel.com/docs/5.4/seeding)

## 其他常用的Seed方法
1.创建一个Seed类

```
php artisan make:seeder UsersTableSeeder
```
2.运行Seed

```
php artisan db:seed

php artisan db:seed --class=UsersTableSeeder
```
3.回滚+重新填充数据

```
php artisan migrate:refresh --seed
```

## 把前面的代码写到ThreadTableSeeder中
1.新建ThreadTableSeeder类

```
php artisan make:seeder ThreadTableSeeder
```
2.编写ThreadTableSeeder

```
public function run()
{
      $threads = factory('App\Thread',5)->create();
	  $threads->each(function($thread){
		  factory('App\Reply',2)->create(['thread_id' => $thread->id]);
	  });
}
```
3.在DatabaseSeeder中添加调用语句

```
class DatabaseSeeder extends Seeder
{
    /**
     * Run the database seeds.
     *
     * @return void
     */
    public function run()
    {
        $this->call(ThreadTableSeeder::class);
    }
}
```
4.执行migrate

```
php artisan migrate:refresh --seed
```
之后如果出了什么问题，可以直接执行migrate语句，能够一步填充数据。