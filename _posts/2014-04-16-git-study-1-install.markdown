---
layout: post
title: git安装
description: git是一个很棒的工具，不仅限于编码，其实只要你是一个文字爱好者，爱写写东西记记事，或是喜欢分享一些东西，那么git就一定适合于你。
keywords: git
---
git是一个开源的分布式版本管理控制系统，用以有效、高速的处理从很小到非常大的项目版本管理。Git 是 Linux Torvalds 为了帮助管理 Linux 内核开发而开发的一个开放源码的版本控制软件。这个工具就是为Linux所生，因而在Linux或是Mac上，使用起来和一般的命令行工具没有什么区别。系统本身不带这个工具，如果需要使用，都需要进行安装。

可能在许多人的眼中，git只是一个属于程序员的程序，但当你真正使用起来之后，你会发现，它对于每个使用电脑来进行工作或是创作的人来说，都是适用的。

## Linux 上安装git

Linux上，常见的版本，如Debian/Ubuntu类的，使用的deb包，而在Fedora/centos上，则是rpm包，但安装都大同小异，使用相应的安装命令进行安装即可。

### Debian/Ubuntu上安装

`sudo apt-get install git`

或

`sudo yum install git`

通过上面的两个今天安装即可。

## Mac OS上安装git

在Mac OS安装git，需先安装一个名为`Homebrew`的工具，这个工具是Mac上的一个软件包管理软件，类似于Debian的`apt-get`类的工具，使用之前需要先安装，在终端上运行：

`ruby -e "$(curl -fsSL https://raw.github.com/Homebrew/homebrew/go/install)"`

成功之后，可以测试一下：

	wyattdeMacBook-Pro:wwq0327 wyatt$ brew -v
	Homebrew 0.9.5

然后再使用`brew install git`进行下载安装即可。

## Windows上安装git

### 下载`msysgit`

下载地址：<http://msysgit.github.io>，点击`Download`进行下载即可。如你不能打开这个页面，也可以直接点击下面的链接进行下载：

<https://code.google.com/p/msysgit/downloads/detail?name=Git-1.9.0-preview20140217.exe&can=1&q=>

### 安装及设置

双击刚刚下载好的安装程序进行安装即可。默认情况下，程序是安装到`C:\Program files\Git`目录中的，当然你可以修改一下，比如改到`C:\Git`目录中。

安装的时候，注意选择上相应的选项：

![](http://ww3.sinaimg.cn/large/603daed6gw1efhrkkc3dwj20n20ht41i.jpg)

![](http://ww1.sinaimg.cn/large/603daed6gw1efhrl6ec4nj20n20hxq69.jpg)

![](http://ww1.sinaimg.cn/large/603daed6gw1efhrluucn1j20n20hwwhv.jpg)

安装完成之后，桌面上会多一个`Git Bash`图标，这是一个git的终端命令程序，打开之后会有一个类似于Windows 命令行窗口：

![](http://ww1.sinaimg.cn/large/603daed6gw1efhrmfcq34j20n20de0tt.jpg)

到这里，你的git就安装成功了！

需要说明的是，这个窗口支持Linux的命令，常用的，如:

- `ls`：查看当前目录下的文件及文件夹
- `cd 目录名称`: 进行某个目录
- `cd ..`：退出当前目录
- `mkdir 目录名称`：创建一个目录

如果你想了解更多的Linux命令行或一些常用的命令，请看这里：

<http://wiki.ubuntu.org.cn/%E5%91%BD%E4%BB%A4%E8%A1%8C%E6%8C%87%E5%8D%97>

## 检查是否安装成功

安装完成之后，可以测试一下：

	wyattdeMacBook-Pro:wwq0327 wyatt$ git --version
	git version 1.8.5.2 (Apple Git-48)

上面是我在Mac下的测试情况。到这里，你就将git安装到你的系统上了。

## 关于Git使用的教程

通过上面的学习，我想你已在你的电脑上安装上Git了，在进入下一步之前，你可许需要一些资料了解一下Git或是基本使用方法，那么，你可以看看这些内容：

- 《pro git中文版》：<http://iissnan.com/progit/>，最全面的git教程
- 《沉浸式学 Git》：<http://igit.linuxtoy.org/>，一本开源的git小书
- 《git教程》: <http://www.liaoxuefeng.com/wiki/0013739516305929606dd18361248578c67b8067c8c017b000>
- github准备的一个git在线学习教程：<http://try.github.io/>

** 欢迎你进入到Git的世界 **