---
layout: post
Title: #6 django-notifications 使用记录
---

[WEE](http://joinwee.com)一直处于一种很安静的状态，安静到用户有了新的讨论或是讨论中有了一些新的评论，发起人都不能看到，这似乎有些安静过了头了。基本的消息推送，提示用户有了新的消息，对这个社区来说，还是很需要的。

但由于自己的Django水平一直处于一个入门级的水准，对于这个消息功能，该如何推送，一直没能搞懂该如何去实现这个结构设计，尽管有一个大致的想法，但实际实现起来可能又是另外一回事，于是就Google了一下，然后找到了[django-notifications](https://github.com/brantyoung/django-notifications)。

由于我自己的英文水平挺有限的，读起文档来挺有限，主要还是看代码来看使用的。另外作者在他的[博客](http://blog.yangyubo.com/2012/07/23/django-notifications-hq/)也给出了大致的使用方法。

我这里也记录一下，当是给作个使用记录吧。

## 安装
使用`pip`安装:

```
pip install django-notifications-hq
```

从源码安装：

```
$ git clone https://github.com/brantyoung/django-notifications
$ cd django-notifications
$ python setup.py install
```

## 添加app

将应用添加到你的``settings.py``的`INSTALLED_APPS`，如：

```
INSTALLED_APPS = (
    'django.contrib.auth',
    ...
    'notifications',
    ...
)
```

## 添加urls

```
import notifications

urlpatterns = patterns('',
    ...
    ('^inbox/notifications/', include(notifications.urls)),
    ...
)
```

这里需要注意，要按照这种先import，然后再直接导入python名的方式。如果按这种方式：

```
...

urlpatterns = patterns('',
    ...
    ('^inbox/notifications/', include('notifications.urls')),
    ...
)
```

在使用时出错，命令空间出错的信息。

## 生成数据表

需要安装`django-south`，然后使用下面的命令生成数据表：

```manage.py migrate notifications```

## 使用

使用主要是两个方面的，一个是`models.py`中，需要添加一个`post_save`有signal。

如我的：

```
# 当用户发起一个新的讨论时，系统会自动将一条消息发送给所属微课的作者
def topic_handler(sender, instance, created, **kwargs):
    lesson = instance.content_object
    if instance.user == lesson.creater:
        return 
    notify.send(instance.user,               # 消息发送者
                recipient=lesson.creater,    # 消息接收者
                verb=u'发起了的一个新讨论',     #消息的动作名称
                action_object=lesson,        # 消息产生于对象
                target=instance,             # 产生的目标讨论记录
                public=False
                )
```

这里部份我花了比较长的时间来研究，主要是自己以前没有写过这么复杂的数据关系。

二是在模板中的使用，基本上修改下代`list.html`和`notice.html`就行了。

## 我的疑问

我将个内容部署上线后，发现当登录用户使用`mark_all_as_read`后，站上的全部内容都被设置成了已读。后来我修改了源码中的`mark_all_as_read()`，原来是这样的：

```
@login_required
def mark_all_as_read(request):
    request.user.notifications.mark_all_as_read()
    return redirect('notifications:all')
```

我改成了:

```
@login_required
def mark_all_as_read(request):
    request.user.notifications.mark_all_as_read(recipient=request.user)
    return redirect('notifications:all')

```

不清楚是我自己不懂用法，还是作者在开发的时候的理念不一样。有点费解的是，来`request.user.notifiations`就能拿到当前用户的所有记录的，但为什么，还要在后面限定查询条件呢？

这个问题，同样出现在的`notifications_unread`这个模板Tag中。居然显出示了全站的消息数量。然后我自己也改了下，改成了：

```
# -*- coding: utf-8 -*-
from django.template import Library
from django.template.base import TemplateSyntaxError
from django.template import Node

register = Library()

@register.assignment_tag(takes_context=True)
def notifications_unread(context):
    if 'user' not in context:
        return ''
    
    user = context['user']
    if user.is_anonymous():
        return ''
    return user.notifications.filter(unread=True).count()
```

这样改后，问题就不存在了。

但这样改之后，我自己感觉还是不太妥，应该还是从`models.py`去改`NotificationQuerySet`，可能这样会好一些。但我现在需要这个功能，我就先用上再说。

最后一个问题，就是当用户将一条讨论删除之后，而推送的关于这个讨论的消息并没有删除掉，我暂时也没想到如何处理。现在暂时上线了，后面再一点点改，另外我自己也fork了作者的代码，修改也提交到自己的库中了。
