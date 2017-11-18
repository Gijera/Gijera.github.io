---
layout: blogs
title: 如何阅读Smalltalk程序
category: translate
---
> 翻译于[Smalltalk Tutorial](http://wiki.c2.com/?SmalltalkTutorial)中的[readingSmalltalk.pdf](http://www.jera.com/techinfo/readingSmalltalk.pdf)
 
本文简单介绍了Smalltalk语言的一些语法规则，Smalltalk语言中使用MVC模式来构建用户界面，即MVC模式是起源于Smalltalk语言的，不过Smalltalk的中文资料太少，这篇翻译文章也是为我自己将要写的续集文章——**浅谈MVC框架模式**做一个铺垫。

# 阅读Smalltalk程序
我对smalltalk语言的介绍是基于我处理其他语言的方法：
1. 审查字符集和符号
2. 审查保留字(关键字)
3. 审查每个独特的语法格式
4. 审查每个独特的语义形式
5. 审查代码库 (*虽然这一条要求只占了全部要求的20%，但它却要求你付出80%的努力*)

那么从这里开始吧。

### 1.字符集和符号
标准字符集由十二个特殊字符组成：```# : ^ . ' | " ; ( ) [ ]```
符号有：{标识符} {数字} {字符串} {注释} {二进制操作符} {关键字} {特殊符号}

***标识符***
跟你所想的一样，除了使用大写字母开头，而不是下划线。
```
capitalLettersLikeThis    [✔︎]
rather_than_underscores   [✘]
```

***数字***
这个也是跟你想的一样

***‘字符串’***
使用单引号

***”注释“***
使用双引号

***二进制操作符***
由一个或两个字符组成，组成二进制操作符的字符在实现之间有一点不同，不过如果只是为了实现阅读Smalltalk程序这个目标，你可以假设任何不在上面的{特殊符号}里的非字母数字的字符可以组成{二进制操作符}.比如：
* ```+```
* ```++```
* ```?*```
* ```->```

***关键字***
仅仅是一个有冒号结尾的标识符，比如```anyIdentifierLikeThis:```就是一个{关键字}。在Smalltalk里面，一个关键字只有在它形成“关键字消息”的时候才有意义，它是一种区域性的符号(不同于标识符或字符串),这意味着它作为一个单独的符号并不特殊。一些语言有像是```BEGIN```和```END```之类的{关键字}在语言内有着特殊的意义，而关键字在Smalltalk中则不是这样的，这是一种严格的语法格式。

***特殊符号***
是一些特殊字符，作为分隔符来解析语言。
```#```   用于符号的开头如：```#symbol```
```:```   用于关键字的结尾如：```keyword:```
```^```  用于问答对象如：```^answerThisObject```
```.```  分隔语句
```'```  限定一个字符串
```|``` 表示临时变量
```"```  注释
```;```  级联语句
```(```  表达式的开始
```)``` 表达式的结束
```[```  闭包域的开始
```]```  闭包域的结束

### 2.保留字
有五个保留字：***nil false true self super***.
这些都是保留字，因为编译器、优化器和VM都知道它们。
***nil***
这个值代表未初始化的值，它也代表了某个值可能忘了初始化，就好像“我没有主意”，“从未有过任何值”之类的。nil有时候会被NullObject或是ExceptionalValues错误的使用。
***true*** and ***false***
分别属于单例类True和False。
***self***
当你在阅读或是使用这个词时，表示你当前使用的对象的引用。如果对象的类没有这个方法，你要去最近的超类(父类)中读取这个方法。
***super***
与self表示相同的引用对象。
阅读下面这一段100次，直到你接受了这个事实才继续往下看。
*为什么两个名字会指向相同的对象呢？这可能很难理解直到你使用它，super和self是指同一个对象，当你试图弄清楚对象将执行哪个方法来响应发送的消息时，假设对象的类没有这样的方法。换句话说，如果对象的类确实有一个方法来传递你发送的消息，始终会从对象的超类中开始查找这个方法。这样你就可以扩展超类的行为，而不必重写它。比如，定义和超类一样的方法aMethod，然后：*
```
>>aMethod
        super aMethod.
        self doSomeMoreStuff.
```
*或者定义aMethod来做一些新的事情，然后跟着超类的方法。*
```
>>aMethod
        self doSomeMoreStuff.
        super aMethod.
```
### 3.语法格式
在Smalltalk中有一个很重要的，但你以前可能不太熟悉的概念：
**任何事物**都是对象
以及
所有代码都采用单一的概念形式：anObject withSomeMessageSentToIt.（注：Smalltalk中的消息发送机制）
如果你想继续使用C++、Java或其他面向对象的语言工作，那么你很可能不能理解这是什么。
如果它开始对你有意义，那你就停止阅读Smalltalk，因为你正处于危险之中，稍后将详细介绍这些...
这里有六个语法格式：
**1.  一元消息发送**
```
        object isSentThisUnaryMessage.
```
**2. 二元消息发送**
```
        object {isSentThisBinaryOperator} withThisObjectAsOperand.
```
**3. 关键字消息发送**
```
object isSentThisKeywordMessage: withThisObjectAsParameter.
object isSent: thisObject and: thisOtherObject.
object is: sent this: message with: 4 parameters: ok.
object is: sent this message: with parameters: (1 + 2). 
object is: (sent this) message: (with) parameters: (3).
```
这可能有一些奇怪，直到你明白为止。关键字消息写成C函数调用可能会看起来像这样：
```
isSentThisKeywordMessage(object,andParameter); 
isSentAnd(object,thisObject,thisOtherObject); 
isThisWithParameters(object,sent,message,4,ok); 
isMessageParameters(object,this(sent),with,(1+2));
isMessageParameters(object,(this(sent)),(with),(3));
```
关键字消息就像这样：
```
isSentThisKeywordMessage: 
isSent:and:
is:this:with:parameters: 
is:message:parameters:
```
注意一个参数，或是一个二元消息的操作符，既可以是一个对象，也可以是向一个对象发送的消息。就像在C里面一个参数可能是操作符，也可能是操作数；既可以是一个字面值{对象}，一个常量，一个变量，一个指针表达式，或是一个函数调用。
**4. 代码块(也叫闭包)**
```
[thisObject willGetThisUnaryMessageSentToIt]
[:someObject| someObject willGetThisMessage]
[:first :second| thisObject gets: first and: second]
[:first :second| first gets: thisObject and: second]
```
一个块可以被认为是一个临时类的唯一实例，没有超类,只有一个方法。{不是真的，但是这样思考直到你真的明白}。什么是一个方法？这取决于参数的数量：

|如果一个闭包含有||这是唯一已知的方法|
|:---:|:---:|:---:|
|没有参数|["一个没有参数的闭包"]| value|
|一个参数|[:x\| “有一个参数的闭包”]|value: actualParameter|
|两个参数|[:x :y\|"有两个参数的闭包"]|value:firstActual value:secondActual|
|...|||
示例：

```
[object messageSent] value.
```
当这个必报接受一个一元消息，这个一元消息messageSent将被传递给对象object。
```
[some code] value.
```
value消息将会是闭包执行some code。
[:one| any code can be in here] value: object.
value: object消息将会与第一个参数one绑定，然后执行代码。
**5. 返回值**
^ resultingObject
任何方法都会至少有一个返回值，即便你看不到它。一般情况下你都可以看到它，在方法的最后一行，如果你没有看到它，默认将会返回```^self```
它的另一个作用是提前退出，比如：
```
object isNil ifTrue: [^thisObject].
object getsThisMessage.
^self
```
这可能会让你有些不习惯，因为这不符合结构化编程里面的“单一入口/单一出口”原则。注意Smalltalk的程序很短，不，是非常的短，我们根本不在乎。一个方法仅仅只有几行程序会让你头脑清楚，并且如果我们以后要对所有的出口点作出改变也比较容易。
**6. 定义方法**
使用浏览器时，实际上并没有看到这种语法形式，但是当Smalltalk在外部环境中被描述时，使用以下语法来表示方法的定义:

* 一元
```
ClassName>>methodSelector
someObject getsThisMessage. someOtherObject 
getsThisOtherMessage.
^answerYetAnotherObject
```
这意味着类名“ClassName”有一个一元消息方法methodSelector，它的定义如上面的代码所示。
* 二元
```
ClassName>>+ operand
instanceVariable := instanceVariable + operand.
^self
```
这意味着类名“ClassName”有一个二元消息方法+ operand，它的定义如上面的代码所示。
* 关键字
```
ClassName>>keyword: object message: text
Transcript nextPut: object; nextPut: ' '; nextPutAll: text; cr.
```
这意味着类名“ClassName”含有一个定义了两个参数的关键字消息方法keyword: message:，它的定义如上面的代码所示。
**7. 赋值**
好吧，我撒谎了，这是第七个语法格式。
在前面那个二元消息方法中，你看到了赋值语句，它非常的特别，有两个原因：
1. 因为它可能是一个二进制消息，但事实并非如此。
2. 因为它没有遵循其他消息的一致形式：
```
someObject isSentSomeMessage
```
(注：没有遵循消息发送的形式)
**8.级联**
好吧，我又撒谎了，两次。这是第八个语法格式，另一个“一致形式”的例外。在前面的关键字消息方法中，你看到了一些分号。分号是这些东西的缩写：
*发送下一个消息到相同的对象(接受前一个消息的对象)*
因此，下面的示例
```
Transcript nextPut: object; nextPut: ' '; nextPutAll: text; cr.
```
是指
发送nextPut: 这个关键字消息(和参数object)给一个叫做“Transcript”的对象，
然后发送另一个nextPut:消息(和参数' ')给同一个对象(Transcript)，
然后发送一个nextPutAll:消息(和参数text)给相同的对象，
然后发送一个cr消息给它，
最后，把自己作为这个方法的返回值.(在结尾隐含了```^self```)。
### 4.运算符优先级
每个人都喜欢记忆练习。你知道多少种优先级和结合性的组合？你应该知道多少？以下是Smalltalk的规则：

|消息|优先级|
|:--:|:--:|
|一元|高优先级|
|二元||
|关键字||
|符号|低优先级|
|其他|从左至右|
当然，括号可以改变优先级，就像其他语言，就是这样！
你会觉得不能这样做，它并不会像你想像的那样运行：

```
3 + 4 * 5 = 35 ! ? !
```
但是它的确这么做了，这才是对的。
这非常的愚蠢！
是的，它非常的愚蠢，把你逼疯了大约一个星期，然后它就消失了，就像没有问题一样。
(注：因为在Smalltalk中并不遵循四则运算的优先级，而是从左至右运算)
### 就是这样
让我重复一遍——就是这样！这就是整个语言，剩下的就是学习库，学习这门语言的技巧和方言。
现在，精明的读者可能在想一些东西，比如：
*等一下，独特的语义形式在哪里？你并没有讲控制流，也没有涉及到变量、类型、分配和重新分配内存、指针、模版、虚函数、静态方法等等...*
很好，不过这是错误的，我涵盖了所有这些。好吧，好吧，你赢了。我从来没讲过关于变量的任何东西，那是因为它没有，除了赋值语句：
```
instVar1 := 'aString'.
```
以及临时符号：
```
|aTemp anotherTemp|
```
你可以定义实例变量，通过在browser窗口中输入它们的名字，以及将类变量输入到不同的特殊位置。这里没有特殊的语义格式，因为它们不是代码的一部分，这里没有类型，也没有算法，转换，解引用之类的‘builtin’语法，这里有分配，不过只能通过消息发送：
```
someClassName new
```
并且这里无法重新分配，当最后一个对象的引用不存在的时候，对象被垃圾回收了。你不能使用```*(void *)(0)```，其他东西都不存在。
假的，你说。你没有提到检查控制流的特殊语法。
是的，我没有，没有提到任何相关的语法，因为你不需要这样的概念，就像控制流会打乱你的语法一样。
oh，不要觉得不可思议，当然你会觉得，它完全是特别的。
很抱歉让你失望了，还记得我说过的“一个块可以被认为是一个临时类的唯一实例，没有超类,只有一个方法“吗？
这就是真相，block还会对其他一些消息作出响应，就像：
```
[ ] whileTrue: [ ]
```
意思是“发送一个消息给一个对象”，从字面上发送一个关键字消息whileTrue:(以及一个参数(第二个block))给一个对象(第一个block)。你认为当它(第一个block)得到这样一个消息时，会做什么？第一个block将会对自身进行计算(发送一个value消息给自己)，如果结果为真，将会把value消息发送给第二个block，然后重新开始。否则，它会退出并返回false。
当然，布尔值也有类似的消息方法：
```
False>>isTrue: aBlock
        ^nil
False>>ifFalse: aBlock
        ^aBlock value
```
False是一个类，它有两个消息的方法。由于每个对象false都是类False的实例，所以没什么可测试的。它会忽略ifTrue:的请求，当接受ifFalse:的请求时，它总是会做点什么。另一个类，True，跟False有刚好相反的特性。(别再想这个了，你会开始认为Smalltalk不想某些人认为的那么慢，比如，它比Java快...)

检查这个库，看看如何变更这些简单的主题来建立你曾经想过的那些控制结构，除了一个，没人会把switch/case语句放在库中。这会让初学者不爽，以后你会发现你的方法总是很短，不能容下这样的语句，如果你想要使用它们，这意味着你的设计没有利用好多态性，所以你应该修复你的程序...

最后一个语法糖是：
```
'这是一个字符串'
#这是一个符号
```
这两者几乎是相同的，只是后者是一个单例，有一个唯一的哈希值，用于查找之类的，但你可以忽略它。

希望这些能帮助你尝试阅读Smalltalk程序，不过你要当心！当你理解了所有的这些，你可能会发现很难继续使用你现在正在使用的语言...无一例外，我已经警告过你了;-)

