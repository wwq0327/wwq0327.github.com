---
layout: post
title:  UIWebView加载HTML及其样式文件
description:
keywords:
---

Demo地址： <https://github.com/wwq0327/iOS8Example/tree/master/LoadHTMLDemo>


感觉在TextView或是在WebView中设置文字的样式功能都是比较有限的，有时我们会需要直接加载一些介绍性的文本内容，而使用HTML+CSS是个不错的选择。

下面这个Demo就是来演示这样的一个过程。先建一个`Single View Application`，就名为`LoadHTMLDemo`了。

在`Main.Storyboard`中拖入一个`Web View`，做好约束，如图所示：

![image](http://ww4.sinaimg.cn/large/603daed6gw1es0n2q4mejj20la0kkwev.jpg)

点击`UIWebView`，然后Ctrl+Drag到`ViewController.swift`中，创建一个outlet，名称为`webView`。

界面及关联上就做如下工作即OK了。下面就是具体的编码工作了。

## 创建一个HTML文件 

在项目中新创建一个名为`index.html`的文件，然后写些简单的内容进去，如这样：

```
<!DOCTYPE html>
<html>
    <head>
    </head>
    <body>
        <h1>hello, world!</h1>
    </body>
</html>
```

只是用粗体显示出`hello, world!`这句话即可。

## WebView加截HTML
将HTML文件加载到WebView中，我们分三步处理：

- 第一步，找到文件所在的完整路径。
- 第二步，将文件内容转换成NSData
- 第三步，加载到组件。

在iOS中，App所使用的资源，如图片，视频，音频等存在一个称为应用包（Application Bundle）的包中。为了访问应用中的这些资源，iOS为我们提供 了NSBundle这个类。

如果需要使用`index.html`这个文件，我们只需这样做即可：

```
let htmlFile = NSBundle.mainBundle().pathForResource("index", ofType: "html")
```
如果我们打印一下的话，就可以看到这样的信息：

```
/Users/wyatt/Library/Developer/CoreSimulator/Devices/EB14C520-FAE8-4E1F-97C8-64811B6D5519/data/Containers/Bundle/Application/C066462E-2990-400D-8FB3-8AB40680EB1E/LoadHTMLDemo.app/index.html
```

加载到webView中，在`viewDidLoad`中添加如下代码：

```
        if let htmlFile = NSBundle.mainBundle().pathForResource("index", ofType: "html") {
            println(htmlFile)
            let htmlData = NSData(contentsOfFile: htmlFile)
            webView.loadData(htmlData, MIMEType: "text/html", textEncodingName: "UTF-8", baseURL: nil)
        }
```

跑起来，即这样：

![image](http://ww1.sinaimg.cn/large/603daed6gw1es0nk9rqwcj20r218iabz.jpg)

哈哈，加载上了。

## 加载CSS样式文件

我们在项目中新建一个简单的CSS文件，名为`style.css`，对`h1`元素中的`hello, world!`作点字号及颜色的修改。

```

h1 {
    font-size: 18px;
    color: red;
}
```

然后需要在`index.html`的`head`中添加上这句：

```
<link href="style.css" rel="stylesheet">
```

如果我们是在应用之外使用浏览器打开index.html文件的话，我们是会看到这样的效果的：

![image](http://ww1.sinaimg.cn/large/603daed6gw1es0nr38zhpj20y80j8myk.jpg)

但我们在iOS里面再跑下程序时，所看到的却和最开始一样的，仍然是个黑色的句子放在那里，似乎样式文件并没有加载上。

我们发现`loadData`这个方法的`baseURL`参数设置的为`nil`，其实这个参数就相当于接定应用的根目录一样，于是我们新加一个变量，最后代码写成了这样：

```
        if let htmlFile = NSBundle.mainBundle().pathForResource("index", ofType: "html") {
            let htmlData = NSData(contentsOfFile: htmlFile)
            let baseURL = NSURL.fileURLWithPath(NSBundle.mainBundle().bundlePath)
            webView.loadData(htmlData, MIMEType: "text/html", textEncodingName: "UTF-8", baseURL: baseURL)
        }
```

如果打印下`baseURL`的话，我们看到的内容是这样的：

```
file:///Users/wyatt/Library/Developer/CoreSimulator/Devices/EB14C520-FAE8-4E1F-97C8-64811B6D5519/data/Containers/Bundle/Application/B6E2A525-24A8-4D85-85B0-C2F674D141A7/LoadHTMLDemo.app/
```

一个HTTP的文件访问路径，这里再加载CSS文件里，就需接以些路径为根路径进行加载，这样的话，就能找以我们所设置好的文件了。

最终效果：

![image](http://ww2.sinaimg.cn/large/603daed6gw1es0nznbt42j20go0q0t9f.jpg)


