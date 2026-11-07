---
id: swift-example-values
title: Swift by Example - 数据类型
type: article
author: wanqing
summary: Swift 的数据类型包含：整型、浮点型、布尔型、字符串型、元组、集合、枚举、结构体和类等。基本使用方法如下： 字符串类型可以使用 + 进行连接。
language: zh
visibility: public
featured: false
dates:
  authored: 2015-01-26
  published: 2015-01-26
  updated: null
originalUrl: https://wwq0327.github.io/2015-01-26/swift-example-values/
legacyPath: /2015-01-26/swift-example-values/
platform: 本站
topics: []
relatedProjectIds: []
sourceIds:
  - legacy-blog
media: null
---

Swift 的数据类型包含：整型、浮点型、布尔型、字符串型、元组、集合、枚举、结构体和类等。基本使用方法如下：

```
println("swift" + "!")         
println("1+1 = \(1+1)")
println(2.0/7.0)
println(true)
println(!true)
```

字符串类型可以使用`+`进行连接。

输出结果：
```
$ swift values.swift
swift!
1+1 = 2
0.285714285714286
true
false
```

在`println`进行输出的时候，我们使用了`\(name)`这种语法，如果我们有个变量名为`name`，我们就可以通过这种方式将变量的值插入到字符串中，这种方式称为`字符串插值 (String Interpolation)`