### 下一步是什么？
为了进一步探索Smalltalk，你可以：
**安装**
Object Arts的Dolphin Smalltalk
非常精彩的作品，玩玩它，尝试一些示例，阅读教育中心的材料。
(这些都是免费的，直到你上瘾)
**阅读**
comp.lang.smalltalk
Smalltalk: Best Practice Patterns (Kent Beck)
Smalltalk Companion to Design Patterns (Brown, et al)
(和你喜欢的其他Smalltalk书籍)
**掌握**
Cincom系统的VisualWorks
不可思议的工具集，Smalltalk行业的标杆，强大且稳定。
一个巨大的类图书馆(a.k.a已经为你做了这些工作)
(非商业版本的VisualWorks也是免费的)。
<hr>

以上就是reading smalltalk这本小小的smalltalk教程的全部翻译内容，如果我有翻译得不好的地方或是错误，希望大家可以提出来，我会改掉它。

smalltalk是一门不同于其他语言的面向对象语言，它的所有功能几乎都是基于消息发送机制，这是其他语言没有的特点。很多设计模式的诞生其实都是在Smalltalk语言中，包括四人帮写的《设计模式》一书，也使用了C++和Smalltalk共同来描述那些模式。除此之外，Smalltalk拥有许多方言和不同的环境，就像Lisp一样。上面提到的Dolphin Smalltalk是一个，Squeak也是一个比较活跃的Smalltalk方言和环境。

如果有机会我会继续翻译Squeak方言的一些简单教程，希望这些内容能帮助大家了解Smalltalk，以及更好的学习设计模式。

> 本文遵循自由转载-非商用-非衍生-保持署名（[知识共享3.0协议](https://creativecommons.org/licenses/by-nc-nd/3.0/deed.zh)）
This article follows the CC-3.0 License.