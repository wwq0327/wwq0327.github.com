---
id: debian-install-lamp
title: debian install lamp
type: article
author: wanqing
summary: "安装LAMP： 安装nginx: 配置文件位置： 重启apache2服务： 测试php 在 /var/www/ 新建一个 info.php 文件，内容为： 使用 curl 进行测试，需要安装下 curl ，然后在CLI…"
language: zh
visibility: public
featured: false
dates:
  authored: 2012-06-22
  published: 2012-06-22
  updated: null
originalUrl: https://wwq0327.github.io/2012-06-22/debian-install-lamp/
legacyPath: /2012-06-22/debian-install-lamp/
platform: 本站
topics: []
relatedProjectIds: []
sourceIds:
  - legacy-blog
media: null
---

安装LAMP：
```bash
apt-get install mysql-server apache2 php5
```

安装nginx:
```bash
apt-get install nginx
```

配置文件位置：

```
- apache2: /etc/apache2

- nginx: /etc/nginx

- mysql: /etc/mysql

- php5: /etc/php5
```

重启apache2服务：
```
sudo /etc/init.d/apache2 restart
```

测试php

在``/var/www/``新建一个``info.php``文件，内容为：
```php
<?php
    phpinfo();
?>
```

使用``curl``进行测试，需要安装下``curl``，然后在CLI输入：
```
curl localhost
```

一切正常的话，会看到N多html代码，如果只看到``info.php``的源文件内容，则说明需要重启下apache服务器。

tar 打包(带压缩)：
```
tar -jcvf /tmp/test.tar.bz2 /home/www
```

tar 解压：
```
tar -jxvf test.tar.bz2 /tmp <= .bz2
tar -zxvf test.tar.gz /tmp <= .gz
```

查看文件内容
```
tar -ztvf test.tar.gz
```

ssh
```
scp FILE user@host:/dir
or
scp user@host:/dir/FILE .
```
更改用户所属及组
```
chown USER FILE
chown :USER FILE
```

相关资料及工具介绍：

- curl: <http://www.ruanyifeng.com/blog/2011/09/curl.html>
- Debian下LAMP环境的搭建 <https://web.archive.org/web/20250319053753/https://blog.csdn.net/mylxiaoyi/article/details/1489602>
- ssh <https://web.archive.org/web/20250803053913/http://wowubuntu.com/25-ssh-cmd.html>
- rsync实现自动化备份方案 <http://blog.chinaunix.net/uid-23914782-id-2721764.html>
- tar 详解 <https://web.archive.org/web/20200203103851/http://www.chinahtml.com:80/1006/127561653018850.html>
- LNAMP 配置（原文链接已失效，未找到可用的存档）
