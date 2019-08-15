## 1.构建基本服务器
- 创建express模块,导出一个函数，执行函数可以返回一个app对象
- app对象里定义`get`和`listen`两个方法
- get方法用于往路由里添加一条路由规则
- 初始化router对象保存所有的路由
- listen方法用于启动一个HTTP服务器并指定处理函数

### 1.1 测试用例
```js
const express = require('../index');
const app = express();
app.get('/',function(req,res){
    res.end('hello');
});
app.listen(3000,function(){
    console.log('server started on port 3000');
});
```

[1.构建基本服务器]

## 2. 封装Router
- app从字面量变为Application类
- 丰富HTTP请求方法
- 封装Router
- 路径一样的路由整合为一组，引入Layer的概念
- 增加路由控制，支持next方法，并增加错误捕获功能
- 执行Router.handle的时候传入out参数

### 2.1 测试用例
```js
const express = require('../');
const app = express();
/**
app.get('/',function(req,res,next){
    console.log(1);
    next();
},function(req,res,next){
    console.log(11);
    next();
}).get('/',function(req,res,next){
    console.log(2);
    next();
}).get('/',function(req,res,next){
    console.log(3);
    res.end('ok');
});
app.listen(3000);
**/
//-----------

app.get('/',function(req,res,next){
    console.log(1);
    next('wrong');
},function(req,res,next){
    console.log(11);
    next();
}).get('/',function(req,res,next){
    console.log(2);
    next();
}).get('/',function(req,res,next){
    console.log(3);
    res.end('ok');
}).get('/',function(err,req,res,next){
    res.end('catch: '+err);
});
app.listen(3000);

```

[2. 封装Router]

## 3.实现中间件
- application中添加use方法
- Router变函数
- 抽象出Router方便复用
- Router处理中间件

### 3.1 测试用例
```js
const express = require('../');
const app = express();
/**
app.use(function(req,res,next){
    console.log('Ware1:',Date.now());
    next();
});
app.get('/',function(req,res,next){
    res.end('1');
});
const user = express.Router();
user.use(function(req,res,next){
    console.log('Ware2',Date.now());
    next();
});
user.use('/2',function(req,res,next){
    res.end('2');
});
app.use('/user',user);
app.use(function(err,req,res,next){
    res.end('catch '+err);
});
app.listen(3000,function(){
    console.log('server started at port 3000');
});
 **/
//----------------------------
app.use(function(req,res,next){
    console.log('Ware1:',Date.now());
    next('wrong');
});
app.get('/',function(req,res,next){
    res.end('1');
});
const user = express.Router();
user.use(function(req,res,next){
    console.log('Ware2',Date.now());
    next();
});
user.use('/2',function(req,res,next){
    res.end('2');
});
app.use('/user',user);
app.use(function(err,req,res,next){
    res.end('catch '+err);
});
app.listen(3000,function(){
    console.log('server started at port 3000');
});

```
[3.实现中间件]

## 4.req.params
- 可以获取`req.params`
- 提供`app.param`的能力
  - layer借助`path-to-regexp`提取params
  - 在Router.handle里,process_params函数一次调用参数处理函数

### 4.1 测试用例
```js
const express = require('../');
const app = express();
app.param('uid',function(req,res,next,val,name){
    req.user = {id:1,name:'jason'};
    next();
})
app.param('uid',function(req,res,next,val,name){
    req.user.name = 'zfpx2';
    next();
})
app.get('/user/:uid',function(req,res){
    console.log(req.user);
    res.end('user');
});
app.listen(3000);
```
[4.req.params]

## 5.模版引擎
- 如何开发或绑定一个渲染引擎
- 注册一个渲染引擎
- 指定模版路径
- 渲染模版引擎

- app.engine(ext,callback)
  - ext 文件扩展名
  - callback 模版引擎的主函数
    - 文件路径
    - 参数对象
    - 回调函数


### 5.1 测试用例
```js
const express = require('../');
const path = require('path');
const html = require('../lib/html');
const app = express();
const fs = require('fs');
app.engine('html',html);
app.set('views',path.resolve('views'));
app.set('view engine','html');
app.get('/',function(req,res,next){
    res.render('index',{title:'hello',user:{name:'jason'}});
});
app.listen(3000);
```

### 5.2 渲染函数
application.js
```js
Application.prototype.set = function(key,val){
    if(arguments.length == 1){
        return this.settings[key];
    }
    this.settings[key] = val;
    return this;
}

Application.prototype.engine = function(ext,fn){
  let extension = ext[0]=='.'?ext:'.'+ext;
  this.engines[extension] = fn;
  return this;
}

Application.prototype.render = function(name,options,callback){
    console.log('app render');
    let engines = this.engines;
    let type = '.'+this.get('view engine');
    let render = engines[type];
    name = name.includes('.')?name:name+type;
    let file = path.join(this.get('views'),name);
    render(file,options,callback);
}

methods.forEach(function(method){
    Application.prototype[method] = function(){
        if(method == 'get'){
            if(arguments.length == 1){
                return this.set(arguments[0]);
            }
        }
       this.lazyrouter();
       this._router[method].apply(this._router,slice.call(arguments));
       return this;
    }
});

const server = http.createServer(function(req,res){
        function done(){
            res.end('Not Found');
        }
+       res.app = self;
        self._router.handle(req,res,done);
    });
```
middle/init.js
```js
module.exports = function(req,res,next){
    res.render = function(filepath,options,callback){
        let self = this;
        let done = function(err,html){
            res.setHeader('Content-Type','text.html;charset=utf-8');
            res.end(html);
        }
        res.app.render(filepath,options,callback||done);
    }
    next();
}
```

### 5.3 模版引擎
```js
const fs = require('fs');
function render(filepath,options,callback){
  fs.readFile(filepath,'utf8',function(err,content){
      if(err) return callback(err);
      let head = "let tpl = ``;\n with(obj){\n tpl +=`";
      content = content.replace(/<%=([\s\S]+?)%>/g,function(){
          return "${"+arguments[1]+"}";
      });
      content = content.replace(/<%([\s\S]+?)%>/g,function(){
          return "`;\n"+arguments[1]+" tpl+=`";
      });
      let tail = "`\n}\nreturn tpl;";
      let html = head + content + tail;
      console.log(html);
      html = new Function('obj',html);
      html = html(options);
      return callback(null,html);
  })
}
module.exports = render;
/**
<%if(user){%>
  hello <%=user.name%>
<%}else{%>
  hello guest
<%}%>
*/
/**
 let tpl = ``;
 with (obj) {
        tpl += ``;
        if (user) {
            tpl += `hello ${user.name}`;
        } else {
            tpl += `hello guest`;
        }
        tpl += ``;
    }
 return tpl;
 **/

```

[5.模版引擎]