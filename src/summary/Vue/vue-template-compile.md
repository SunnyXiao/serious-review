<!--
 * @Author: Luisa Xiao
 * @Date: 2020-04-05 17:43:38
 * @LastEditTime: 2020-04-05 17:48:48
 * @LastEditors: Please set LastEditors
 * @Description: 通过源码了解vue编译template的过程
 * @FilePath: /serious-review/src/summary/Vue/vue-template-compile.md
 -->


首先来了解下vue的渲染过程；

### new Vue()后发生了什么？
new Vue后会执行Vue.prototype._init方法（在initMixin方法中声明）