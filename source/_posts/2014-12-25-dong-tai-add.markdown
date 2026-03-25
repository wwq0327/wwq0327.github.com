---
layout: post
title:  UIKit 让程序自动添加组件
description:
keywords: uikit, swift
---

开始一点点的了解UIKit，知着了在进行App界面布局的时候，可以使用Stroyboard将组件拖入，设置上相关的属性即可。Stroyboard本来是一些XML代码，而iOS在运行时，就是读取这个文件的内容，然后生成相应的界面的。即然这样，也就能下在.swift中编写相应的代码来实现界面了。

我将这当件是一件学习UIKit的方式，通过代码来设置相应组件的属性及如何组织加载他们。

打开Xcode，选择`File / New / Project ...`然后再选择`iOS Application /Single View Application`并且命名为`LabelDemo`。打开`ViewController.swift`，在`viewDidLoad`方法中添加上如下代码：

```
// 创建一个square组件
let square = UIView(frame: CGRect(x: 50, y: 80, width: 200, height: 200))
// 设置背影色
square.backgroundColor = UIColor.grayColor()
// 将组件添加到视图列表的最后一个位置上
view.addSubview(square)
```
 
基本操作方式，就是：

- 创建一个组件，如这是里的UIView
- 设置属性，如大小，颜色，等
- 将组件添加到相应的容器列表中去

一切OK后，运行一下，如下图所示：

![image](http://ww1.sinaimg.cn/large/603daed6gw1enlowvs2bwj20c00h2dg4.jpg)

由于我这里创建的是一个UIView，我的理解仍可以将其作一个容器，再向里面添加新的内容，这里我们再创建一个UILabel组件。接着刚才所写的代码，我们编写如下代码：

```
// 创建个UILabel组件
let label1 = UILabel(frame: CGRect(x: 20, y: 20, width: 100, height: 40))
// 设置背影色，文字内容，对齐方式，字体颜色
label1.backgroundColor = UIColor.redColor()
label1.text = "hello, world"
label1.textAlignment = NSTextAlignment.Center
label1.textColor = UIColor.whiteColor()

// 将label1添加到square视图中
square.addSubview(label1)
```

操作方式类似。每个组件所含的属性不一样，由于Xcode有很好的自动补全功能，找属性的时候还是很方便的。然后我们运行一下，可以看到如下内容：

![image](http://ww1.sinaimg.cn/large/603daed6gw1enloyolq6nj20c00h2wew.jpg)

至于何时能用到这些功能，我也不清楚，先了解到这里。