---
id: linux-cmd
title: Linux 命令行记录
type: article
author: 万青
summary: 记录一些常用的或是奇怪的Linux命令行，一性难以记完，遇到一条就加上一条。 命令行下新建一个文件交输入内容： 完成之后，需键入 ctrl+d 来保存并退出编辑状态。 显示目录结构： 会生成类似于下面结构的内容：
language: zh
visibility: public
featured: false
dates:
  authored: 2012-07-15
  published: 2012-07-15
  updated: null
originalUrl: https://wwq0327.github.io/2012-07-15/linux-cmd/
legacyPath: /2012-07-15/linux-cmd/
platform: 旧博客
topics: []
relatedProjectIds: []
sourceIds:
  - legacy-blog
media: null
---

记录一些常用的或是奇怪的Linux命令行，一性难以记完，遇到一条就加上一条。

- 命令行下新建一个文件交输入内容：

```bash
$ cat > new_file.txt
这里是内容
```

完成之后，需键入``ctrl+d``来保存并退出编辑状态。

- 显示目录结构：

```bash
$ tree -L 2 dir_name
```

会生成类似于下面结构的内容：

```
/opt
`-- google
    |-- chrome
    `-- talkplugin
```
