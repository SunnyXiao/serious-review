状态管理
--------

状态管理库，无论是Redux，还是Mobx这些，其本质都是为了解决状态管理混乱，无法有效同步的问题，它们都支持：

1. 统一维护管理应用状态；
2. 某一状态只有一个可信数据来源（通常命名为store）；
3. 操作更新状态方式统一，并且可控（通常以action方式提供更新状态的途径）；
4. 支持将store与React组件连接，如react-redux，mobx-react；通常使用状态管理库后，我们将React组件从业务上划分为两类：

	- 容器组件（Container Components）：负责处理具体业务和状态数据，将业务或状态处理函数传入展示型组件；
	- 展示型组件（Presentation Components）：负责展示视图，视图交互回调内调用传入的处理函数；


Redux
-------

1. Action：一个JavaScript对象，描述动作相关信息，主要包含type属性和payload属性：
	- type：action 类型；
	- payload：负载数据；

2. Reducer：定义应用状态如何响应不同动作（action），如何更新状态；
3. Store：管理action和reducer及其关系的对象，主要提供以下功能：

	- 维护应用状态并支持访问状态（getState()）；
	- 支持监听action的分发，更新状态（dispatch(action)）；
	- 支持订阅store的变更（subscribe(listener)）；

4. 异步流：由于Redux所有对store状态的变更，都应该通过action触发，异步任务（通常都是业务或获取数据任务）也不例外，而为了不将业务或数据相关的任务混入React组件中，就需要使用其他框架配合管理异步任务流程，如`redux-thunk`，`redux-saga`等；


MobX
------
Mobx是一个透明函数响应式编程（Transparently Functional Reactive Programming，TFRP）的状态管理库，它使得状态管理简单可伸缩：

1. Action：定义改变状态的动作函数，包括如何变更状态；

2. Store：集中管理模块状态（State）和动作（action）；

3. Derivation（衍生）：从应用状态中派生而出，且没有任何其他影响的数据，我们称为derivation（衍生），衍生在以下情况下存在：

	1. 用户界面；
	
	2. 衍生数据；
	
	 	衍生主要有两种：

		1. Computed Values（计算值）：计算值总是可以使用纯函数（pure function）从当前可观察状态中获取；
		2. Reactions（反应）：反应指状态变更时需要自动发生的副作用，这种情况下，我们需要实现其读写操作；

区别
-------

#### 函数式和面向对象
Redux更多的是遵循函数式编程（Functional Programming, FP）思想，而Mobx则更多从面相对象角度考虑问题。

Redux提倡编写函数式代码，如reducer就是一个纯函数（pure function）

	(state, action) => {
	  return Object.assign({}, state, {
	    ...
	  })
	}

Mobx设计更多偏向于面向对象编程（OOP）和响应式编程（Reactive Programming），通常将状态包装成可观察对象，于是我们就可以使用可观察对象的所有能力，一旦状态对象变更，就能自动获得更新。


#### 单一store和多store

在redux应用中，我们总是将所有共享的应用数据集中在一个大的store中，
而mobx则通常按模块将应用状态划分，在多个独立的store中管理。


#### JavaScript对象和可观察对象
Redux默认以JavaScript原生对象形式存储数据，而Mobx使用可观察对象：

1. Redux需要手动追踪所有状态对象的变更；
2. Mobx中可以监听可观察对象，当其变更时将自动触发监听；

#### 不可变（Immutable）和可变（Mutable）
Redux状态对象通常是不可变的（Immutable）：

	switch (action.type) {
	  case REQUEST_POST:
	  	return Object.assign({}, state, {
	      post: action.payload.post
	  	});
	  default:
	    retur nstate;
	}
我们不能直接操作状态对象，而总是在原来状态对象基础上返回一个新的状态对象，这样就能很方便的返回应用上一状态；而Mobx中可以直接使用新值更新状态对象。


mobx-react和react-redux
--------

使用Redux和React应用连接时，需要使用react-redux提供的Provider和connect：

`Provider`：负责将Store注入React应用；

`connect`：负责将store state注入容器组件，并选择特定状态作为容器组件props传递；


对于Mobx而言，同样需要两个步骤：

`Provider`：使用mobx-react提供的Provider将所有stores注入应用；

使用`inject`将特定store注入某组件，store可以传递状态或action；然后使用observer保证组件能响应store中的可观察对象（observable）变更，即store更新，组件视图响应式更新。


选择Mobx的原因
---------

1. 学习成本少： Mobx基础知识很简单，学习了半小时官方文档和示例代码就搭建了新项目实例； 而Redux确较繁琐，流程较多，需要配置，创建store，编写reducer，action，如果涉及异步任务，还需要引入redux-thunk或redux-saga编写额外代码，Mobx流程相比就简单很多，并且不需要额外异步处理库；


2. 面向对象编程： Mobx支持面向对象编程，我们可以使用`@observable` and `@observer`，以面向对象编程方式使得JavaScript对象具有响应式能力；而Redux最推荐遵循函数式编程，当然Mobx也支持函数式编程；


3. 模版代码少：相对于Redux的各种模版代码，如，actionCreater，reducer，saga／thunk等，Mobx则不需要编写这类模板代码；


不选择Mobx的可能原因
------

1. 过于自由：Mobx提供的约定及模版代码很少，这导致开发代码编写很自由，如果不做一些约定，比较容易导致团队代码风格不统一，所以当团队成员较多时，确实需要添加一些约定；


2. 可拓展，可维护性：也许你会担心Mobx能不能适应后期项目发展壮大呢？确实Mobx更适合用在中小型项目中，但这并不表示其不能支撑大型项目，关键在于大型项目通常需要特别注意可拓展性，可维护性，相比而言，规范的Redux更有优势，而Mobx更自由，需要我们自己制定一些规则来确保项目后期拓展，维护难易程度；

