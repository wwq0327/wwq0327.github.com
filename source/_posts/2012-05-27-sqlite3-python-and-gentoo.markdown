---
layout: post
title: "Gentoo 安装python2.7对应版本的sqlite3"
---
在Gentoo中使用sqlite3的python模块会出现“模块不存在”的错误，想正常使用这个模块，需要做下面的工作。

首先安装sqlite3数据库程序：

``` bash
emerge sqlite
```

由于是使用的是python2.7，所以需要将python3.*相关的模块关掉，可以这样做：
```bash
echo '>=dev-lang/python-3.1.2-r3' >> /etc/portage/package.mask
```

同时改变下``package.usr``

```bash
echo '=dev-lang/python-2* sqlite' >> /etc/portage/package.use
```

这些工作完成之后，需要重新编译下python2.7:

```
emerge python
```

Gentoo中我自己觉得比较爽一点的是可以方便的进行各类服务的版本切换，比如你可以选择你所需要的python版本：

``` bash
eselect python list # 显示python 版本
Available Python interpreters:
  [1]   python2.7 * # 带星号的即为你现在所选择中的版本
  [2]   python3.2
```

如果你想切换到python3.2，则可使用下面命令进行切换：
```bash
eselect python set 2
```

