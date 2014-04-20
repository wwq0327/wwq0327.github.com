---
layout: post
title: "web.py 添加上下文关联"
---
不清楚这个名字描述得是否准确，我记得在Django中，有个``request``参数很管用，比如在web设计中，对于用户是否登录的判断，在``request``中，会自动对``request``这一关联字传送到模板中去。在web.py中，没有现在的，只能自己想办法了，而还让我找到了这样的代码。

大致做法，一是启动启中加入：

```python
def request_hook():
    request = {}
    request['user'] = web.ctx.session.username
    web.ctx.request = request

app.add_processor(web.loadhook(request_hook))
```

这里需要开启``session``功能，后面会用到。

如何进行传递呢，在使用在控制代码中，可以这样定义：

```python
class Index:
    def GET(self):
        context = web.ctx.request

	return render_template('index.html', **context)
```

笔者使用的是``Jinja2``作为``web.py``板的，这样你在登录后，只对于``web.ctx.session.username``添加相应的属性，就可以有模板中直接使用``user``属性了。

代码参考：

<https://github.com/wwq0327/qingblog/blob/master/qing/code.py>
