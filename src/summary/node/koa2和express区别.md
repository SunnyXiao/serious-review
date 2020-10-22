## koa2 与 express
### 一、概念

`express` 是一个基于`node.js`平台的极简、灵活的web应用开发框架，主要基于`Connect`中间件，
并且自身封装了路由、视图处理等功能，使用人数众多；

`Koa`相对更为年轻，是`express`原班人员基于`es`新特性重新开发的框架，主要基于`co`中间件，基于
`es6 generator`特性的异步流程控制，解决了回调地狱问题和麻烦的错误处理，框架自身不包含任何中间件，很多功能需要第三方中间件解决。
`koa2`是`Koa`的2.0版本，使用`async`和`await`来实现异步流程控制。

### 二、区别

1. `express`自身集成了路由、视图处理等功能；`Koa`本身不集成任何中间件，需要配合路由、视图等中间件进行开发。

2. 异步流程控制：`express`采用`callback`来处理异步，`koa2`采用`async/await`。`generator`和`async/await`使用同步的写法来处理异步，明显要
好于`callback`和`promise`。

3. 错误处理：`express`使用`callback`来捕获异常，对于深层次的异常捕获不了；`Koa`使用`try catch`，能更好地解决异常捕获。

4. 中间件模型： `express`基于`connect`中间件，线性模型；`Koa`中间件采用洋葱模型，所有的请求在经过中间件的时候都会执行俩次，能够非常方便的执行一些后置处理逻辑。

5. `context`：`express`只有`Request`和`Response`俩个对象不同，`Koa`增加了一个 `Context`对象，作为这次请求的上下文对象
