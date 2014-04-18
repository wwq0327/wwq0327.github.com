---
layout: post
title: "debian install lamp"
date: 2012-06-22 21:03
comments: true
categories: [debian, lamp] 
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
- Debian下LAMP环境的搭建 <http://blog.csdn.net/mylxiaoyi/article/details/1489602>
- ssh <http://wowubuntu.com/25-ssh-cmd.html>
- rsync实现自动化备份方案 <http://blog.chinaunix.net/uid-23914782-id-2721764.html>
- tar 详解 <http://www.chinahtml.com/1006/127561653018850.html>
- LNAMP 配置　<http://www.airski.net/focus/444.html  http://d.ream.at/configure-lanmp-on-debian/>
