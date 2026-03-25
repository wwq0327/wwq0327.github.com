---
layout: post
title:  iOS UICollectionView 记录
description:
keywords: swift
---
UICollectionView将内容显示于一个一个的网络之中，对于展于一些属性相似的内容挺有用的。在用法上有些类似于UITableView。

在UICollectionView的属性设置中，可以直接设置出它的每行显示个数，大小等。但这个方法，当设备不一样时，这些具体参数就显得没啥用处了，所以我想在使用的时候，能根据不屏幕尺寸，自动适配宽度与高度。

解决办法，在视图进行加载之时，先调用一个视图设置方法，来根据自己的需要，计算出每个Cell的宽与高。

```
    func setupView() {
        let flowLayout = UICollectionViewFlowLayout()
        
        var width = (view.bounds.size.width - 32)  / 2
        
        // 左右间距
        flowLayout.minimumInteritemSpacing = 1.0
        // 上下行距
        flowLayout.minimumLineSpacing = 16.0
        // 格子尺寸
        flowLayout.itemSize = CGSize(width: width, height: width)
        // 上下右左周边的间距
        flowLayout.sectionInset = UIEdgeInsets(top: 16, left: 8, bottom: 16, right: 8)
        
        
        collectionView?.collectionViewLayout = flowLayout
    }
 ```
 
 对于width这个变量，可以根据需要，将后面的除数设置成你想要的一行的cell个数，比如，你想一行显示两个就除以2，三个就除以3，以此类推。
 
 
 需要注意的是，如果每一行的个数调节之后，为了保持各个Cell间的间距看起来一致，还需要设置下那几个间距。
 
 ![image](http://ww3.sinaimg.cn/large/603daed6gw1ernpqwma69j20a50gujrv.jpg)
 
    

