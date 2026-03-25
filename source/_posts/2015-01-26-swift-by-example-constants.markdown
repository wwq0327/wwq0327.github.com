---
layout: post
title: Swift by Example - 常量
description:
keywords:
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


