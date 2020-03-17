<!--
 * @Author:luisa xiao
 * @Date: 2020-02-14 23:15:01
 * @LastEditTime: 2020-03-16 18:38:57
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: /serious-review/src/summary/Vue/vue-diff-virtual-dom.md
 -->

待续.........

[virtual DOM和真实DOM的区别？](#virtual-dom和真实dom的区别)

[patch](#patch)

[sameVnode](#samevnode)

[patchVnode](#patchvnode)

[updateChildren](#updatechildren)

## virtual DOM和真实DOM的区别？
virtual DOM是将真实的DOM的数据抽取出来，以对象的形式模拟树形结构。比如dom是这样的：

    <div>
        <p>123</p>
    </div>

对应的virtual DOM（伪代码）：

    var Vnode = {
        tag: 'div',
        children: [
            { tag: 'p', text: '123' }
        ]
    };


Vue通过数据绑定来修改视图，当某个数据被修改的时候，set方法会让闭包中的Dep调用notify通知所有订阅者Watcher，Watcher通过get方法执行vm._update(vm._render(), hydrating)。

``` html
	Vue.prototype._update = function (vnode: VNode, hydrating?: boolean) {
	    const vm: Component = this
	    /*如果已经该组件已经挂载过了则代表进入这个步骤是个更新的过程，触发beforeUpdate钩子*/
	    if (vm._isMounted) {
	      callHook(vm, 'beforeUpdate')
	    }
	    const prevEl = vm.$el
	    const prevVnode = vm._vnode
	    const prevActiveInstance = activeInstance
	    activeInstance = vm
	    vm._vnode = vnode
	    // Vue.prototype.__patch__ is injected in entry points
	    // based on the rendering backend used.
	    /*基于后端渲染Vue.prototype.__patch__被用来作为一个入口*/
	    if (!prevVnode) {
	      // initial render
	      vm.$el = vm.__patch__(
	        vm.$el, vnode, hydrating, false /* removeOnly */,
	        vm.$options._parentElm,
	        vm.$options._refElm
	      )
	    } else {
	      // updates
	      vm.$el = vm.__patch__(prevVnode, vnode)
	    }
	    activeInstance = prevActiveInstance
	    // update __vue__ reference
	    /*更新新的实例对象的__vue__*/
	    if (prevEl) {
	      prevEl.__vue__ = null
	    }
	    if (vm.$el) {
	      vm.$el.__vue__ = vm
	    }
	    // if parent is an HOC, update its $el as well
	    if (vm.$vnode && vm.$parent && vm.$vnode === vm.$parent._vnode) {
	      vm.$parent.$el = vm.$el
	    }
	    // updated hook is called by the scheduler to ensure that children are
	    // updated in a parent's updated hook.
	  }
```

update方法的第一个参数是一个VNode对象，在内部会将该VNode对象与之前旧的VNode对象进行__patch_。

## patch ##
---

patch将新老VNode节点进行比对，根据俩者的比较结果进行最小单位的修改视图，patch的核心就是diff算法。

diff算法是通过同层的树节点进行比较而非对树进行逐层搜索遍历的方式，所以时间复杂度只有O(n)
	
	/*createPatchFunction的返回值，一个patch函数*/
	  return function patch (oldVnode, vnode, hydrating, removeOnly, parentElm, refElm) {
	    /*vnode不存在则直接调用销毁钩子*/
	    if (isUndef(vnode)) {
	      if (isDef(oldVnode)) invokeDestroyHook(oldVnode)
	      return
	    }
	
	    let isInitialPatch = false
	    const insertedVnodeQueue = []
	
	    if (isUndef(oldVnode)) {
	      // empty mount (likely as component), create new root element
	      /*oldVnode未定义的时候，其实也就是root节点，创建一个新的节点*/
	      isInitialPatch = true
	      createElm(vnode, insertedVnodeQueue, parentElm, refElm)
	    } else {
	      /*标记旧的VNode是否有nodeType*/
	      /*Github:https://github.com/answershuto*/
	      const isRealElement = isDef(oldVnode.nodeType)
	      if (!isRealElement && sameVnode(oldVnode, vnode)) {
	        // patch existing root node
	        /*是同一个节点的时候直接修改现有的节点*/
	        patchVnode(oldVnode, vnode, insertedVnodeQueue, removeOnly)
	      } else {
	        if (isRealElement) {
	          // mounting to a real element
	          // check if this is server-rendered content and if we can perform
	          // a successful hydration.
	          if (oldVnode.nodeType === 1 && oldVnode.hasAttribute(SSR_ATTR)) {
	            /*当旧的VNode是服务端渲染的元素，hydrating记为true*/
	            oldVnode.removeAttribute(SSR_ATTR)
	            hydrating = true
	          }
	          if (isTrue(hydrating)) {
	            /*需要合并到真实DOM上*/
	            if (hydrate(oldVnode, vnode, insertedVnodeQueue)) {
	              /*调用insert钩子*/
	              invokeInsertHook(vnode, insertedVnodeQueue, true)
	              return oldVnode
	            } else if (process.env.NODE_ENV !== 'production') {
	              warn(
	                'The client-side rendered virtual DOM tree is not matching ' +
	                'server-rendered content. This is likely caused by incorrect ' +
	                'HTML markup, for example nesting block-level elements inside ' +
	                '<p>, or missing <tbody>. Bailing hydration and performing ' +
	                'full client-side render.'
	              )
	            }
	          }
	          // either not server-rendered, or hydration failed.
	          // create an empty node and replace it
	          /*如果不是服务端渲染或者合并到真实DOM失败，则创建一个空的VNode节点替换它*/
	          oldVnode = emptyNodeAt(oldVnode)
	        }
	        // replacing existing element
	        /*取代现有元素*/
	        const oldElm = oldVnode.elm
	        const parentElm = nodeOps.parentNode(oldElm)
	        createElm(
	          vnode,
	          insertedVnodeQueue,
	          // extremely rare edge case: do not insert if old element is in a
	          // leaving transition. Only happens when combining transition +
	          // keep-alive + HOCs. (#4590)
	          oldElm._leaveCb ? null : parentElm,
	          nodeOps.nextSibling(oldElm)
	        )
	
	        if (isDef(vnode.parent)) {
	          // component root element replaced.
	          // update parent placeholder node element, recursively
	          /*组件根节点被替换，遍历更新父节点element*/
	          let ancestor = vnode.parent
	          while (ancestor) {
	            ancestor.elm = vnode.elm
	            ancestor = ancestor.parent
	          }
	          if (isPatchable(vnode)) {
	            /*调用create回调*/
	            for (let i = 0; i < cbs.create.length; ++i) {
	              cbs.create[i](emptyNode, vnode.parent)
	            }
	          }
	        }
	
	        if (isDef(parentElm)) {
	          /*移除老节点*/
	          removeVnodes(parentElm, [oldVnode], 0, 0)
	        } else if (isDef(oldVnode.tag)) {
	          /*Github:https://github.com/answershuto*/
	          /*调用destroy钩子*/
	          invokeDestroyHook(oldVnode)
	        }
	      }
	    }
	
	    /*调用insert钩子*/
	    invokeInsertHook(vnode, insertedVnodeQueue, isInitialPatch)
	    return vnode.elm
	  }


## sameVnode ##

	/*
	  判断两个VNode节点是否是同一个节点，需要满足以下条件
	  key相同
	  tag（当前节点的标签名）相同
	  isComment（是否为注释节点）相同
	  是否data（当前节点对应的对象，包含了具体的一些数据信息，是一个VNodeData类型，可以参考VNodeData类型中的数据信息）都有定义
	  当标签是<input>的时候，type必须相同
	*/
	function sameVnode (a, b) {
	  return (
	    a.key === b.key &&
	    a.tag === b.tag &&
	    a.isComment === b.isComment &&
	    isDef(a.data) === isDef(b.data) &&
	    sameInputType(a, b)
	  )
	}
	
	// Some browsers do not support dynamically changing type for <input>
	// so they need to be treated as different nodes
	/*
	  判断当标签是<input>的时候，type是否相同
	  某些浏览器不支持动态修改<input>类型，所以他们被视为不同节点
	*/
	function sameInputType (a, b) {
	  if (a.tag !== 'input') return true
	  let i
	  const typeA = isDef(i = a.data) && isDef(i = i.attrs) && i.type
	  const typeB = isDef(i = b.data) && isDef(i = i.attrs) && i.type
	  return typeA === typeB
	}

当两个VNode的tag、key、isComment都相同，并且同时定义或未定义data的时候，且如果标签为input则type必须相同。这时候这两个VNode则算sameVnode，可以直接进行patchVnode操作。


### patchVnode

patchVnode的规则如下：

- 如果新旧VNode都是静态的，同时它们的key相同（代表同一节点），并且新的VNode是clone或者是标记了once（标记v-once属性，只渲染一次），那么只需要替换elm以及componentInstance即可。
- .新老节点均有children子节点，则对子节点进行diff操作，调用updateChildren，这个updateChildren也是diff的核心。
- 如果老节点没有子节点而新节点存在子节点，先清空老节点DOM的文本内容，然后为当前DOM节点加入子节点。
- .当新节点没有子节点而老节点有子节点的时候，则移除该DOM节点的所有子节点。
- 当新老节点都无子节点的时候，只是文本的替换。

```

	 /*patch VNode节点*/
	  function patchVnode (oldVnode, vnode, insertedVnodeQueue, removeOnly) {
	    /*两个VNode节点相同则直接返回*/
	    if (oldVnode === vnode) {
	      return
	    }
	    // reuse element for static trees.
	    // note we only do this if the vnode is cloned -
	    // if the new node is not cloned it means the render functions have been
	    // reset by the hot-reload-api and we need to do a proper re-render.
	    /*
	      如果新旧VNode都是静态的，同时它们的key相同（代表同一节点），
	      并且新的VNode是clone或者是标记了once（标记v-once属性，只渲染一次），
	      那么只需要替换elm以及componentInstance即可。
	    */
	    if (isTrue(vnode.isStatic) &&
	        isTrue(oldVnode.isStatic) &&
	        vnode.key === oldVnode.key &&
	        (isTrue(vnode.isCloned) || isTrue(vnode.isOnce))) {
	      vnode.elm = oldVnode.elm
	      vnode.componentInstance = oldVnode.componentInstance
	      return
	    }
	    let i
	    const data = vnode.data
	    if (isDef(data) && isDef(i = data.hook) && isDef(i = i.prepatch)) {
	      /*i = data.hook.prepatch，如果存在的话，见"./create-component componentVNodeHooks"。*/
	      i(oldVnode, vnode)
	    }
	    const elm = vnode.elm = oldVnode.elm
	    const oldCh = oldVnode.children
	    const ch = vnode.children
	    if (isDef(data) && isPatchable(vnode)) {
	      /*调用update回调以及update钩子*/
	      for (i = 0; i < cbs.update.length; ++i) cbs.update[i](oldVnode, vnode)
	      if (isDef(i = data.hook) && isDef(i = i.update)) i(oldVnode, vnode)
	    }
	    /*如果这个VNode节点没有text文本时*/
	    if (isUndef(vnode.text)) {
	      if (isDef(oldCh) && isDef(ch)) {
	        /*新老节点均有children子节点，则对子节点进行diff操作，调用updateChildren*/
	        if (oldCh !== ch) updateChildren(elm, oldCh, ch, insertedVnodeQueue, removeOnly)
	      } else if (isDef(ch)) {
	        /*如果老节点没有子节点而新节点存在子节点，先清空elm的文本内容，然后为当前节点加入子节点*/
	        if (isDef(oldVnode.text)) nodeOps.setTextContent(elm, '')
	        addVnodes(elm, null, ch, 0, ch.length - 1, insertedVnodeQueue)
	      } else if (isDef(oldCh)) {
	        /*当新节点没有子节点而老节点有子节点的时候，则移除所有ele的子节点*/
	        removeVnodes(elm, oldCh, 0, oldCh.length - 1)
	      } else if (isDef(oldVnode.text)) {
	        /*当新老节点都无子节点的时候，只是文本的替换，因为这个逻辑中新节点text不存在，所以直接去除ele的文本*/
	        nodeOps.setTextContent(elm, '')
	      }
	    } else if (oldVnode.text !== vnode.text) {
	      /*当新老节点text不一样时，直接替换这段文本*/
	      nodeOps.setTextContent(elm, vnode.text)
	    }
	    /*调用postpatch钩子*/
	    if (isDef(data)) {
	      if (isDef(i = data.hook) && isDef(i = i.postpatch)) i(oldVnode, vnode)
	    }
	  }

```

### updateChildren ###

首先，在新老两个VNode节点的左右头尾两侧都有一个变量标记，在遍历过程中这几个变量都会向中间靠拢。当oldStartIdx > oldEndIdx或者newStartIdx > newEndIdx时结束循环。

在遍历中，如果存在key，并且满足sameVnode，会将该DOM节点进行复用，否则则会创建一个新的DOM节点。

首先，oldStartVnode、oldEndVnode与newStartVnode、newEndVnode两两比较一共有2*2=4种比较方法。

1. 当新老VNode节点的start或者end满足sameVnode时，也就是sameVnode(oldStartVnode, newStartVnode)或者sameVnode(oldEndVnode, newEndVnode)，直接将该VNode节点进行patchVnode即可。

2. 如果oldStartVnode与newEndVnode满足sameVnode，即sameVnode(oldStartVnode, newEndVnode)。这时候说明oldStartVnode已经跑到了oldEndVnode后面去了，进行patchVnode的同时还需要将真实DOM节点移动到oldEndVnode的后面。

3. 如果oldEndVnode与newStartVnode满足sameVnode,这说明oldEndVnode跑到了oldStartVnode的前面，进行patchVnode的同时真实的DOM节点移动到了oldStartVnode的前面。

4. 如果以上情况均不符合，则通过createKeyToOldIdx会得到一个oldKeyToIdx，里面存放了一个key为旧的VNode，value为对应index序列的哈希表。从这个哈希表中可以找到是否有与newStartVnode一致key的旧的VNode节点，如果同时满足sameVnode，patchVnode的同时会将这个真实DOM（elmToMove）移动到oldStartVnode对应的真实DOM的前面。当然也有可能newStartVnode在旧的VNode节点找不到一致的key，或者是即便key相同却不是sameVnode，这个时候会调用createElm创建一个新的DOM节点。


1.当结束时oldStartIdx > oldEndIdx，这个时候老的VNode节点已经遍历完了，但是新的节点还没有。说明了新的VNode节点实际上比老的VNode节点多，也就是比真实DOM多，需要将剩下的（也就是新增的）VNode节点插入到真实DOM节点中去，此时调用addVnodes（批量调用createElm的接口将这些节点加入到真实DOM中去）。


2。同理，当newStartIdx > newEndIdx时，新的VNode节点已经遍历完了，但是老的节点还有剩余，说明真实DOM节点多余了，需要从文档中删除，这时候调用removeVnodes将这些多余的真实DOM删除。

