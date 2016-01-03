---
layout: post
title: Scrapy 学习笔记 -- 解决分页爬取的问题
description:
keywords: scrapy
---
Scrapy 是专门用来爬取网站数据的应用框架。爬取一个网站的数据，无非是从一个地方开始，拿到链接，读取页面，分析页面，拿到需要的数据，然后再存储下来，最后再循环这一步。过程挺好理解的，借一张图来说明 Scrapy 的工作流程：

![Scrapy 框架图](/assets/images/IMG_2180.jpg)

分析说明，可以看下这里：

http://www.jianshu.com/p/a8aad3bf4dc4

相对于这些理论性的东西，我考虑更多的是如何解决实际问题。有一段时间我对用 Python 写爬虫挺感兴趣的，但也只是爬一个页面的数据，当遇到翻页问题的时候，就拿它没有什么办法了。我早听说过 Scrapy 这个框架，但却认为还是 Geek 点好，自己写多酷呀，不过事实证明，水平是有限的，真搞不出来。当使用 Scrapy 时，才发现其真的强大！

这几天 ，我想做一个可以学习古诗的App，其核心的展示功能是做出来了，可以是没有数据呀。想过自己每天添加几首，但这事太麻烦，还是想弄点现成的，这样后期就不用太费事了。于是想到做一个爬虫来弄数据源。

我的目标是一个名为「古诗文网」的站点，收录的诗文很多，光古诗都四万多首。可惜这个站没有现成的 API 可用，不然也不费这事了。我只想拿到古诗这部分内，流程是这样的：

![处理流程](/assets/images/屏幕快照 2016-01-03 09.51.28.png)

平时很少画这些图，希望能够把问题说清楚。

「古诗第一页」，其实是一个爬虫入口，这是一个列表页。局部是这样的：

![屏幕快照 2016-01-03 09.51.28.png](/assets/images/)

每页有十项，我需要拿到每一项的数据的链接，同时还需要拿到「下一页」的链接，这一过程，交由「页面分析器」处理。这项拿到之后，就可以将数据的链接传递给「单页分析器」处理拿到每首诗的详细数据了。于是在 Spider 中，我需要定义好入口，写出两个析器。

1. 入口：
```
    start_urls = [
        'http://so.gushiwen.org/type.aspx?p=1&x=%e8%af%97',
    ]
```

2.  列表页面分析器：
处理两件事，一件是分析页面，拿数据的链接，交给 `self.parse_content()`处理，另一个就是拿到下一页，由于和入口结构一样的，只需要交由本身再进行分析，处理即可。调用方法，使用的是:

```
class scrapy.http.Request(url[, callback, method='GET', headers, body, cookies, meta, encoding='utf-8', priority=0, dont_filter=False, errback])
```
这个方法好长，不过我只传了两个参数进去，一个就是需要处理的 URL，还有就是回调的函数。这一步明白之后，代码就容易看明白了。


```
    def parse(self, response):
        '''拿到页面上的链接，给内容解析页使用，如果有下一页，则调用本身 parse() '''
        self.log("===========================| %s |" % response.url)
        song_list = response.css('div.sons').xpath('p[1]/a')
        for song in song_list:

            url = urljoin(SITE_URL, song.xpath('@href').extract()[0])
            self.log('gushi_url: %s' % url)
            ## 将得到的页面地址传送给单个页面处理函数进行处理 -> parse_content()
            yield scrapy.Request(url, callback=self.parse_content, headers=headers)

        ## 是否还有下一页，如果有的话，则继续
        next_pages = response.css('div.pages').xpath('./a[@style="width:60px;"]/@href')

        if next_pages:
            next_page = urljoin(SITE_URL, next_pages[0].extract())
            self.log('page_url: %s' % next_page)
            ## 将 「下一页」的链接传递给自身，并重新分析
            yield scrapy.Request(next_page, callback=self.parse, headers=headers)
```

3. 单页分析器：

