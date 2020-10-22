<!--
 * @Author: your name
 * @Date: 2020-06-05 16:48:33
 * @LastEditTime: 2020-06-11 11:29:30
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \serious-review\src\summary\面试相关\js高频面试题收集.md
--> 
### let、const、var的区别？

- var声明的变量会挂载在window上，而let、const声明的变量挂载在Script下，而Script和Global对象是平级的；
- var声明变量存在变量提升，let和const不存在变量提升；
- 同一作用域下let和const不能声明同名变量，而var可以；
- let和const声明形成块作用域， var变量提升不会形成作用域；
- var和let可以可以修改声明的变量，const不可以
- const声明变量时必须初始化；
- let、const 存在暂时性死区；

### promise 的实现原理？与generator、async/await的区别？

异步编程常用的几种方法：

- 回调函数
- 发布/订阅
- 事件监听
- Promise
- Async / await
- Event Loop
- Generator


1. Promise为解决异步编程回调地狱，开箱即可用；
2. Generator是通过next()分段执行，可以被暂停，需要自己额外封装；
3. async/await是promise和generator的语法糖，在内部有个自执行器执行generator;

