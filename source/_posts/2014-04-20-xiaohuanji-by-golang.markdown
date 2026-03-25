---
layout: post
title: 用Golang调用小黄鸡
description: 小黄鸡，人机对答类的应用，挺暴力的一个工具，看有人用PHP调用这个小应用并放到了微信里面，觉得有点意思，就用Golang写一段代码，在终端下调用。
keywords: Golang
---

小黄鸡，人机对答类的应用，挺暴力的一个工具，看有人用PHP调用这个小应用并放到了微信里面，觉得有点意思，就用Golang写一段代码，在终端下调用。

小黄鸡是使用<http://www.xiaohuangji.com/ajax.php>进行交互的，发送请求，返回应答，如图：

![](http://ww1.sinaimg.cn/large/603daed6gw1efmdnzfsyij20l40arjso.jpg)

红色部份就是你所发起的请求：

![](http://ww4.sinaimg.cn/large/603daed6gw1efmdoaior0j20l4078dgr.jpg)

请求的内容，参数为`para`，如请求的`你好`。

![](http://ww2.sinaimg.cn/large/603daed6gw1efmdojwptxj20l40a5gml.jpg)

对应的服务器的响应信息。

明白了这个之后，下面的事就是如何使用Golang进行请求，然后再接收服务器的响应信息。这里我们需要使用`func (c *Client) PostForm(url string, data url.Values) (resp *Response, err error)`这个函数来进行操作。

里面的data需要处理一下。对于`data`，它是一个map，设置的话，是这样的：

```
url.Values{"key": {"Value"}, "id": {"123"}}
```

写好这个内容之后，然后就是不停的循环这个过程了。代码如下：

```golang
package main

import (
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
	"strings"
)

const (
	URL = "http://www.xiaohuangji.com/ajax.php"
)

func main() {
	var input string
	for {
		fmt.Print("我说： ")
		fmt.Scanf("%s", &input)
		if input == "q" {
			os.Exit(1)
		} else {
			fmt.Printf("小黄说： %s\n", XiaoHuangJi(input))
			fmt.Println(strings.Repeat("-", 40))
		}
	}
}

func XiaoHuangJi(input string) string {
	data := url.Values{}
	data.Set("para", input)
	resp, err := http.PostForm(URL, data)
	if err != nil {
		log.Fatal("读取不出来，出问题啦！")
	}

	if resp != nil && resp.Body != nil {
		defer resp.Body.Close()
		output, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			log.Fatal("数据读不出来呀！")
		}

		return string(output)
	}
	return ""
}
```

使用了`fmt.Sanf()`来进行数据的读取，如果遇到`q`则停止这个循环。