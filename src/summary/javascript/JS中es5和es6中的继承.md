

[ES5/ES6 的继承除了写法以外还有什么区别？](#es5es6-的继承除了写法以外还有什么区别)

[1. `class` 声明会提升，但不会初始化赋值。Foo 进入暂时性死区，类似于 let、const 声明变量。](#1-class-声明会提升但不会初始化赋值foo-进入暂时性死区类似于-letconst-声明变量)

[2. `class` 声明内部会启用严格模式。](#2-class-声明内部会启用严格模式)

[3.  `class` 的所有方法（包括静态方法和实例方法）都是不可枚举的。](#3--class-的所有方法包括静态方法和实例方法都是不可枚举的)

[4. `class` 的所有方法（包括静态方法和实例方法）都没有原型对象 prototype，所以也没有[[construct]]，不能使用 new 来调用](#4-class-的所有方法包括静态方法和实例方法都没有原型对象-prototype所以也没有construct不能使用-new-来调用)

[5. 必须使用 new 调用 class。](#5-必须使用-new-调用-class)

[6. class 内部无法重写类名](#6-class-内部无法重写类名)

[7. ES5 和 ES6 子类 this 生成顺序不同](#7-es5-和-es6-子类-this-生成顺序不同)

<a id="markdown-es5es6-的继承除了写法以外还有什么区别" name="es5es6-的继承除了写法以外还有什么区别"></a>
## ES5/ES6 的继承除了写法以外还有什么区别？ ##

<a id="markdown-1-class-声明会提升但不会初始化赋值foo-进入暂时性死区类似于-letconst-声明变量" name="1-class-声明会提升但不会初始化赋值foo-进入暂时性死区类似于-letconst-声明变量"></a>
#### 1. `class` 声明会提升，但不会初始化赋值。Foo 进入暂时性死区，类似于 let、const 声明变量。


	const bar = new Bar(); // it's ok
	function Bar(){
		this.bar = 22
	}

	const foo = new Foo(); // ReferenceError: Foo is not defined
	class Foo {
	  constructor() {
	    this.foo = 42;
	  }
	}


<a id="markdown-2-class-声明内部会启用严格模式" name="2-class-声明内部会启用严格模式"></a>
#### 2. `class` 声明内部会启用严格模式。
	
	
	// 引用一个未声明的变量

	function Bar() {
		baz = 42; // it's ok
	}
	const bar = new Bar();
	
	class Foo {
		constructor() {
			fol = 42; // ReferenceError: fol is not defined
		}
	}
	const foo = new Foo();


<a id="markdown-3--class-的所有方法包括静态方法和实例方法都是不可枚举的" name="3--class-的所有方法包括静态方法和实例方法都是不可枚举的"></a>
#### 3.  `class` 的所有方法（包括静态方法和实例方法）都是不可枚举的。


	function Bar () {
		this.bar = 42;
	}

	Bar.answer = function (){
		return 42;
	}

	Bar.prototype.print = function (){
		console.log(this.bar)
	}
	
	const barKeys = Object.keys(Bar); // ['answer']
	const barProtoKeys = Object.keys(Bar.prototype); // ['print']


	class Foo {
	  constructor() {
	    this.foo = 42;
	  }
	  static answer() {
	    return 42;
	  }
	  print() {
	    console.log(this.foo);
	  }
	}
	const fooKeys = Object.keys(Foo); // []
	const fooProtoKeys = Object.keys(Foo.prototype); // []


<a id="markdown-4-class-的所有方法包括静态方法和实例方法都没有原型对象-prototype所以也没有construct不能使用-new-来调用" name="4-class-的所有方法包括静态方法和实例方法都没有原型对象-prototype所以也没有construct不能使用-new-来调用"></a>
#### 4. `class` 的所有方法（包括静态方法和实例方法）都没有原型对象 prototype，所以也没有[[construct]]，不能使用 new 来调用

	function Bar () {
		this.bar = 42;
	}

	Bar.answer = function (){
		return 42;
	}

	Bar.prototype.print = function (){
		console.log(this.bar)
	}

	const bar = new Bar();
	const barPrint = new bar.print();  // it's ok

	class Foo {
	  constructor() {
	    this.foo = 42;
	  }
	  print() {
	    console.log(this.foo);
	  }
	}
	const foo = new Foo();
	const fooPrint = new foo.print(); // TypeError: foo.print is not a constructor


<a id="markdown-5-必须使用-new-调用-class" name="5-必须使用-new-调用-class"></a>
#### 5. 必须使用 new 调用 class。
	function Bar() {
	  this.bar = 42;
	}
	const bar = Bar(); // it's ok
	
	class Foo {
	  constructor() {
	    this.foo = 42;
	  }
	}
	const foo = Foo(); // TypeError: Class constructor Foo cannot be invoked without 'new'

<a id="markdown-6-class-内部无法重写类名" name="6-class-内部无法重写类名"></a>
#### 6. class 内部无法重写类名

	function Bar() {
	  Bar = 'Baz'; // it's ok
	  this.bar = 42;
	}
	const bar = new Bar();
	// Bar: 'Baz'
	// bar: Bar {bar: 42}  
	
	class Foo {
	  constructor() {
	    this.foo = 42;
	    Foo = 'Fol'; // TypeError: Assignment to constant variable
	  }
	}
	const foo = new Foo();
	Foo = 'Fol'; // it's ok

<a id="markdown-7-es5-和-es6-子类-this-生成顺序不同" name="7-es5-和-es6-子类-this-生成顺序不同"></a>
#### 7. ES5 和 ES6 子类 this 生成顺序不同

 ES5 的继承先生成了子类实例，再调用父类的构造函数修饰子类实例(实质是先创造子类的实例对象this，然后再将父类的方法添加到this上面（Parent.apply(this)）);

ES6 的继承先生成父类实例，再调用子类的构造函数修饰父类实例。这个差别使得 ES6 可以继承内置对象（实质是先将父类实例对象的属性和方法，加到this上面（所以必须先调用super方法），然后再用子类的构造函数修改this。）。

> ES5最常见的两种继承：原型链继承、构造函数继承

	// 定义父类
    function Parent(name) {
        this.name = name;
    }

    Parent.prototype.getName = function() {
        return this.name;
    };

    // 定义子类
    function Children() {
        this.age = 24;
    }

    // 通过Children的prototype属性和Parent进行关联继承

    Children.prototype = new Parent('陈先生');

    // Children.prototype.constructor === Parent.prototype.constructor = Parent

    var test = new Children();

    // test.constructor === Children.prototype.constructor === Parent

    test.age // 23
    test.getName(); // 陈先生

> ES6的继承

	class Father {
		constructor(name, age) {
			super(name, age);
			this.name = name;
			this.age = age;
		}
		show(){
			console.log(`我叫:${this.name}， 今年${this.age}岁`)
		}
	};
	
	// 通过extends关键字实现继承
    class Son extends Father {};

    let son = new Son('陈先生', 3000);
    
    son.show(); // 我叫陈先生 今年3000岁

ES6中新增了class关键字来定义类，通过保留的关键字extends实现了继承。实际上这些关键字只是一些语法糖，底层实现还是通过原型链之间的委托关联关系实现继承。


### ES6中 super关键字的作用：

super既可以当作函数使用，也可以当作对象使用。

#### 当作函数使用

```

	class A {}
	class B extends A {
	  constructor() {
	    super();  // ES6 要求，子类的构造函数必须执行一次 super 函数，否则会报错。
	  }
	}

```

在constructor 中必须调用super方法，因为子类没有自己的this 对象，而是继承父类的this对象，然后对其进行加工。
此时super虽然代表了父类A的构造函数，但是返回的是子类B的实例， 即super内部的this指向的是B，因此super（）在这里相当于"**a.prototype.constructor.call(this, props)**"

```
	class A {
	  constructor() {
	    console.log(new.target.name); // new.target 指向当前正在执行的函数
	  }
	}
	
	class B extends A {
	  constructor {
	    super();
	  }
	}

```

可以看到，在 super() 执行时，它指向的是 子类 B 的构造函数，而不是父类 A 的构造函数。也就是说，super() 内部的 this 指向的是 B


#### 当作对象使用

在普通方法中，指向父类的原型对象；在静态方法中，指向父类。

```

	class A {
	  c() {
	    return 2;
	  }
	}
	
	class B extends A {
	  constructor() {
	    super();
	    console.log(super.c()); // 2
	  }
	}
	
	let b = new B();

```

上面代码中，子类 B 当中的 super.c()，就是将 super 当作一个对象使用。这时，super 在普通方法之中，指向 A.prototype，所以 super.c() 就相当于 A.prototype.c()。


```

	class A {
	  constructor {
	    this.x = 1;
	  }
	}
	
	class B extends A {
	  constructor {
	    super();
	    this.x = 2;
	    super.x = 3;
	    console.log(super.x); // undefined
	    console.log(this.x); // 3
	  }
	}
	
	let b = new B();

```


上面代码中，super.x 赋值为 3，这时等同于对 this.x 赋值为 3。而当读取 super.x 的时候，调用的是 A.prototype.x，但并没有 x 方法，所以返回 undefined。