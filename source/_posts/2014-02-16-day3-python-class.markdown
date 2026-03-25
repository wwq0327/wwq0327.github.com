---
layout: post
Title: #4 Python类的定义
---

来自《Python 核心》里的一句话，道明类与实例及关系：

> 类与实例相互关联着:类是对象的定义,而实例是"真正的实物",它存放了类中所定义的对象的具体信息。

Python是完全面向对象的，你可以定义自己的类，也可以从自己所定义的类或内置的类继承，然后再从这些定义的类创建类的实例。

Python的类定义很简单，创建一个类之后，就可以开始实例化这个类并进行使用了，当然你所创建的这个类，也可以作为其它类的一个基类，再创建新的类。

这里我们以学校成员为一个实例来研究类。学校里面的成员，最基本的两类，一是教师，二是学生。

## 最简单的类定义

```python
class Member:
	pass
```

这样就创建了一个最简单的类，以`class`作为类的关键词，后面空格再跟一个类名。类名一般采用首字母大写的方式，如果还有其它词，比如`学校成员`，则可使用`SchoolMember`每个单词首字大定，然后直接连到一起。


## 类的初始化： __init__

这里，当用户实例化一`Member`类时，我们想让其提供其姓名和年龄，这里我们设置两个类成员属性，`name`和`age`，我们这样来做：

```python
class Member:
	'''学校成员类'''

	def __init__(self, name, age):
		'''初始化'''
		self.name = name
		self.age = age
```

`__init__`在类实例创建后初立即调用。类似于C++的构造函数，但有区别，不过我们在使用时可以这么理解。

每个类方法的第一个参数，含`__init__`，都指向类的当前实例的引用。我们总是习惯使用`self`来作为类方法的第一个参数。但在类方法调用的时候，我们则不必写上这个参数了，Python会自动加上。

在类的内部使用属性或调用类的方法时，都需要使用`self`来引用本身。如上例中的`self.name`及`self.age`，如果我在再在这个类中加入一个`talk`方法来打印出`name`和`age`，我们可以这样做：


```python
class Member:
	'''学校成员类'''

	def __init__(self, name, age):
		'''初始化'''
		self.name = name
		self.age = age

	def talk(self):
		print 'My name is %s, and %s old!' % (self.name, self.age)

# 使用类
m = Member('wyatt', '34')
m.talk()

```
由于初始化类时，我们设置了两个参数，所以在创建一个类的实例时，我们需要提供两个参数，参数的设置顺序与函数类似。

这里我们创建了一个`Member`有实例对象`m`并进行了初始化。初始化完成之后，就可以通过实例来调用，进行打印出相应的数据。

## 修改类成员变量值

当一个类实例化之后，我们可以使用这个实例来修改成员属性的值，如：

```python
m.name = 'wwq'
```

再打印之时，就会看到新的变化。

## 结束语

我现在还暂时使用一些类的比如常规的使用方法，平时阅读的时候，多看代码去了，里面的名词之类可能我这里说得并不准确，这里只能是先暂时记录下来，后面我会比较深入的学习类的相关知识，发现不对的地方，再回来进行修改。

这里将我刚刚自己写的一个示例代码一并附上：

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

        print 'My name is %s, and %s old!' % (self.name, self.age)

def test():
    m = Member('wyatt', '34')
    m.talk()

    # 修改实例属性，并再次输出
    m.name, m.age = 'zhang', '23'
    m.talk()

if __name__ == '__main__':
    test()
    
```

有看到的同学，还望指正！
