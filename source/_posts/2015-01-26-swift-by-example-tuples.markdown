---
layout: post
title: Swift by Example - 元组
description:
keywords:
---
Swift的元组（Tuple）是将多个值组合成一个复合值，便于计算和管理。元组内的值可以为任意类型，各字段值的类型不必相相同。

定义元组时，可以直接将值放到一起组成一个元组，也可以使用“K: V”的方式将键与值对应起来。在访问元组内元素时，可以使用序号进行访问，如果指定了键，则可以使用键名进行访问。

```
let info = (1000, "张三", 99)
println("No.: \(info.0), Name: \(info.1), Score: \(info.2)")

let worker = (id: 001, name: "hengheng")
println("ID: \(worker.id), Name: \(worker.name)")
```

输出：

```
$ swift tuples.swift
No.: 1000, Name: 张三, Score: 99
ID: 1, Name: hengheng
```

