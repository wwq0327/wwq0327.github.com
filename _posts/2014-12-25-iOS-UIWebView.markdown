---
layout: post
title: UIWebView 做一个简易浏览工具
description: 
keywords: UIWebView
---
Web内容非常丰富，在进行iOS开发时，可以直接读到Web上的资源并展示在iOS设备上。我们可以使用UIWebView这个组件来实现这个功能。

## 创建一个新的Demo
打开Xcode，选择`File / New / Project ...`然后再选择`iOS Application /Single View Application`并且命名为`WebDemo`。

## 添加WebView
打开"Main.storyboard"，找到"Web View"拖到storyboard上，接着我们再给这个Web View添加上一个Outlets 链接，名称为`webContent`，相当于在`ViewController.swift`中添加上了这样一段代码：

```
@IBOutlet weak var webContent: UIWebView!
```

## 载入网页内容并展示

打开`ViewController.swift`，在`viewDidLoad`方法中添加上如下代码：

```
var url: NSURL = NSURL(string: "http://www.baidu.com")!
var request = NSURLRequest(URL: url)
webContent.loadRequet(request)
```

这时再运行一下，就能直接看到网页内容了。

这里我们是直接指定的URL，我们也可以再修改一下，添加上一个Text Field，通过输入的URL进行相应的展示。

## 添加Text Field并设置相关属性
在storyboard中添加上一个Text Field，扩展到整个屏大小。并设置一些属性：

- `Placeholder` 添加上“输入网址”的提示。
- `Clear Button` 设置为`Apears while editing`选项，这样在输入的时候，会出现一个清除所有内容的小叉。
- `Keyboard Type` 设置为`URL`。
- `Return Key` 设置为`Go`。

整个界面像这样：

![image](http://ww4.sinaimg.cn/large/603daed6gw1enm33hjrvxj209e0h8jrj.jpg)

## 添加连接
为这个Text Field指定名称及方法。

```
@IBOutlet weak var urlField: UITextField!

@IBAction func didUrlExit(sender: UITextField) { }
```

然后，我们需要先将原来添加到`viewDidLoad`中的代码删除掉，把相应的代码添加到`didUrlExit`中去，代码如下：

```
@IBAction func didUrlExit(sender: UITextField) {
    sender.resignFirstResponder()
    var url: NSURL = NSURL(string: urlField.text)!
    var request = NSURLRequest(URL: url)
    
    webContent.loadRequest(request)
}
```

所有事件都添加上后是这样的：

![image](http://ww3.sinaimg.cn/large/603daed6gw1enm34ovi6lj207609ct9j.jpg)

操作和最开始的方法一样，只是将URL换成了从Text Field中读取。这样，就可以输入网址，回车点击“Go”即可浏览到相应的内容 了，这是最终效果：

![image](http://ww3.sinaimg.cn/large/603daed6gw1enm35sh438j20dj0m9gnh.jpg)

使用起来很方便，方法也很直接，浏览效果也很赞。




