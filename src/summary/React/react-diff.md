<!--
 * @Author: luisa xiao
 * @Date: 2020-02-21 12:26:54
 * @Description: learn react diff
 * @FilePath: /serious-review/src/summary/React/react-diff.md
 -->
## React diff算法学习

### 调和？

将 virtual Dom 树转换成actual Dom树的最少操作的过程称为“调和”， diff算法是调和的具体实现

### diff算法的策略

<h4>tree diff</h4>
Web UI中DOM节点跨层级的移动操作特别少，可以忽略不计。


<h4>component diff</h4>
拥有相同类的两个组件 生成相似的树形结构，

拥有不同类的两个组件 生成不同的树形结构。

<h4>element diff</h4>

对于同一层级的一组子节点，通过唯一id区分。

![images](https://raw.githubusercontent.com/SunnyXiao/serious-review/master/src/summary/React/imgs/react-diff.png)

<h4>tree diff</h4>

* React通过updateDepth对Virtual DOM树进行层级控制。
* 对树分层比较，两棵树 只对同一层次节点 进行比较。如果该节点不存在时，则该节点及其子节点会被完全删除，不会再进一步比较。

* 只需遍历一次，就能完成整棵DOM树的比较。
* 如果DOM节点出现了跨层级操作, 只有创建节点和删除节点的操作。



#### 不同节点类型的比较

为了在树之间进行比较，我们首先要能够比较俩个节点，节点不同分为俩中情况：(1) 节点类型不同， （2）节点类型相同，节点属性不同。如：

```
  renderA: <div />
  renderB: <span />

  => [removeNode <div />], [insertNode <span />]
```

当一个节点从div变成span的时候，简单的直接删除div，然后插入插入一个新的span节点

以上对虚拟DOM节点的操作，同样也用于React组件的比较，如：
```
  renderA: <Header />
  renderB: <Content />

  => [removeNode <Header />], [insertNode <Content />]
```


### Virvual Dom 的结构

可分为三种： 文本、组件以及原声DOM节点

```
  // 原声DOM节点
  {
    tag: 'div',
    attrs: {
      className: 'container'
    },
    children: [],
    key: null
  }

  // 组件 vnode

  {
    tag: 'ComponentConstructor'
    attrs: {
      className: 'container'
    },
    children[],
    key: null
  }

  // 文本vnode
  "hello god"

```

#### 文本节点

react 源码中首先考虑的是文本节点， 若当前dom是文本节点，则直接更新内容，否则新建一个文本节点，并删除原来的dom

#### 非文本节点
先判断dom的类型是否相同，若不同采用 不同节点类型的比较 ， 若相同，只需要等待后面对比属性和对比子节点。

#### 对比属性

 diff算法不仅找出节点类型的对比，还要找出节点的属性及事件监听的变化：

 如果原来的属性不在新的属性当中，则将其移除掉（属性值设置为undefined）

#### 对比子节点

由于子节点是一个数组，它可能改变了顺序或者数量有所变化，我们很难确定和virtual dom对比哪个，
为了简化逻辑，用递归的模式进行对比，将有key值和没有key的节点分开

若是没有key的dom，需要去寻找相应的节点，再进行diff算法。

#### 对比组件

如果组件类型没有变化，则重新set props

如果组件类型变化了， 则移除原来的组件，并渲染新的组件
