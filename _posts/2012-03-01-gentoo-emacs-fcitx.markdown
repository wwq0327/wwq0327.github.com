---
layout: post
title: "搞定Emacs 下的 fcitx 中文输入"
---
终于搞定了emacs下的fcitx中文输入，一个大问题解决掉了，至于如何安装成功的，我自己也说不清楚了，修过的地方有``xorg.conf``，还安装了新的字体，font-adobe-100dpi还font-adobe-75dpi，新在HOME中，新建了一个``.profile``文件，内容：

```bash
export LC_ALL="zh_CN.UTF-8"
```
如果这句起了作用的话，我就有些不明白了，我在``locale.gen``中是设置了这一项的，而自己的locale显示是这样的：

```bash
LANG=zh_CN.UTF-8
LC_CTYPE="zh_CN.UTF-8"
LC_NUMERIC="zh_CN.UTF-8"
LC_TIME="zh_CN.UTF-8"
LC_COLLATE="zh_CN.UTF-8"
LC_MONETARY="zh_CN.UTF-8"
LC_MESSAGES="zh_CN.UTF-8"
LC_PAPER="zh_CN.UTF-8"
LC_NAME="zh_CN.UTF-8"
LC_ADDRESS="zh_CN.UTF-8"
LC_TELEPHONE="zh_CN.UTF-8"
LC_MEASUREMENT="zh_CN.UTF-8"
LC_IDENTIFICATION="zh_CN.UTF-8"
LC_ALL=zh_CN.UTF-8
```

安装完这些后，重启动了一次，然后一切就OK了。另外发现扩展包不是自己所需要的那么多，我平时是将emacs插件放到``.emacs.d``这个目录中的，在github.com创建了一个专门用来存放自己配置文件的仓库，有修改就同步一次，然后push到github，省得到处找插件。

最后一个问题，gentoo双显。打算先将gnome升级到gnome3去，看看能不能搞定这个问题。
