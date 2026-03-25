---
layout: post
title: "在web.py中使用Jinja2作模板"
---
Python web开发中，貌似每个框架都能使用不同的模板，我自己知道的模板，如mako, jinja2, Django, web.py自带的模板等。Django上我花过比较多的时间，对于常用的功能还是比较清楚的，在使用web.py进行开发的时候，发现其自带的模板不太习惯，在网上搜索时，发现有人推荐mako，但使用的话又需要重新学习，发现jinja和django的模板差不多，那就用这个了吧。

在web.py的cookbook中有关于其它模板导入示例，如使用jinja：

```python
import web
from web.contrib.template import render_jinja

urls = (
        '/(.*)', 'hello'
        )

app = web.application(urls, globals())

render = render_jinja(
        'templates',   # Set template directory.
        encoding = 'utf-8',                         # Encoding.
    )

# Add/override some global functions.
#render._lookup.globals.update(
#       var=newvar,
#       var2=newvar2,
#)

class hello:
    def GET(self, name):
        return render.hello(name=name)

if __name__ == "__main__":
    app.run()
```

这种方式，在``return render.hello(name=name)`` 时，需与模板名相同，我个人比较喜欢第二种方式：

```python
import os
import web
from jinja2 import Environment,FileSystemLoader

urls = ("/.*", "hello")
app = web.application(urls, globals())

def render_template(template_name, **context):
    extensions = context.pop('extensions', [])
    globals = context.pop('globals', {})

    jinja_env = Environment(
            loader=FileSystemLoader(os.path.join(os.path.dirname(__file__), 'templates')),
            extensions=extensions,
            )
    jinja_env.globals.update(globals)

    #jinja_env.update_template_context(context)
    return jinja_env.get_template(template_name).render(context)

class hello:
    def GET(self):
        # You can use a relative path as template name, for example, 'ldap/hello.html'.
        return render_template('hello.html', name='world',)

if __name__ == "__main__":
    app.run()
```

这种方式和Django的模板方式相似类了。

其实为了方便使用，可以将``render_template``函数放在一个公共的模块里，然后更接引用即可。

对于``render_template``参数，可以创建一个字典，如:

```python
class Hello:
    def GET(self):
        content = {}
        content['name'] = 'world'
        content['time'] = time
        return render_template('hello.html', **content)
```

web.py使用起来，参定自我进行定制的地方很多，也正因为这样，可能每个人使用web.py开发出来的应用可以存在着很大的不同，掌握web.py，不仅仅仅于web.py本身，需要学习其它的东西也比较多。Python是挺灵活，但灵活也是有代价的，那就是一个知识点，可以会涉及到很多其它的东西。

但这些很有意思。