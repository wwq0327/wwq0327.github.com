---
id: swift-by-example-constants
title: Swift by Example - 常量
type: article
author: 万青
summary: 常量的声明与变量类似，只是使用了 let 这个关键词。常最声明后，其值不能被修改，如果尝试修改，便会报错。 输出：
language: zh
visibility: public
featured: false
dates:
  authored: 2015-01-26
  published: 2015-01-26
  updated: null
originalUrl: https://wwq0327.github.io/2015-01-26/swift-by-example-constants/
legacyPath: /2015-01-26/swift-by-example-constants/
platform: 旧博客
topics: []
relatedProjectIds: []
sourceIds:
  - legacy-blog
media: null
---

常量的声明与变量类似，只是使用了`let`这个关键词。常最声明后，其值不能被修改，如果尝试修改，便会报错。

```
let pi: Float = 3.14
let lang = "Swift"

println("PI: \(pi), Language: \(lang)")
```

输出：

```
$ swift constants.swift
PI: 3.14, Language: Swift
```
