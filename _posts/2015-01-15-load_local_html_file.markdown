---
layout: post
title: UIWebView载入本地HTML文档
description:
keywords: UIKit
---
昨天在学习《iOS Apprentice》这本书的第一个App 示例的时候，在写到制作About界面的时候，中有有一个关于载入本地Html文件的例子。HTML里面自订义样式的功能是很强大的，相比于直接用storyboard来制作界面的话，这个方法就灵活得多了。前面研究过使用UIWebView去访问HTTP资源，而这个功能也很酷。

## 过程

1. 新建一个项目，名为“HTMLDemo”，拖入一个WebView组件，调整好位置，用来显示HTML内容。
2. 指定WebView的名称为"webView"，`'@IBOutlet weak var webView: UIWebView!`。
3. 在项目目录中导入一个准备好的HTML文档，当然，也可以就在项目中创建一个这样的文件。如我命令为“about.html”。
4. 打开“ViewController.swif”文件，在`override func viewDidLoad`中添加如下代码：

```
        // 载入HTML文件
        if let aboutHtml = NSBundle.mainBundle().pathForResource("about", ofType: "html") {
            // 获了文件内容
            let htmlData = NSData(contentsOfFile: aboutHtml)
            // 获到资源的主目录
            let baseURL = NSURL.fileURLWithPath(NSBundle.mainBundle().bundlePath)
            webView.loadData(htmlData, MIMEType: "text/html", textEncodingName: "UTF-8", baseURL: baseURL)
        }
        ```

一切停当之后，Cmd+R，就可以看到内容了：

![image](http://ww1.sinaimg.cn/large/603daed6gw1eo9zzuzm45j20c00jiq3e.jpg)        

我也在想，如果也能按这种方法，直接载入markdown文档就更好了。
