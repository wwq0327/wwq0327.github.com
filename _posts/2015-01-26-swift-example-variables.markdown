---
layout: post
title: Swift by Example - 变量
description:
keywords:
---
上一节我们介绍了Swift的数据类型，这节我们学习下Swift的变量。

变量的声明，就是在标识符的前面使加上`var`关键字。

```
// 指定类型
var lang: String = "Swift"
var age: Int = 30
var a: Float = 2.0
var bool: Bool = true

println("String: \(lang), Int: \(age), Float: \(a), Bool: \(bool)")


// 不指定类型 
var name = "Swift"
var num = 19
var d = 7.0
var b = false

println("String: \(name), Int: \(num), Float: \(d), Bool: \(b)")


// 一行中声明多个变量
var x = 0, y = 0.0, z = 0
println("\(x), \(y), \(z)")
```

输出：

```
$ swift variables.swift
String: Swift, Int: 30, Float: 2.0, Bool: true
String: Swift, Int: 19, Float: 7.0, Bool: false
0, 0.0, 0
```

两种变量的声明方式，第一种方式指定了变量的类型，而第二种方式是根据值进行推导。