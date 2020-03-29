[你知道几种继承方式？](https://juejin.im/post/5cc19c29f265da03ab232d22?utm_source=gold_browser_extension)

[1.原型继承](#1原型继承)

[2.构造函数继承](#2构造函数继承)

[3.组合继承](#3组合继承)

[4拷贝继承](#4拷贝继承)

[5寄生继承](#5寄生继承)

[6寄生式组合继承1](#6寄生式组合继承1)

[7寄生式组合继承2](#7寄生式组合继承2)

[8混搭式继承](#8混搭式继承)

首先准备一个构造函数(后几个皆以此为例)


```
	function Person() {
	  this.name = 'person',
	  this.age = 18
	}
	Person.prototype.eat = function () {} 

```


<a id="markdown-1原型继承" name="1原型继承"></a>
## 1.原型继承

```
function Student() {}
Student.prototype = new Person
var s = new Student 

```
此时在控制台中查看S里是这样的
```
 {
    __proto__: Student.prototype {
      name: 'person',
      age: 18,
      __proto__: Person.prototype {
        eat: function () {},
        __proto__: Object.prototype
      }
    }
  }

```
> 优点： 使用简单，好理解
> 缺点： 原型链多了一层，并且这一层没什么用

<a id="markdown-2构造函数继承" name="2构造函数继承"></a>
## 2.构造函数继承

```
function Student() {
    Person.call(this)
}
var s = new Student
```
此时在控制台中查看S里是这样的

```
{
    name: 'person',
    age: 18,
    __proto__: Student.prototype {
      constructor: Student,
      __proto__: Object.prototype
    }
  }

```
> 优点： 直接把属性变成自己的了

> 缺点： 没有父类原型上的东西

<a id="markdown-3组合继承" name="3组合继承"></a>
## 3.组合继承

```
function Student() {
    Person.cal(this)
    Student.prototype = new Person
}
var s = new Student
```
此时在控制台中查看JS里是这样的

```
{
    name: 'person',
    age: 18,
    __proto__: new Person {
      name: 'person',
      age: 18,
      __proto__: Person.prototype {
        eat: function () {},
        constructor: Person,
        __proto__: Object.prototype
      }
    }
}

```
> 优点： 属性继承来变成自己的，原型也继承过来了

> 缺点： 第一层原型没用，继承的原型多走一步

<a id="markdown-4拷贝继承" name="4拷贝继承"></a>
## 4拷贝继承

```
function Student() {
    var p = new Person()
    for (var key in p) {
        Student.prototype[key] = p[key]
    }
}
var s = new Student
```
此时在控制台中查看S里是这样的

```
{
    __proto__: Student.prototype {
      name: 'person',
      age: 18,
      eat: function () {},
      constructor: Student,
      __proto__: Object.prototype
    }
}

```
> 优点： 属性和方法都继承来放在我自己的原型上了

> 缺点： for in 循环，相当消耗性能的一个东西

<a id="markdown-5寄生继承" name="5寄生继承"></a>
## 5寄生继承

```
function Student() {
    this.gender = '男'
    var p = new Person
    return p
}
Student.prototype.fn = function () {}
var s = new Student

```
这里很明显，此时直接得到的是 Person 的实例,this.gender和fn()不会存在在s中
> 优点： 完美的继承了属性和方法

> 缺点： 根本没有自己的东西了

<a id="markdown-6寄生式组合继承1" name="6寄生式组合继承1"></a>
## 6寄生式组合继承1

```
function Student() {
  Person.call(this)
}
Student.prototype.fn = function () {}

Student.prototype = Person.prototype
var s = new Student

```
此时在控制台中查看S里是这样的

```
{
    name: 'person',
    age: 18,
    __proto__: Person.prototype {
      eat: function () {},
      constructor: Person,
      __proto__: Object.prototype
    }
}

```
> 优点：原型的东西不需要多走一步

> 缺点： 没有自己的原型

<a id="markdown-7寄生式组合继承2" name="7寄生式组合继承2"></a>
## 7寄生式组合继承2

```
function Student() {
    Person.call(this)
  }
  (function () {
    function Abc() {}
    Abc.prototype = Person.prototype
    Student.prototype = new Abc
})()
var s = new Student

```
此时在控制台中查看S里是这样的

```
{
    name: 'person',
    age: 18,
    __proto__: new Abc {
      __proto__: Person.prototype {
        eat: function () {}
      }
    }
}

```

> 优点： 属性继承来是自己的，方法也继承来了，组合式继承的中间那个环节多余的属性没有了

> 缺点： 就是多了一个 空环，导致我访问继承的方法的时候要多走一步

<a id="markdown-8混搭式继承" name="8混搭式继承"></a>
## 8混搭式继承

```
function Student() {
    Person.call(this)
    }
(function () {
    var obj = Person.prototype
    for (var key in obj) {
      Student.prototype[key] = obj[key]
    }
})()
var s = new Student

```
此时在控制台中查看S里是这样

```
{
    name: 'person',
    age: 18,
    __proto__: Student.prototype {
      constructor: Student,
      eat: function () {},
      __proto__: Object.prototype
    }
}

```
> 优点： 属性原型都有了，没有多余的空环，constructor 直接指向自己

> 缺点： for in循环。然后就没有缺点~~~（因为是自创的hhh）