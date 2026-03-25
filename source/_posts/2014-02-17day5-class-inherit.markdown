---
layout: post
Title: #5 Python类的继承
---

接昨天的内容，再把《Python 核心编程》拿出来看了，对类有了一些新的认识。

在面向对象编程中，类是现在物体的一个抽象，而实例是一个类的一个实现。我这样理解的，类，看作一个工件的模具，而实例则是通过这个模具制作出来的成品。一次类的定义，便可以制作N多个实例出来，就如一个模具，可以生成N个实体的工件一样。

最简单的类的定义是这样的：

```python

class MyObject:
	pass

```

这只是一个容器，你可以将一些属性或方法塞到这个容器之中，如：

```python

mo = MyObject()
mo.x = 1
mo.y = 2
```

这里创建了一个`MyObject`的实例`mo`，然后我给这个容器中接入了两个属性。实例创建之后，内存就会分配空间给这个实例。

我在终端下使用`ipython`演示如下：

```
In [1]: class MyObject:
   ...:     pass
   ...: 

In [2]: dir(MyObject)
Out[2]: ['__doc__', '__module__']

In [3]: mo = MyObject()

In [4]: mo.x = 1

In [5]: mo.y = 2

In [6]: dir(MyObject)
Out[6]: ['__doc__', '__module__']

In [7]: dir(mo)
Out[7]: ['__doc__', '__module__', 'x', 'y']
```

可以看到，实例有了两个新的类属性。

## 完整代码

昨天的内容就说到这里，下面说下类的继承。先看例子吧，我们新建了一个类：`Teacher`:

```python
#!/usr/bin/env python
# -*- coding: utf-8 -*-

#类的定义
# class <类名>
#     <语句>

class Member:
    '''定义一个类，并对其初始化'''

    def __init__(self, name, age):
        '''类的初始化函数，两个实例属性，name 和 age'''
        
        self.name = name
        self.age = age

    def talk(self):
        '''类的方法，输出类属性'''

        print 'My name is %s, and %s old!' % (self.name, self.age),

#类的继承
class Teacher(Member):
    '''定义一个教师类'''

    def __init__(self, name, age, subject):
        Member.__init__(self, name, age) # 使用Member初始化这个类
        self.subject = subject

    def talk(self):
        '''继承Member类中的talk方法
        '''
        Member.talk(self)
        print 'Teach Subject: %s' % self.subject
        
def test():
    m = Member('wyatt', '34')
    m.talk()

    print

    t = Teacher('Mr. Zhang', '28', 'Math')
    t.talk()

if __name__ == '__main__':
    test()
    
```

## 继承及简单示例
类的继承，为代码重要提供了一个非常不错的解决方案。继承的类中，可以重用父类的的数据及方法，也可以重写，举个例子吧：

有一张白纸，我们看作一个基础的类，面然我们在上面画上黑色线条的格子，这样我们就可以写字了。白纸相当于一个基类，当我们画上格子之后，这张纸就成了一个可以练习写字的纸了，但仍然是这样的大小，底为白底，只是划上了黑色的线。

类的继承编码也很简单，通常是这样的：

```python

Class A:
	pass

class B(A):
	pass

class C(A, B):
	pass
```

在类名后面根上括号，再加上基类的名即可。如果是要继承多个类的话，则将类名一并写在括号之中，并用逗号分开。需要注意的是，如果 `A`和`B`类中有有相同属性或方法，则基类中优先调用排在括号中前面的数据和方法。

## 子类的初始化及调用

当我们继承于一个基类之后，可以需要对这个类进行扩展，如添加新的数据或是修改基类中的方法之类的。初始化可以这样做：

```python
class Teacher(Member):
    '''定义一个教师类'''

    def __init__(self, name, age, subject):
        Member.__init__(self, name, age) # 使用Member初始化这个类
        self.subject = subject
```

如上代码，给这个类添加上了一个新的数据， 但两面两个数据仍是通过基类进行初始化的，调用方法：`Member.__ini__(self, 参数1, 参数2)`，然后后面再接上新添加上的数据。

参于方的调用，采用`类名.方法(self)`进行调用，如果需要修改，再添加上新的内容即可。

## 结束语

以上所记录为类的基本使用方法，当是自己所知的一个简单记录吧，仍有太多的问题不能表达清楚，可以还是缘于自己在读书时对知识的理解和掌握仍存在问题，故如此罢。后面还需要继续阅读，担升认识，接触一些高级的用法，因为自己现在在读别人写的一些源码的时候，仍存在许多不能搞明意思的部份。

