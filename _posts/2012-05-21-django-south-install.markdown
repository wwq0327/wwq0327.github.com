---
layout: post
title: "South 使用记录"
date: 2012-05-21 11:22
comments: true
categories: [django, south]
---

### 创建虚拟环境

```bash
[wyatt@localhost git]$ virtualenv my_app
New python executable in my_app/bin/python
Installing setuptools............done.
Installing pip...............done.
```

```bash
$ cd my_app
$ source bin/active
```

### 安装django

```bash
$ pip install django==1.3
```

### 创建项目

```bash
$ django-admin.py startproject my_prj
```
```bash
$ chmod +x manage.py
```

```bash
$ cd my_prj
$ ./manage.py startapp app
```

### 安装South

```bash
$ pip install south
```

### setttings.py 修改
将south加入到 ``INSTALLED_APP``中。

同步数据库

```bash
./manage.py syncdb
```

```python

DATABASES = {
    'default': {
        'ENGINE': 'django.db.backends.sqlite3', # Add 'postgresql_psycopg2', 'postgresql', 'mysql', 'sqlite3' or 'oracle'.
        'NAME': 'test.db',                      # Or path to database file if using sqlite3.
        'USER': '',                      # Not used with sqlite3.
        'PASSWORD': '',                  # Not used with sqlite3.
        'HOST': '',                      # Set to empty string for localhost. Not used with sqlite3.
        'PORT': '',                      # Set to empty string for default. Not used with sqlite3.
    }
}
```

### 创建app的数据模型

```python
# filename: app/models.py

from django.db import models

class Blog(models.Model):
    title = models.CharField(max_length=255)

    def __unicode__(self):
        return self.title

```

将 ``app`` 安装到 ``INSTALLED_APP``中。


```bash

(my_app)[wyatt@localhost my_prj]$ ./manage.py schemamigration app --initial
Creating migrations directory at '/home/wyatt/git/my_app/my_prj/app/migrations'...
Creating __init__.py in '/home/wyatt/git/my_app/my_prj/app/migrations'...
 + Added model app.Blog
Created 0001_initial.py. You can now apply this migration with: ./manage.py migrate app

```

创建应用的数据表

```bash
(my_app)[wyatt@localhost my_prj]$ ./manage.py migrate app
Running migrations for app:
 - Migrating forwards to 0001_initial.
 > app:0001_initial
 - Loading initial data for app.
No fixtures found.
```

修改models.py，添加一个content字段：

```python
    content = models.TextField()
```

再执行：

```bash

(my_app)[wyatt@localhost my_prj]$ ./manage.py schemamigration app --auto
 ? The field 'Blog.content' does not have a default specified, yet is NOT NULL.
 ? Since you are adding this field, you MUST specify a default
 ? value to use for existing rows. Would you like to:
 ?  1. Quit now, and add a default to the field in models.py
 ?  2. Specify a one-off value to use for existing columns now
 ? Please select a choice: 1

```

字段非空

将 ``models.py`` 修改下：

```python
    content = models.TextField(blank=True)
```

```bash
(my_app)[wyatt@localhost my_prj]$ ./manage.py schemamigration app --auto
 + Added field content on app.Blog
Created 0002_auto__add_field_blog_content.py. You can now apply this migration with: ./manage.py migrate app
```

将更改应用到数据表中

```bash
(my_app)[wyatt@localhost my_prj]$ ./manage.py migrate app
Running migrations for app:
 - Migrating forwards to 0002_auto__add_field_blog_content.
 > app:0002_auto__add_field_blog_content
 - Loading initial data for app.
No fixtures found.
```

参考：

<http://pressedweb.com/tutorials/django-djourney-introduction-to-south/>