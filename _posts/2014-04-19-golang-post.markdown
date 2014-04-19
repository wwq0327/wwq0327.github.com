---
layout: post
title: 使用Golang做的一个自动生成文件的代码
description: 一个小工具，自动生成一个jekyll文件的小脚本。
keywords: golang
---
jekyll本来自带了一个自动生成文章的代码的，但不知道什么原因，我在使用的时候老是出错，由于自己对ruby不知道如何弄，所以就自己使用golang写了一个小脚本，读取系统日期，生成一个只含表头的`.markdown`文件，这样就省得自己每次写内容的时候，非得使用手动的方式来创建文件了，代码是这样的：

```golang
package main

import (
	"fmt"
	"log"
	"os"
	"path/filepath"
	"time"
)

const (
	OUTPUT  = "./_posts"
	CONTENT = `---
layout: post
title:
description:
keywords:
---
`
)

func main() {
	if len(os.Args) != 2 {
		fmt.Printf("Usage: %s <post title>\n", os.Args[0])
		os.Exit(1)
	}

	title := os.Args[1]
	pn := PostName(title)
	WriteToFile(pn)
}

func PostName(title string) string {
	t := time.Now().Format("2006-01-02")
	fileName := t + "-" + title
	return fileName
}

func WriteToFile(fileName string) {
	fp := filepath.Join(OUTPUT, fileName)
	fp += ".markdown"
	f, err := os.Create(fp)
	defer f.Close()
	if err != nil {
		log.Fatal("文件打开错误！")
	}

	f.WriteString(CONTENT)

	fmt.Printf("文件位置：%s\n", fp)

}
```

内容很简单，但最算能用了。
