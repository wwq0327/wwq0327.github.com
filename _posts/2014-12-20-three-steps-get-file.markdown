---
layout: post
title: Swift HTTP 请求：三步下载一个网络文件
description: 使用Swift中的网络模块，进行HTTP请求。
keywords: swift
---
随着学习的深入，发现Swift语法完成之后，就需要学习一下相关的库文件了。以前学习Python的时候，觉得HTTP请求挺有意思的，可以使用代码，直接将网络上的内容下载到本地来。这就是所谓的HTTP请求了。

使用Swift，三岁就可以完成这样一相操作，将网络上的内容下载到本地。

## 创建URL对象

首先需要初始化一个`NSURL`对象，这里我们以读取百度首页为例：

```
let url = NSURL(string: "http://www.baidu.com")
```

## 创建请求

使用`NSURLRequest`来创建一个关于url的Request：

```
var request = NSURLRequest(URL: url!)
```

## 连接请求

使用`NSURLConnection`进行请求：

```
var data = NSURLConnection.sendSynchronousRequest(request, returningResponse: nil, error: nil)
```

到这里，我们就拿到了百度首面的HTML代码了，下一步即可将取得的数据写入一个本地文件即可，如这样：

```
data!.writeToFile("/Users/wyatt/tmp/file1.txt", atomically: true)
```

如果所图：

![image](http://ww3.sinaimg.cn/large/603daed6gw1engh3e39w4j20i10c1n1x.jpg)

我们也注意到，在`sendSynchronousRequest`这个类方法中，第二，三参数都设置为`nil`，可以这样设置他们的值，而拿到请求时的相关信息，如这样：

```
import Foundation

let url = NSURL(string: "http://www.baidu.com")
var request = NSURLRequest(URL: url!)
var response: NSURLResponse?
var error: NSError?
var data = NSURLConnection.sendSynchronousRequest(request, returningResponse: &response, error: &error)
println("\(response) -> \(error)")

data!.writeToFile("/Users/wyatt/tmp/file1.txt", atomically: true)
```

再进行请求时，会将响应信息存到response和error之中，我们可以信息打印出来:

```
$ swift net1.swift
Optional(<NSHTTPURLResponse: 0x7f96406ebe00> { URL: http://www.baidu.com/ } { status code: 200, headers {
    BDPAGETYPE = 2;
    BDQID = 0xbe9ae31a00006263;
    BDUSERID = 87651342;
    "Cache-Control" = private;
    Connection = "Keep-Alive";
    "Content-Encoding" = gzip;
    "Content-Type" = "text/html";
    Date = "Sat, 20 Dec 2014 13:41:21 GMT";
    Expires = "Sat, 20 Dec 2014 13:41:21 GMT";
    Server = "BWS/1.1";
    "Set-Cookie" = "BDSVRTM=107; path=/, BD_HOME=1; path=/, H_PS_PSSID=7736_1429_10571_10439_10503_10501_10497_10647_10051_10459_10065_10219_10687_10045_10355_10667_10597_10096_10657_10443_10699_10460_10403_10360_10626; path=/; domain=.baidu.com";
    "Transfer-Encoding" = Identity;
} }) -> nil
```

最后，为了防止访问失败或是链接不存在时，不至于也进行文件的写入，我们可以再进行处理：

```
import Foundation

let url = NSURL(string: "http://www.baidu.com/")
var request = NSURLRequest(URL: url!)
var response: NSURLResponse?
var error: NSError?
var data = NSURLConnection.sendSynchronousRequest(request, returningResponse: &response, error: &error)
println("\(response) -> \(error)")

var httpStatus = response as NSHTTPURLResponse

if httpStatus.statusCode == 200 {
    data!.writeToFile("/Users/wyatt/tmp/file1.txt", atomically: true)
} else {
    println("下载失败")
}
```

至止，我们就写好了一个简单的可以进行HTTP资源获取的程序了。

在使用Xcode编写代码的时候，发现`NSURL`、`NSURLRequest`等还有许多的可以使用的方法，应该是一个很强的HTTP类库吧，需要进一步的学习。

