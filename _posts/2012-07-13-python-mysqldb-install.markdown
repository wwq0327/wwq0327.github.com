---
layout: post
title: "python-mysqldb install"
date: 2012-07-13 20:48
comments: true
categories: [python, python-mysqldb, mysqldb] 
---
在安装``python-mysqldb``出现下面的错误提示：

```
Downloading/unpacking MySQL-python==1.2.3 (from -r requirements/prj.txt (line 2))
  Running setup.py egg_info for package MySQL-python
    sh: 1: mysql_config: not found
    Traceback (most recent call last):
      File "<string>", line 14, in <module>
      File "/home/wyatt/car/build/MySQL-python/setup.py", line 15, in <module>
        metadata, options = get_config()
      File "setup_posix.py", line 43, in get_config
        libs = mysql_config("libs_r")
      File "setup_posix.py", line 24, in mysql_config
        raise EnvironmentError("%s not found" % (mysql_config.path,))
    EnvironmentError: mysql_config not found
    Complete output from command python setup.py egg_info:
    sh: 1: mysql_config: not found

Traceback (most recent call last):

  File "<string>", line 14, in <module>

  File "/home/wyatt/car/build/MySQL-python/setup.py", line 15, in <module>

    metadata, options = get_config()

  File "setup_posix.py", line 43, in get_config

    libs = mysql_config("libs_r")

  File "setup_posix.py", line 24, in mysql_config

    raise EnvironmentError("%s not found" % (mysql_config.path,))

EnvironmentError: mysql_config not found
```

除了安装上``mysql-server``之外，还需要安装:

- ubuntu

```
sudo apt-get install libmysqld-dev
```

- fedora

```
sudo yum install mysql-devel
sudo yum install python-devel
```

然后问题搞定。


