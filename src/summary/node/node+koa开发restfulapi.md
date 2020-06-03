<!--
 * @Author: your name
 * @Date: 2019-11-26 18:23:50
 * @LastEditTime: 2020-06-03 18:18:40
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \serious-review\src\summary\node\node+koa开发restfulapi.md
--> 
### 项目初始化
1. 进入要初始化的项目目录，执行命令
> npm init
2. 安装koa核心依赖库
> npm install koa koa-router koa-unless --save


### koa 洋葱模型实现的原理？

先看个例子

```
  const Koa = require('koa');
  const app = new Koa();

  app.use(async (ctx, next) => {
    console.log('中间件 1 进入');
    await next();
    console.log('中间件 1 退出');
  });

  app.use(async (ctx, next) => {
    console.log('中间件 2 进入');
    await next();
    console.log('中间件 2 退出');
  });

  app.use(async (ctx, next) => {
    console.log('中间件 3');
  });

  app.listen(3000);

```

输出结果：

```
  中间件 1 进入
  中间件 2 进入
  中间件 3 
  中间件 2 退出
  中间件 1 退出

```

koa在内部维护了一个中间件数组： 

> this.middleware = [];

调用 use 就是在给数组新增一项：

```
  use(fn) {
    if (typeof fn !== 'function') throw new TypeError('middleware must be a function!');
    if (isGeneratorFunction(fn)) {
      deprecate('Support for generators will be removed in v3. ' +
                'See the documentation for examples of how to convert old middleware ' +
                'https://github.com/koajs/koa/blob/master/docs/migration.md');
      fn = convert(fn);
    }
    debug('use %s', fn._name || fn.name || '-');
    this.middleware.push(fn);
    return this;
  }

```

#### 如何让中间件数组以洋葱模型调用呢？

看源码发现，在listen方法里头，创建server的时候有把callback传入进去：

```
  listen(...args) {
    debug('listen');
    const server = http.createServer(this.callback());
    return server.listen(...args);
  }
```

callback 方法主要是集成middleware，洋葱模型的关键是koa-compose

```
   callback() {
    const fn = compose(this.middleware);

    if (!this.listenerCount('error')) this.on('error', this.onerror);

    const handleRequest = (req, res) => {
      const ctx = this.createContext(req, res);
      return this.handleRequest(ctx, fn);
    };

    return handleRequest;
  }

```

接下来分析koa-compose的实现原理，源码如下：

```
  function compose (middleware) {
    if (!Array.isArray(middleware)) throw new TypeError('Middleware stack must be an array!')
    for (const fn of middleware) {
      if (typeof fn !== 'function') throw new TypeError('Middleware must be composed of functions!')
    }

    /**
    * @param {Object} context
    * @return {Promise}
    * @api public
    */
    return function (context, next) {
      // last called middleware #
      let index = -1
      return dispatch(0)
      function dispatch (i) {
        if (i <= index) return Promise.reject(new Error('next() called multiple times'))
        index = i
        let fn = middleware[i]
        if (i === middleware.length) fn = next
        if (!fn) return Promise.resolve()
        try {
          return Promise.resolve(fn(context, dispatch.bind(null, i + 1)));
        } catch (err) {
          return Promise.reject(err)
        }
      }
    }
  }

```
从代码里头可以看出compose内部是使用递归，并且中间件都是异步函数，它做了对异步函数的相关处理， 如以下的例子：

```
  const m1 = (ctx, next) => {
    ctx.req.user = null;
    console.log('中间件1 进入', ctx.req);

    next()

    console.log('中间件1 退出', ctx.req);
  }

  const m2 = (ctx, next) => {
      ctx.req.user = { id: 1 };
      console.log('中间件2 进入');

      next()

      console.log('中间件2 退出');
  }

  const m3 = (ctx, next) => {
      console.log('中间件3');
  }

  const middlewares = [m1, m2, m3];
  const context = { req: {}, res: {} };

  function dispatch(i) {
      if (i === middlewares.length) return;
      return middlewares[i](context, () => dispatch(i + 1));
  }

  dispatch(0);

```