I---
layout: post
title: iOS 代理模式学习
description:
keywords: iOS
---
在iOS开发学习过程中，许多的地方有使用到「代理模式」的，由于自己对于开发模式之类的知之甚少，所以理解起来觉得有些吃力。于是便花了一些时间学习这个内容。下面所记录的内容，便是我学习之后对「代理模式」的认识。

**先说说代理的使用场景：**

假设有两个对象，ObjectA和ObjectB，当我们在ObjectB中输入了一条信息，然后要在ObjectA上显示出来，这里就需要用到代理了。

简单说来，代理模式，是一种简单而功能强大的设计模式，这种模式用于一个对象“代表”另外一个对象和程序中其他的对象进行交互，两个对象，当一个对象不方便处理一些事的时候，就可以交由代理来做。

在iOS开发中，当我们需要**将ObjectA作为ObjectB的代理**时，实现步骤如下：

```
1.  在ObjectB中定义代理协议。
2.  给ObjectB一个可选型变量为`delegate`，并为 `weak`。
3.  在需要向ObjectA发送信息的地方调用代理方法。
4.  在ObjectA中实现代理方法。
5.  在ObjectA中通知ObjectB，现在A为B的代理了。
```

实现步骤即是这样，下面通过一个例子来说明如何实现两对象之间的代理模式。

## 过程

### 创建一个名为「Demo」的`Single View Application`项目：

![](http://ww2.sinaimg.cn/large/603daed6gw1epzif81e55j216g0psae2.jpg)

### 删除原有的`ViewController`及其视图，新建视图，添加组件

先将原有的`ViewController`及`stroyboard`中的视图删除掉。

拖入两个新的`ViewController`组件，在第一个视图中添加上一个`Label`和`Button`。

在第二个View上添加上`Text Field`和`Button`。调节位置，修改按钮上的文字。

将第一个视图指定为初始视图。选中第一个视图中的Button，拖动到第二实图，在弹出的菜单中选择「Model」。最后的效果，如图所示：

 ![image](http://ww4.sinaimg.cn/large/603daed6gw1epzihbu2vrj21d610cq4g.jpg)
 
### 编写代码

先创建两个新的文件，分别为`FirstViewController`和`SecondViewController`，模板为`Cocoa Touch Class`，都基于`UIViewController`类。

将类与实图进行绑定，第一个视图绑定到`FirstViewController`，第二们绑定到`SecondViewController`。

先在`SecondViewController.swift`中添加上代理协议：

```
// 1
protocol SecondViewControllerDelegate: class {
    func changeLabelContent(controller: SecondViewController, content str: String)
}
```

给`SecondViewController`添加一个代理变量：

```
// 2
weak var delegate: SecondViewControllerDelegate?
```

在这类里面，就可以写上调用代理方法的代码了，在编写方法之前，需要给TextField一个变量名：

```
@IBOutlet weak var textField: UITextField!
```

当点击第二个视图中的「确定」按钮之后，就向第一个视图发送消息，代码如下：

```
// 3
@IBAction func didClick() {
    var text = textField.text
    delegate?.changeLabelContent(self, content: text)
} 
```

下面一步，就是到消息的接收视图中写实现代理的方法。

```
class FirstViewController: UIViewController, SecondViewControllerDelegate {
    
    @IBOutlet weak var label: UILabel!
    ...
}
```

接着去实现方法：

```
// 4
func changeLabelContent(controller: SecondViewController, content str: String) {
    label.text = str
    dismissViewControllerAnimated(true, completion: nil)
}
```    

然后是告知ObjectB，“我是你的代理了，你可以给我发送操作指令了！”。

```
// 5
override func prepareForSegue(segue: UIStoryboardSegue, sender: AnyObject?) {
    var secondView = SecondViewController()
    if segue.identifier == "next" {
        secondView = segue.destinationViewController as SecondViewController
        secondView.delegate = self
    }
}
```    

### 关联

在这个Demo中，Outlet和一个Action，需要将组件与其关联起来，其对应关系是：

```
label => 第一视图中的Label

textField => 第二个视图中的TextField

didClick => 第二个视图中Button
```

## 源码地址：

<http://git.oschina.net/wwq0327/SwiftDelegateDemo>

