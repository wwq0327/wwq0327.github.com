---
layout: post
title: Golang time模块初学
description:
keywords: golang, time
---
Go的time包提供一些关于时间的计算及显示输入的功能，也提供了一些如时间显示的基本格式的常量等。下面所记录的是我自己所能理解的一些内容。

## 关于时间格式常量
time包提供了一些输出常：

```
const (
    ANSIC       = "Mon Jan _2 15:04:05 2006"
    UnixDate    = "Mon Jan _2 15:04:05 MST 2006"
    RubyDate    = "Mon Jan 02 15:04:05 -0700 2006"
    RFC822      = "02 Jan 06 15:04 MST"
    RFC822Z     = "02 Jan 06 15:04 -0700" // RFC822 with numeric zone
    RFC850      = "Monday, 02-Jan-06 15:04:05 MST"
    RFC1123     = "Mon, 02 Jan 2006 15:04:05 MST"
    RFC1123Z    = "Mon, 02 Jan 2006 15:04:05 -0700" // RFC1123 with numeric zone
    RFC3339     = "2006-01-02T15:04:05Z07:00"
    RFC3339Nano = "2006-01-02T15:04:05.999999999Z07:00"
    Kitchen     = "3:04PM"
    // Handy time stamps.
    Stamp      = "Jan _2 15:04:05"
    StampMilli = "Jan _2 15:04:05.000"
    StampMicro = "Jan _2 15:04:05.000000"
    StampNano  = "Jan _2 15:04:05.000000000"
)
```

其实就是一些常量字符串。我们在进行日期输入的时候，就可以指定输出格式进行日期的显示了。

如:

```
t := time.Now()
fmt.Println(t)
fmt.Println(t.Format(time.ANSIC))

// output:
// 2015-01-02 10:44:16.677396173 +0800 CST
// Fri Jan  2 10:44:16 2015
```

那如果我们要自定义一个输出格式又行不行呢，答案是肯定的。只是我们在进行自定义的时候，需要按照那些默认的字符串值进行设置。关于年，月，日， 时，分， 秒，我们发现下面的规律：

```
年：2006
月：01
日：02
时：15 (24小时制)
分：04
秒：05
```

清楚这个格式之后，我们就可以按自己的需要进行自定义时间格式的输入了。如：

```
const (
    layout          = "2006-01-02 15:04:05"
)

// 按给定的格式输出日期
fmt.Println(now.Format(layout))
```

## 时间的计算

时间的计算方面，主要是指加时间，减时间之类的。三个函数：

```
加上一个时间：func (t Time) Add(d Duration) Time 
加上一个几年几月几日：func (t Time) AddDate(years int, months int, days int) Time
当前时间与时间u的差：func (t Time) Sub(u Time) Duration
time.Now().sub(t)的简写版：func Since(t Time) Duration
```

具体用法，我看们看下面的代码：

```
package main

import (
	"fmt"
	"time"
)

func main() {
	now := time.Now()

	// 打印当前时间
	fmt.Println("Now:", now)
	// 加上相应的时，分，秒
	fmt.Println("after 3 hours ", now.Add(3*time.Hour))
	fmt.Println("after 3 minutes ", now.Add(30*time.Minute))
	fmt.Println("after 3 seconds ", now.Add(30*time.Second))

	// 加上（或减去）年，月，日
	fmt.Println("加上一年", now.AddDate(1, 0, 0))
	fmt.Println("减去一年 AddDate(-1, 0, 0)", now.AddDate(-1, 0, 0))

	// 自定义日期输入格式
	const (
		layout          = "2006-01-02 15:04:05"
		birthday_layout = "2006-01-02"
	)

	// 按给定的格式输出日期
	fmt.Println(now.Format(layout))
	fmt.Println(now.Format(time.ANSIC))

	// 按给定的格式对字符串日期进行分析
	born := "1980-01-08"

	t1, _ := time.Parse(birthday_layout, born)
	fmt.Println(t1)

	// t1 距当前时间所差的时分秒
	sub := time.Since(t1)
	hour := sub.Hours()
	fmt.Printf("Days: %.2f\n", hour/24.0)
// output	
// $ go run t_add.go
// Now: 2015-01-02 11:03:24.169930555 +0800 CST
// after 3 hours  2015-01-02 14:03:24.169930555 +0800 CST
// after 3 minutes  2015-01-02 11:33:24.169930555 +0800 CST
// after 3 seconds  2015-01-02 11:03:54.169930555 +0800 CST
// 加上一年 2016-01-02 11:03:24.169930555 +0800 CST
// 减去一年 AddDate(-1, 0, 0) 2014-01-02 11:03:24.169930555 +0800 CST
// 2015-01-02 11:03:24
// Fri Jan  2 11:03:24 2015
// 1980-01-08 00:00:00 +0000 UTC
// Days: 12778.13	

}

```

其它的关于时间的操作函数还有很多，只是感觉就这些，应该算是入门了，使用起来应该差不多够了吧，也没去深究了，当这些解决不了问题的时候，再去看列表，再学习吧。