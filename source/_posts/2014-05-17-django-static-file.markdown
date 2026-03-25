---
layout: post
title: Django模板{{ STATIC_URL }}不能被解析的处理
description: 本问题的引起使用的Django版本为1.6.4。
keywords: Django
---
Django一直在更新，静态文件的处理及`settings.py`的设置随着版本的变化也发生着新的变化，但就整个情况来看，是越来越简单了，许多以前写入到`settings.py`中的设置都变成了默认设置。但也正是因为这个原因，当笔者使用以前的处理方式来设置App的时候，就出现了问题。

事情况是这样的，我创建了一个Django应用，然后静态文件的设置是这样的：

```
...
STATIC_URL = '/static/'

MEDIA_URL = '/media/'

# 静态文件目录
STATICFILES_DIRS = (
    os.path.join(BASE_DIR, 'static'),
)
```

然后我启动开发服务器，但访问记录却提示`/app/css/main.css` 404。挺奇怪的一件事，按我的设置，这个CSS文件的访问路径应该是`/static/css/main.css`才对的。然后我查看浏览器中的源码，发现CSS的导入链接变成了`css/main.css`，变成了相对路径，而模板文件中明明使用了`{{ STATIC_URL }}`，这里却并没有得到解析。

Django中使用`RequestContext`来传递一些常用参数的，比如我们常传送的`request`这个参数。然后我查看资料，模板参数传送是`TEMPLATE_CONTEXT_PROCESSORS`来设置的，我开发时使用了`django-social-auth`这个应用，里面的设置是这样的：

```python
TEMPLATE_CONTEXT_PROCESSORS = (
    "django.contrib.auth.context_processors.auth",
    "django.core.context_processors.debug",
    "django.core.context_processors.i18n",
    "django.core.context_processors.media",
    "django.core.context_processors.request",
    'social_auth.context_processors.social_auth_by_type_backends',
)
```

如果不设置这个变量的话，默认是这样的：

```python
In [2]: settings.TEMPLATE_CONTEXT_PROCESSORS
Out[2]:
('django.contrib.auth.context_processors.auth',
 'django.core.context_processors.debug',
 'django.core.context_processors.i18n',
 'django.core.context_processors.media',
 'django.core.context_processors.static',
 'django.core.context_processors.tz',
 'django.contrib.messages.context_processors.messages')
```

这就解释了，我创建的两个应用，其中一个应用，我只是设置了一下`STATIC_URL`，就能访问到文件，但这个同样的设置为什么就是解析不了`{{ STATIC_URL }}`的原因了。

解决方法：

添加上` 'django.core.context_processors.static',`，就一切OK了。

总体感觉，设置方面，Django确实简单了不少，以前1.4吧，对于静态文件的设置，还需要设置访问路径之类的，而现在，你只需要设置好目录就OK了。
