### 什么是defineProperty？

> defineProperty其实是定义对象的属性。

> 主要有value、get、set、writable、enumerable、configurable(false时，不可以被删除)几个属性；
    
  var obj1={a: 1,b: 2}
  console.log(Object.getOwnPropertyDescriptor(obj1,'a'))
  // 输出： {value: 1, writable: true, enumerable: true, configurable: true}

- Object.freeze()
> 可以浅冻结一个对象。一个被冻结的对象再也不能被修改；冻结了一个对象则不能向这个对象添加新的属性，不能删除已有属性，不能修改该对象已有属性的可枚举性、可配置性、可写性，以及不能修改已有属性的值。此外，冻结一个对象后该对象的原型也不能被修改

        Object.freeze(obj1)
      console.log(Object.getOwnPropertyDescriptor(obj1,'a'))
    
      // 输出： {value: 1, writable: true, enumerable: true, configurable: true}
  

### 什么是Proxy？

 Proxy对象用于定义基本操作的自定义行为

> 和defineProperty类似，功能几乎一样，只不过是用法上有不同

通常用途：

- 校验类型
- 真正的私有变量



### Vue2的数据响应式原理
#### Vue的双向绑定
对象监听：

- 把一个普通 Javascript 对象传给 Vue 实例的 data/props 选项，Vue 将遍历此对象所有的属性，并使用 Object.defineProperty 把这些属性全部转为 getter/setter。
- 在getter里头收集依赖；
- 在setter里头触发依赖；
- render的时候生成AST语法树；

数组监听：

 通过push、pop、shift等来监听数组的改变，实际上是在数组的原型链上定义一系列操作方法，以此实现数组变更的检测，即定义一组原型方法在arr.__proto__指向的那个原型对象上，如果浏览器不支持__proto__，那么就直接挂载在数组对象本身上

举一个例子：

  const originalPush = arrayMethods.push;
  Object.defineProperty(arrayMethods, 'push', {
      configurable: true,
      enumerable: false,
      writable: true,
      value(...args) {
          const result = originalPush.apply(this, args);
          console.log('对数组进行了push操作，加入了值：', args);
          return result;
      }
  })
  data.arr.__proto__ = arrayMethods
  data.arr.push([5, 6], 7) // 对数组进行了push操作，加入了值：[5, 6], 7

源码：

  /*
     * not type checking this file because flow doesn't play well with
     * dynamically accessing methods on Array prototype
     */

    var arrayProto = Array.prototype;
    var arrayMethods = Object.create(arrayProto);  // 形成：arrayMethods.__proto__ -> Array.prototype
  
    var methodsToPatch = [
      'push',
      'pop',
      'shift',
      'unshift',
      'splice',
      'sort',
      'reverse'
    ];

    /**
     * Intercept mutating methods and emit events
     */
    methodsToPatch.forEach(function (method) {
      // cache original method
      var original = arrayProto[method];
      def(arrayMethods, method, function mutator () {
        var args = [], len = arguments.length;
        while ( len-- ) args[ len ] = arguments[ len ];
  
        var result = original.apply(this, args);
        var ob = this.__ob__;
        var inserted;
        switch (method) {
          case 'push':
          case 'unshift':
            inserted = args;
            break
          case 'splice':
            inserted = args.slice(2);
            break
        }
        if (inserted) { ob.observeArray(inserted); }
        // notify change
        ob.dep.notify();
        return result
      });
    });



#### Vue的依赖收集

#### Vue Computed 的实现原理
computed 本质是一个惰性求值的观察者。
computed 内部实现了一个惰性的 watcher,也就是 computed watcher,computed watcher 不会立刻求值,同时持有一个 dep 实例。
其内部通过 this.dirty 属性标记计算属性是否需要重新求值。
当 computed 的依赖状态发生改变时,就会通知这个惰性的 watcher,
computed watcher 通过 this.dep.subs.length 判断有没有订阅者,
有的话,会重新计算,然后对比新旧值,如果变化了,会重新渲染。 (Vue 想确保不仅仅是计算属性依赖的值发生变化，而是当计算属性最终计算的值发生变化时才会触发渲染 watcher 重新渲染，本质上是一种优化。)
没有的话,仅仅把 this.dirty = true。 (当计算属性依赖于其他数据时，属性并不会立即重新计算，只有之后其他地方需要读取属性的时候，它才会真正计算，即具备 lazy（懒计算）特性。)


### Vue3的数据响应式原理
Vue3的响应式原理是用了proxy的方式来实现，优化了Vue2响应式存在的几个问题

- defineProperty只能监听某个属性，不能对全对象监听
- 所以可以省去for in循环，提高效率
- 可以监听数组，不用再去单独的对数组做特异性操作


eg： 用proxy做类型验证

  function person(name.age){
    this.age = age
    this.name = name
    return new Proxy(this,{
      get: function(target,key){
        return target[key]
      },
      set: function(target,key,value){
        validate(key,value)
      }
    })
  }

#### Proxy 与 Object.defineProperty 优劣对比
##### Proxy 优势：
* 可以直接监听对象而非属性；
* 可以直接监听数组的变化；
* Proxy 返回的是一个新对象,我们可以只操作新的对象达到目的,而 Object.defineProperty 只能遍历对象属性直接修改；
* Proxy 有多达 13 种拦截方法,不限于 apply、ownKeys、deleteProperty、has 等等是 Object.defineProperty 不具备的；

##### Object.defineProperty 的优势如下:

兼容性好，支持 IE9，而 Proxy 的存在浏览器兼容性问题,而且无法用 polyfill 磨平，因此 Vue 的作者才声明需要等到下个大版本( 3.0 )才能用 Proxy 重写。

### Diff算法和virtual dom
- virtual dom： 
  diff 算法 — 比较两棵虚拟 DOM 树的差异；

  pach 算法 — 将两个虚拟 DOM 对象的差异应用到真正的 DOM 树。

- render出 AST语法树：

  源码流程：<code> $mount()->compileToFunctions()->compile()->baseCompile() </code>,真正的编译过程都是在这个baseCompile()里面执行，执行步骤可以分为三个过程
  
  1. 解析模版字符串生成AST
  
    <code>	const ast = parse(template.trim(), options) </code>

  2. 优化语法树
  
    <code>optimize(ast, options)</code>

  3. 生成代码
  
       <code>const code = generate(ast, options)</code>



### Vue指令编写

```
  
  
  'use strict';
  
  import Vue from 'vue';
  
  //指令： v-input-end
  //说明： 只适用于<input>。input 被点击时，光标自动移到最后一个字符
  
  let handler
  Vue.directive('inputEnd', {
      bind: function (el, binding, vnode) {
  
          handler = function (e) {
  
              let obj = e.currentTarget;
  
              obj.focus();
  
              let len = obj.value.length;
  
              if(document.selection) {
                  let sel = obj.createTextRange();
                  sel.moveStart('character', len);
                  sel.collapse(true);
                  sel.select();
              } else if(typeof(obj.selectionStart) == 'number' && typeof(obj.selectionEnd) == 'number') {
                  obj.selectionStart = obj.selectionEnd = len;
                  obj.scrollLeft = len * 8;
              }
  
          }
  
          setTimeout(()=>{
              if(el){
                  el.addEventListener('click', handler);
              }
          },0)
      },
      unbind: function (el, binding) {
         el.removeEventListener('click', handler)
      }
  })
```