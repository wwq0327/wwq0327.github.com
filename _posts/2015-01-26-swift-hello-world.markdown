---
layout: post
title: Swift Example - Hello, world!
description: Swift第一个例子
keywords:
---
关于Swift的第一个例子，我们永远喜欢拿经典的“Hello, world！”。

```
#!/usr/bin/env xcrun swift

println("Hello, world!")
```

第一行是为Swift在命令下作为一个可执行程序而准备的。很像如Ruby，Python这类脚本程序一样。关键的输出一行，就是最后一句了。

如何执行这个程序呢？我们可以这样做：

```
$ ls
hello-world.swift
$ swift hello-world.swift
Hello, world!
$ swiftc hello-world.swift
$ ls
hello-world       hello-world.swift
$ ./hello-world
Hello, world!
```

第一种执行方式就是直接当作一个脚本代码执行，而第二种方式是对Swift进行了编译，生成了一个可执行文件。细心的朋友也会发现，第一次执行Swift代码的时候，感觉速度不太快，原因是Swift正在进行编译，编译之后，速度就非常快了。

就这样，我们有了Swift第一个程序！