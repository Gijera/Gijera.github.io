---
layout: article
title: 编写测试驱动
category: Laravel搭建论坛笔记
tags: Laravel Forum phpunit
---
为Thread编写一点测试。

## 配置phpunit.xml

```
<php>
    <env name="APP_ENV" value="testing"/>
    <env name="DB_CONNECTION" value="sqlite"/>
    <env name="DB_DATABASE" value=":memory:"/>
    <env name="CACHE_DRIVER" value="array"/>
    <env name="SESSION_DRIVER" value="array"/>
    <env name="QUEUE_DRIVER" value="sync"/>
</php>
```
这样的配置会让测试的时候的数据不会影响使用的数据，比如之前在数据库中填充了一些数据，这个时候直接执行测试，会导致所有的数据都被销毁。

## 测试路由
```
<?php

namespace Tests\Feature;

use Tests\TestCase;
use Illuminate\Foundation\Testing\DatabaseMigrations;

class ThreadsTest extends TestCase
{
    use DatabaseMigrations;

    /** @test **/
    public function a_user_can_browse_threads()
    {
        $response = $this->get('/thread');

        $response->assertStatus(200);
    }
}
```
上面的代码测试路由`/thread`是否能够访问，通过测试status变量是否等于200。

## 测试具体数据
```
public function a_user_can_browse_threads()
{
	$thread = factory('App\Thread')->create();

    $response = $this->get('/threads');

    $response->assertSee($thread->title);
}
```
编写好了路由、控制器、视图之后，就能正确的访问到网站，通过配置前面的`phpunit.xml`文件，在测试里添加的数据不会被增加到之前填充的数据中去，所以可以随意执行测试，**测试成功以后还要注意进行失败测试，即移除掉上面这段测试代码中核心的部分。因为上面的代码测试See，这一块主要是测试视图的，所以可以把视图里面的代码移除掉，然后测试是否出错，出错了才能说明测试是起到了作用的。**

## 可用的断言
* Laravel提供的特定(HTTP)断言——[http-tests#available-assertions](https://laravel.com/docs/5.4/http-tests#available-assertions)
* phpunit可用的断言——[phpunit.de 断言](https://phpunit.de/manual/5.7/zh_cn/appendixes.assertions.html)