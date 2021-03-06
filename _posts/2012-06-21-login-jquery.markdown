---
layout: post
title:  jQuery 表单验证 
---

自己越用Django越感觉找不到北，于是想试试web.py，以前搞过，但当是面对用户注册就成了问题，于是转投其它的python web框架去了，尽管最终发现自己哪个都不怎么行，还是硬着头皮去弄web.py。在42qu混的这段时间，发现zsp要做一个关于python web开放的课程，自己想现场听课，可帝都离咱必竟还是太远了，就作罢了。看了看课程大纲，在我看来，这些都是做web开发所要面对的问题，差不多也是自己的问题。想着练下手吧，于是就用web.py开启了写一个轻博客的事儿。

两天时间，一边查资料，一边写代码。然后才搞到用户注册这一块，想必开始的时候会慢些吧，自己做着玩，也无所谓了。项目地址：https://github.com/wwq0327/qingblog　。

现在所具备的功能：用户注册，登录，登出，邮件激活，添加个人信息。

然后现在做的事，就是加一些用户验证方面的东西，可邮箱格式，密码长度等，这些会用到JS了，而自己在这方面花时间太少，平时做的一些练手的东西，也做得很糙，没太关注些用户体验方面的东西，尽花时间到后台去了。这次想一步步的做得下细一些，将整个过程走完，以些来熟悉web开发。

我使用的是邮件注册与登录，所以需要在前端加些jQuery来控制用户的输入问题。一些所输入内容的长度，二是格式，这些主要是邮箱的格式。自己从头来做，完全没方面，于是求助伟大的Google，还好，找到了自己认为比较好的资料：

- http://www.163css.net/net163/log/634653756500286250.html
- http://www.163css.net/net163/cssjs/2012/02/mbaobaoreg/index.html

然后自己照着写了些JS代码：

js代码：

```javascript
var REG_EMAIL = /^[_a-z0-9-]+(\.[_a-z0-9-]+)*@[a-z0-9-]+(\.[a-z0-9-]+)*(\.[a-z]{2,4})$/i;

$(function() {
    // login
    var login_email = $("#id_login_email");
    var login_pw = $("#id_login_pw");
    var login_checked = true;

    login_email.blur(function() {
        if(login_email.val() === ''){
            $(".email-error").html("请输入邮箱地址");
            login_checked = false;
        }else if(!REG_EMAIL.test(login_email.val())){
            $(".email-error").html("箱邮格式不正确");
            login_checked = false;
        }else{
            $(".email-error").html("");
        }
    })

    login_pw.blur(function(){
        if(login_pw.val() === ''){
            $(".pw-error").html("请输入密码");
            login_checked = false;
        }else if(login_pw.val().length < 6){
            $(".pw-error").html("密码不能小于六个字符");
            login_checked = false;
        }else{
            $(".pw-error").html("");
        }
    })

    $(".login-form").submit(function(){
        login_checked=true;
        login_email.blur();
        login_pw.blur();

        return login_checked;
    });
});
```

表单html

```
<!DOCTYPE html>
<html>
  <meta charset="utf-8" />
  <title>注册帐号 - Qing</title>
  <!--[if gte IE 7]><!-->
  <link rel="stylesheet" type="text/css" media="screen" href="/static/css/screen.css" />
  <!--<![endif]-->
  <script type="text/javascript" src="/static/js/jquery.min.js"></script>
  <script type="text/javascript" src="/static/js/qing.js"></script>
  </head>
  <body>
    <div id="wrap">
      
  <div class="container">
    <div class="hero-unit">
      简简单单记录生活
    </div>
    <form action="/auth/reg" method="post" class="login-form">

      <p>
        <label>邮箱</label>
        <input type="text" name="email" id="id_login_email"/>
      </p>
      <p>
        <label>密码</label>
        <input type="password" name="password" id="id_login_pw"/>
      </p>
      <p>
        <button type="submit">注册</button>
      </p>
    </form>
      <span class="email-error"></span>
      <span class="pw-error"></span>
    <div class="login-info">
      <p>已有密码，请<a href="/">登录</a></p>
    </div>

  </div>

      <hr />
      <footer>
        <div class="footer container">
          @Qing
        </div> <!-- end wrap -->
      </footer>
    </div>
    <!-- w(~) -->
  </body>
</html>
```

css 就不贴了，自己弄得很乱。有了这些之后，就能对用户所输入内容的正确认及长度作要求了。然后，后台也应该是需要一些验证，以防在用户关掉js之后，程序也能正常的跑起来。

其实，当看到JS跑起来了，感觉真是很不错呀。

做web，自己觉得还是挺复杂的，前端，后台，服务器，数据库，都得去专，不然做出来的东西，永远还只能是玩具级的，根本没法用。
