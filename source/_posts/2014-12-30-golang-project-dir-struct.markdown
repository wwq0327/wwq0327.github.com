---
layout: post
title: Golang 工程项目目录结构
description:
keywords: golang
---

尽管还没有能力开始做一些真正的项目，但在学习别人代码的过程中，仍有时没法理解别人是如何将代码进行布局的，想想就打算先进行一个比较深入的了解，再来一个个的解决其它问题吧。

我学习在在Mac OSX上行进行的，我也习惯了使用github进行行代码管理。参考了许多网上的工程项目结构设置，于加上我还不成熟的思考，然后有了我的关于golang工程项目目录结构安排方式。

## 假设
假设我们在来Mac上设置的整个Golang开发目录是这样的：

`/Users/wyatt/newgo`，这其实就是我所设置的目录，首先需要解决的一个问题便是将这个目录加到你的GOPATH中去，我是直接加到了`~/.bash_profile`p这个文件中：

```
export GOPATH=$HOME/newgo
```

完成之后，你需要`source ~/.bash_profile`加载一下新的配置，再可以使用`env`这个命令检查一下看目录设置是否成功了。

## 设置代码目录

这个目录建成之后，继续这样做的：

```
$ cd newgo
$ mkdir src
$ mkdir -p src/github.com/wwq0327
```

上面这步，需要创建一个`src`目录，专门用于存放go源代码的项目，你的项目代码都在这个目录之下。为了你的代码可以在github上分享，需要创建以个你github帐户链接的目录。这步完成之后，你就可以将所有的项目直接在这个帐号目录下进行创建了。

## 创建一个新项目

这里我们演示一个新项目，就叫做`mygo`吧，即是你的项目名称了。

```
$ cd ~/newgo/src/github.com/wwq0327
$ mkdir mygo  # 创建项目目录
$ touch mygo.go # 程序main程序
$ mkdir mylib # 创建mylib 包
$ mkdir myconf # 创建myconf包
```

上面就创建上了一个主程序及两个包了。下面我们添加上代码。

```
// mylib/lib1.go

package mylib

import "fmt"

func PrintLib() {
	fmt.Println("from lib1")
}
```

```
// myconf/confi1.go
package myconf

import (
	"fmt"
)

func PrintConf1() {
	fmt.Println("Conf1.go")
}
```

```
// myconf/conf2.go
package myconf

import (
	"fmt"
)

func PrintConf2() {
	fmt.Println("Conf2.go")
}
```

然后我们再将这两个库导入到主程序中去，在主程序中进行调用：

```
// mygo.go
package main

import (
	"github.com/wwq0327/mygo/myconf"
	"github.com/wwq0327/mygo/mylib"
)

func main() {
	mylib.PrintLib()
	myconf.PrintConf1()
	myconf.PrintConf2()
}
```

这里需要注意调用路径，使用的是将`src`目录作为导入的根目录的。整个项目结果是这样的：

```
$ tree .
.
├── myconf
│   ├── conf1.go
│   └── conf2.go
├── mygo.go
└── mylib
    └── lib1.go

2 directories, 4 files
```

## 编译安装
一切OK后，我们就可进行编译安装了。

```
$ go build
$ go install
```

这两步完成之后，在newgo目录中就多了`bin`和`pkg`两个目录。编译的库文件`mylib.a`和`myconf.a`会出现在相应的目录中。而最终生成的`mygo`可执行程序。

对于包文件的命令，是一个包下N个功能不一样的`.go`程序，只是在归为一个包的时候，在程序的开始设置包名的时候，需要注意名称。如上面例子中，对于`myconf`这个包，里面存着着两个不同名字的程序，但程序中的`package myconf`却是相同的，这样的编译的时候，虽是两个文件，但编译出来的包，仍是一个文件的。


