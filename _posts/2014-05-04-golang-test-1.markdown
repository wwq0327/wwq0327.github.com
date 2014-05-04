---
layout: post
title: golang 测试演示
description: 如何使用golang testing 模块进行简单测试
keywords: golang testing
---
在golang中，对项目的测试，每一个模块都建议使用的一个`lib_test.go`的文件进行测试。例如我想写一个加法计算的模块，可以先进行测试模块的编写，然后再来写这个模块。

这里我们先建一个目录，名为`testdemo`:

```bash
$ mkdir testdemo
$ touch add.go add_test.go
```

这里我们先打开`add.go`，添加上这段代码：

```golang
package testdemo
```

这里我们还什么函数都没有写，先不管这个，先把测试写出来，在`add_test.go`中写入如下代码：

```golang
package testdemo

import (
	"testing"
)

func TestAdd(t *testing.T) {
	var a, b, sum int
	a = 4
	b = 5
	sum = 9
	if Add(a, b) == sum {
		t.Log("测试通过了！")
	} else {
		t.Error("测试没通过！")
	}
}
```

同样的`package name`，需要import `testing`这个模块，对于测试函数，方式是`TestFuncname`的方式，参数类型为`*testing.T`。然后就是测试主体了，如果通过，则给出成功的信息，否则输出错误信息。然后到终端去执行下测试：

```bash
$ ls
add.go      add_test.go
$ go test
# github.com/wwq0327/gosys/testdemo
./add_test.go:12: undefined: Add
FAIL	github.com/wwq0327/gosys/testdemo [build failed]
```

`FAIL`为出错的信息，输入信息是`Add`这个函数没有定义。我们`Add`这个函数还没有写，然后我们把这个函数先写出来。

```golang
package testdemo

func Add(a, b int) int {
	return a + b
}
```

这个函数很简单，就是两个`int`类型的参数，然后返回它们之和。下面我们再来测试一下：

```bash
$ go test
PASS
ok  	github.com/wwq0327/gosys/testdemo	0.008s
```

测试成功了！使用参数`-v`可以看到更多的测试信息：

```bash
$ go test -v
=== RUN TestAdd
--- PASS: TestAdd (0.00 seconds)
	add_test.go:13: 测试通过了！
PASS
ok  	github.com/wwq0327/gosys/testdemo	0.008s
```

会多一些哪个函数，参与我们指定的打印信息。

下面我们再来写一个测试：

```golang
[...]

func TestAddFail(t *testing.T) {
	if Add(3, 4) == 4 {
		t.Log("测试通过！")
	} else {
		t.Error("测试没通过！")
	}
}
```

这个我们故意出错，我们再看看测试情况：

```bash 
$ go test -v
=== RUN TestAdd
--- PASS: TestAdd (0.00 seconds)
	add_test.go:13: 测试通过了！
=== RUN TestAddFail
--- FAIL: TestAddFail (0.00 seconds)
	add_test.go:23: 测试没通过！
FAIL
exit status 1
FAIL	github.com/wwq0327/gosys/testdemo	0.008s
```

这时第二个测试就有问题了。
