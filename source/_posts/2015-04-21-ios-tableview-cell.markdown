---
layout: post
title: iOS UITableView指定Cell显示不同内容
description:
keywords:
---

## 需求

我想使用UITableView做一个列表，然后里面只放两三件不一样的内容，即每个Cell显示不同的内容。

## 解决办法

将所需要显示的Cell指定上Identifier，使用switch语句来控制每个Cell显示的内容。

## 过程

### 新建一个项目
创建一个新项目，由于我这里只是实验项目，所以我取了一个名为`T1`的Single View Application。

### 创建Storyboard
这里的实验对象是UITableView，所以我将原来默认的Storyboard删除掉，得新拖了一个TableViewController到Storyboard去。

同时修改`ViewController.swift`这个文件，将其继续的父类改成`UITableViewController`，再回到Storyboard中，指定场景所绑定的类，如图所示:

![image](http://ww1.sinaimg.cn/large/603daed6gw1ere2uy8umij206v02yt8o.jpg)

### 指定每个Cell的Identifier
这时的Cell数量只有一个，假设我这里需要三个Cell的话，可以先选中在TableViewController控件，然后在`Attributes inspector`中的`Prototype Cells`，将其数量修改为3，如图所示：

![image](http://ww1.sinaimg.cn/large/603daed6gw1ere2z8e8s3j206q02pjrd.jpg)

接下来，需要指定每个Cell的Identifier了。打开Storyboard的大纲视图模式。点击相应的Cell，并分标从上到下，标为：

- C1Cell
- C2Cell
- C3Cell

视图如图所示：

![image](http://ww2.sinaimg.cn/large/603daed6gw1ere32yigtrj205i04st8v.jpg)

这个Identifier是非常重要的，在编码的时候，会使用到这个名称，来区别不同的Cell。


### 编码

最后就是编码了，直接上代码吧：

第一部份，`tableView(_:numberOfRowsInSection:)`这个方法，是用来指定Cell显示行数的，这里需要按你实际设定的Cell数量来设置。

```
    override func tableView(tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return 3
    }
```

第二部份，`tableView(_:cellForRowAtIndexPath:)`来显示表格内容的。对于每行显示内容固定的表格，只需要拿到Cell，再对Cell上项目进行赋值操作即可。但对于每行表显示项目不同的Cell来说，我们需要拿到每个Cell，然后对其进行赋值操作。

这里我使用switch语法，根据不同的`indexPath.row`的值对每个Cell的内容进行操作。

```
    override func tableView(tableView: UITableView, cellForRowAtIndexPath indexPath: NSIndexPath) -> UITableViewCell {
        
        var cell: UITableViewCell!
        
        switch indexPath.row {
        case 0:
            cell = tableView.dequeueReusableCellWithIdentifier("C1Cell") as! UITableViewCell
            cell.textLabel?.text = "C1"
        case 1:
            cell = tableView.dequeueReusableCellWithIdentifier("C2Cell") as! UITableViewCell
            cell.textLabel?.text = "C2"
        case 2:
            cell = tableView.dequeueReusableCellWithIdentifier("C1Cell") as! UITableViewCell
            cell.textLabel?.text = "C3"
        default:
            break
        }

        return cell
    }

```

当然这只是显示了一下如何对每个Cell进行操作而已，在实际的项目中，这个Cell的定义会更加复杂，比如可以使用xib，每个Cell也可以绑定不同的Cell类，这样操作起来会更加灵活。

## 最终效果

最后的效果是这样的：

![image](http://ww2.sinaimg.cn/large/603daed6gw1ere3diq00dj20a50gujrn.jpg)
