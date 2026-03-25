---
layout: post
Title: Django 模版过滤器timesince的自定义
---

其实对于Django的一些自定义功能我使用得是非常少的，许多已提供的方法我自己都暂时还和许多没有吃透，对于自定义功能，就用得更少了。

在使用`timasince`时，这个时间过滤器时，会显示如“4 天, 21 小时前”，但对于时间比较久的一点的，还会显示“多少月，多少天之前”，这样使用起来感觉意义不是太大，对于“某个时间点之前”的事，我希望能显示近几天，这样以示这个内容发布的时间是比较近的。

我自己常用的来显示时间的过滤器有`date`和`timesince`这两个，如果能将这两个结合起来，近的用“多少时间之前”，远一点的，就直接显示时间，这样就比较好了。

这个功能，我在<http://django-china.cn>中看到了，发于发了一篇贴子：《[Django中国社区的时间过滤器是怎么做的？](http://django-china.cn/topic/390/)》：

> 在Django的时间过滤器中，有个timesince可以显示发数据记录的时间与当前时间的差，我在自己站上使用的时候，时间记录都是多少小时前，多少天，多少周，甚至于多少月前，但我看Django中国社区的时间，貌似超过一个时间段之后，就直接显示为具体的年月日，这个是如何做到的？自己写的tag吗？
> 
> 烦请指教下。

得到确认后，我自己在Django源码中找到了关于这个功能的代码，可以在`django.utils.timesince.py`中找到。然后照着上面的代码方法，自己写了一个过滤器出来：

```python
# -*- coding: utf-8 -*-
from django import template
from django.utils.timesince import timesince
from django.utils import formats
from django.utils.dateformat import format, time_format
from django.utils import timezone

register = template.Library()

@register.filter(expects_localtime=True, is_safe=False)
def weetimesince(value, arg=None):
    if value is None:
        return ''

    now = timezone.now()
    diff = now - value
    if diff.days >= 3:
        try:
            return formats.date_format(value, arg)
        except AttributeError:
            try:
                return format(value, arg)
            except AttributeError:
                return ''
    else:
        try:
            return timesince(value)+u'前'
        except (ValueError, TypeError):
            return ''
```

其实就是一个时间长度判断，然后再先用不同的显示方式而已。对于`now`这个变量，最开始使用想使用`datetime.datetime.now()`来生成的，但使用的时候，发现与数据库的`datetime`对不上，不能使用减操作，Google了下，由于时区问题，然后换用了`timezone`方法。

将代码放到`app.templatetags`下面，并在时面创建一个`__init__.py`空文件，就可以模板中调用了。调用之前，需要`load`一下。

在解决这个问题的过程中，我查看了`django.utils`这个目录中的代码，觉得很值得花些时间去学习一下，代码简洁，包含了许多的对字符，时间，表的操作方法，而些这些代码看似都很简单。后面我打算再花时间，去阅读这些。

        