```
    def parse_content(self, response):
        '''将得到的单个作品的页进行分析取值'''

        self.log('gushi_detail_url: %s' % response.url)
        item = GushispiderItem()
        item['link'] = response.url
        item['name'] = response.css('div.son1 h1').xpath('text()').extract()[0]
        item['dynasty'] = response.xpath('//div[@class="son2"]/p[1]/text()').extract()[0]
        try:
            author = response.xpath('//div[@class="son2"]/p[2]/a/text()').extract()[0]
        except:
            author = '佚名'
        item['author'] = author
        content = response.xpath('//div[@class="son2"]')[1].extract().strip().split('\n')[20:-1]
        item['content'] = '\n'.join(content).strip()

        yield item

```

代码中对于页面结构的分析部份花的时候挺多的，其实说起来技术性的东西是不多的，只是需要有点耐心，仔细一点就OK了。在理结构的时候，可以使用浏览器来辅助，我是将 Safari 与 Chrome 结合起来用。在 Safari 中的「元素检查」，点击结构中的项时，上面就会有一层层的CSS结构，在使用可以使用CSS选择器来获得数据。

![屏幕快照 2016-01-03 10.04.29.png](/assets/images/屏幕快照 2016-01-03 10.04.29.png)

对于 Chrome，则是 XPath 结构，可以将这样的结构复制出来：

![屏幕快照 2016-01-03 10.05.19.png](/assets/images/屏幕快照 2016-01-03 10.05.19.png)

比如，我复制的这个结构：

```
/html/body/div[3]/div[1]/div[14]/p[1]/a
```

这个结构是从最顶级开始的，我们在使用的时候，其实没有必要这么长的，对于一个级中多个相同元素，XPath是按从0到1的顺序编号的， 如`/html/body/div[3]`所表示的意思是`/html/body`下面的第三个`div`，其它的以此方法类推即可，不过如果一个 HTML 中如果有 `class`的话，我还是喜欢用 `div[@class="CLASSNAME"]`这样的方法来取，直观明子，不用一个个数顺序。

有了这两个工具，编写页面分析器的工作难度确实降了不少。但如果每次编完代码就跑一次，这样调试还是挺麻烦的，有个小技巧，Scrapy 提供了一个Shell功能，可以直接在终端下面命令行方式来编写分析规则，启动方法：

 ```
$ scrapy shell PAGE_URL
```
启动之后，会得到一个名为 `response`的变量，就可以对数据进行解析了。

![屏幕快照 2016-01-03 10.14.47.png](/assets/images/屏幕快照 2016-01-03 10.14.47.png)

反复尝试，我自己也不熟练，编写这些代码花了不少时间。

当爬用多个层级的页面时，就可以使用这种式法来构建代码，这里我爬的是两级的，所以写了两个分析器，如果下面存在第三级，则只需要再按需求编写一个方法即可。这次才算是搞明白了该如何解决多级爬取分析的问题了。

不过仍有一些问题没有搞定的。现在许多的网站是不允被爬取的，我在爬古诗文网的时候，最多也只爬到四百多条，而后面就开始出现 TCP 超时。尽管我设置了 4s 的爬取延时，仍没多大效果。Scrapy 官方给了一些解决办法，但我还没来得及研究。

再有一个问题，对于这种结果的数据：

![](/assets/images/屏幕快照 2016-01-03 10.54.23.png)

我想拿到所有的 `p` 这个 Tag 内的内容，而每次 `p` 的个数又不一样，我的处理办法是拿到所有`div`里的内容，再按段拆成数组，取中间需要的部份，像这样：

```
content = response.xpath('//div[@class="son2"]')[1].extract().strip().split('\n')[20:-1]
item['content'] = '\n'.join(content).strip()
```

但问题时，当`p`里再出现 HTML 代码时，就管不了了，再使用正则表达式提取？

先这样吧，早上起来又把爬虫跑了一次，但到一百多次的时候就「熄火」了，也没啥错误提示，这会正在跑，但却只有一百多条数据，还早着呢。
