---
layout: post
title: 使用Jekyll＋Markdonw像黑客一样写客博
description: Jekyll＋Markdown+GithubPages，创建你的个人博客
keywords: jekyll
---
得以朋友的指定，对于文章的标题，一定要在切中内容的同时，还要足够的吸引眼球，于是我想到了这个拉风的标题。

这篇文章，我想要表达的是，如何使用Jekyll+Github，搭建一个个人Blog，当然博客的书写格式是Markdown了，最后，会谈谈购买一个个人域名，再将Github Pages的地址绑定到域名上去。内容上不会从零开始，会给出链接，大家参考链接做就成了。

整个操作都是基于Mac OS X操作系统上进行的，如果是Windows或是Linux，请自己搜索git，ruby的安装，在Mac里，ruby是系统自带了（据说这也是许多人喜欢用Mac做ruby开发的原因）。

## 注册Github帐号及创建仓库

网址：<https://github.com>

创建仓库里，需要注意，如果你的用户名为"abcd"，则创建的仓库名应为“abcd.github.io”。这个是必须的，不能改，如图：

![](https://pages.github.com/images/user-repo@2x.png)

对于仓库，最少的输入，就只需要输入仓库名，然后点击`Create repository`就仓库了，这样你就得到你的博客仓库了，而你的博客内容就是存放在这个仓库里的。

然的将仓库Clone到本地：

```bash
$ git clone https://github.com/username/abcd.github.io
```

> abcd为你的用户名

## 安装jekyll

jekyll是使用ruby编写的，而Mac上默认是带有ruby的，因而不需要安装，只需要直接安装上jekyll就后了，安装就一条命令：

```bash
$ gem install jekyll
```

等着安装完成，安装完成后，测试一下：

```bash
$ jekyll -v
jekyll 1.5.1
```

看到这些就表示没问题了。

## 安装jekyll
jekyll可以直接生成一个博客模版，创建命令是：

```bash
wyattdeMacBook-Pro:tmp wyatt$ jekyll new blogdemo
New jekyll site installed in /Users/wyatt/tmp/blogdemo.
wyattdeMacBook-Pro:tmp wyatt$ cd blogdemo/
wyattdeMacBook-Pro:blogdemo wyatt$ jekyll serve
Configuration file: /Users/wyatt/tmp/blogdemo/_config.yml
            Source: /Users/wyatt/tmp/blogdemo
       Destination: /Users/wyatt/tmp/blogdemo/_site
      Generating... done.
    Server address: http://0.0.0.0:4000
  Server running... press ctrl-c to stop.
```

然后在浏览器中，可以输入`http://0.0.0.0:4000`进行访问了，页面像这样：

![](http://ww2.sinaimg.cn/large/603daed6gw1egjj4ty85fj21kw12dq6z.jpg)

不过这个不太美观呀，我们需要找一个好看点的，你可以Google一下关键词“jekyll themes”找到一些模版，我推荐一个模版地址：

<http://jekyllthemes.org/>

选择中一个，直接Donwload数据包，解压，把目录里的所有文件复制到你的博客目录里，然后使用git push到github仓库就OK了：

```bash
$ git add .
$ git commit -m 'first commit'
$ git push -u origin master
```

上传成功之后，官方说要等十来分钟就能看到你的内容，但我自己在使用的时候，也发现，有时push完成之后，就立马能看到内容了。

## 如何发布你的博客

创建一篇博客，需要按照jekyll的格式来进行，两个地方需要约定。

**文章标题：**

文章文件是存放在`_posts`中的，名称为"yyyy-mm-dd-POSTNAME.markdown"，如这篇文章的文件名是：

> 2014-05-19-jekyll-markdonw-githubpages.markdown

由于jekyll不带数据库的，这个文件名就可以读取到日期。

**文件头：**

每篇文章都是这样开头的，像我们这篇文章：

```
---
layout: post
title: 使用Jekyll＋Markdonw像黑客一样写客博
description: Jekyll＋Markdown+GithubPages，创建你的个人博客
keywords: jekyll
---
```

需要注意的是表头，如`title:`与文章标题有个半角的空格，如果有时你发现你的文章显示有问题，那么多半是这里出了问题了。最后一条`---`就是你文章开始的地方，然后语法为Markdown。

书写完成之后，把更改push到github就OK了。

## 设置

设置是通过`_config.yml`进行的，如果你下载了别人的模版，你注意修改文件里的内容就行了。

## 加入评论插件

我自己比较喜欢多说评论，你可以到多说上注册一个插件，然后把代码复制到`_layouts/post.html`文件中的`</article>`后面，同时将首段代码改成这样：

```html
<!-- 多说评论框 start -->
    <div class="ds-thread" data-thread-key="{{ post.url }}" data-title="{{ post.title }}" data-url="{{ post.url }}"></div>
<!-- 多说评论框 end -->
```

## 将Github Pages绑定到你的个人域名

通过上面的设置，你就可以使用`http://username.github.io`访问到你的个人博客了。但如果你想弄个域名来指向这个域名，该怎么做呢？

当然首先，你得自己买个域名，我自己是在万网上买的一个.com域名，50块钱，还是算便宜的。然后我们使用dnspod.cn来进行管理，注册帐号，绑定解析服务器，你需要到万网的域名管理后台，把dns指向DNSPOD，地址分别是：

```
f1g1ns1.dnspod.net
f1g1ns2.dnspod.net
```

然后再到Dnspod上，添加上github的地址，A记录：

> 192.30.252.153

我的配置是这样的：

![](http://ww4.sinaimg.cn/large/603daed6gw1egjjv2lnjtj217q0k4tcc.jpg)

里面的二域名那个，你先不用管。

然后再在你的博客项目里创建一个名为`CNAME`的文件，内容为你的域名，注意，不要改文件名，全为大写，无扩展名。域名里不用带`http`或是`https`只类的。

再Push，然后等等，你就可以使用你的域名访问你的博客了。

## 完

上面的配置，相当于使用Github Page来进行内容的托管，然后外加一个域名就OK了，先期试用，你可以先只用Github做就成了，可以暂不买域名，因为写东西这事，不是每个人都能坚持下来的，指不定哪天就停下来不想写了，买个域名也是浪费。等写上一段时间之后，觉得有必要了，再去买不迟。

