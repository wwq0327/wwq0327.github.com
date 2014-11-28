---
layout: post
title: 命令行下体验swift
description: 命令行下体验一把swift，这是件很酷的事！
keywords: swift
---
开始了Swift的学习，但以前习惯了Python在命令行下运行，然后可以使用iPython进行体验，调试，觉得很方便。而swift是使用Xcode进行编写并运行的。虽然说swift并不是像Python，Ruby那样是一门动态语言，它是需要编译之后才能运行的。

使用类似于iPython那样的功能，可以直接在命令模式下输入`swift`即可进入到这种状态下：

```
For more information on any command, type ':help <command-name>'.
  1> let PI = 3.14
PI: Double = 3.1400000000000001
  2> PI *  3
$R0: Double = 9.4199999999999999
  3> for i in 0...10 {
  4.     println(i)
  5. }
0
1
2
3
4
5
6
7
8
9
10
6>
7> :q
  ```
 
 一个明显的感觉，那就是每输入一行，都会有一个短暂的停顿，那应该是在进行编译吧。
 
 这种方式不太适用于一些复杂的代码编写，也可以不使用Xcode，直接像编写Python代码那样写一个swift代码，如这样：
 
 ```
 #!/usr/bin/env swift
 
 println("Hello, World")
 ```
 
 这时便可以使用这样的命令行来跑这段代码了：
 
 ```
 $ swift hello.swift
 ```
 
 也可以将这个文件加上可执行的权限：
 
 ```
 $ chmod a+x hello.swift
 $ ./hello.swift 
 Hello, World
 ```
 
 最后，我们还可以使用`swiftc`这个命令来将`.swift`代码直接编译成一个可执行文件：
 
 ```
$ swift hello.swift
Hello, World
$ swiftc hello.swift
$ ./hello
Hello, World
```
 
 如果只是学习swift基础的话，我想这也是一种很方便的学习方式。
 
 不过Xcode也有他强大的地方，如Playground， 可以实时的看到代码的运行情况，这是其它编辑器所不能替代的一个功能，对于才学习swift的人来说，它会是一个非常有用的功能。但无论如何，尝试下各种方式，仍是一个非常不错的主意。