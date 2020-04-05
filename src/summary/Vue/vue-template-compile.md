<!--
 * @Author: Luisa Xiao
 * @Date: 2020-04-05 17:43:38
 * @LastEditTime: 2020-04-05 20:33:35
 * @LastEditors: Please set LastEditors
 * @Description: 通过源码了解vue编译template的过程
 * @FilePath: /serious-review/src/summary/Vue/vue-template-compile.md
 -->


首先来了解下vue的渲染过程；

### new Vue()后发生了什么？
我们先来看下流程图

[!images](https://raw.githubusercontent.com/SunnyXiao/serious-review/master/src/images/vue-template-compile.jpg)

由图可知vue通过compile方法，经过parse、optimize和generate方法，最好生成render function， 如下图所示：

[!images](https://raw.githubusercontent.com/SunnyXiao/serious-review/master/src/images/vue-template-render-fn.png)

#### parse

parse函数的作用就是把字符串型的template转化为AST结构,通过截取字符串来生成AST，具体截取原理：

> 通过html.indexOf('<')的值,来确定我们是要截取标签还是文本.

- 等于0：代表这是注释、条件注释、doctype、开始标签、结束标签中的某一种。
- 大于等于0：代表是文本、表达式。
- 小于0: 代表html标签解析完了，可能会剩下一些文本、表达式。

> 如果html.indexOf('<') == 0

1. 进行正则匹配看是否为开始标签、结束标签、注释、条件注释、doctype中的一种。
2. 若是开始标签，则截取对应的开始标签，并定义ast的基本结构，并且解析标签上带的属性(attrs, tagName)、指令等等。
3. 在解析html string的时候，vue还维护stack，用来标记DOM的深度，stack里的最后一项，永远是当前正在解析的元素的parentNode。
4. 若是结束标签，则需要通过这个结束标签的tagName从后到前匹配stack中每一项的tagName,将匹配到的那一项之后的所有项全部删除，表示这一段已经解析完成。
5. 若不是以上5种中的一种，则表示他是文本

所使用到的正则如下：

```

  // Regular Expressions for parsing tags and attributes
  const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
  const dynamicArgAttribute = /^\s*((?:v-[\w-]+:|@|:|#)\[[^=]+\][^\s"'<>\/=]*)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/
  const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z${unicodeRegExp.source}]*`
  const qnameCapture = `((?:${ncname}\\:)?${ncname})`
  const startTagOpen = new RegExp(`^<${qnameCapture}`)
  const startTagClose = /^\s*(\/?)>/
  const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`)
  const doctype = /^<!DOCTYPE [^>]+>/i
  // #7298: escape - to avoid being passed as HTML comment when inlined in page
  const comment = /^<!\--/
  const conditionalComment = /^<!\[/

```

> 如果html.indexOf('<') >= 0

1. 此时，它会判断它的剩余部分是否符合标签的格式，
2. 如果不符合，则继续再剩余部分判断’<'的位置，并继续1的判断，直到剩余部分有符合标签的格式出现。

```

      let text, rest, next
      if (textEnd >= 0) {
        rest = html.slice(textEnd)
        while (
          !endTag.test(rest) &&
          !startTagOpen.test(rest) &&
          !comment.test(rest) &&
          !conditionalComment.test(rest)
        ) {
          // < in plain text, be forgiving and treat it as text
          next = rest.indexOf('<', 1)
          if (next < 0) break
          textEnd += next
          rest = html.slice(textEnd)
        }
        text = html.substring(0, textEnd)
      }
      
```
关于文本的截取一般分为2种；

- 静态文本，如： 测试</div>
- 带有表达式的文本， 如： 你好{{name}}</div>

如果文本种含有表达式，则需要通过parseText对文本中的变量进行解析。

```

  const  expression = parseText(value,delimiters)  // 对变量解析 {{name}} => _s(name)

  child = {
    type: 2,
    expression: res.expression,
    tokens: res.tokens,
    text
  }

```

#### optimize优化

optimize的作用主要是对生成的AST进行静态内容的优化，标记静态节点。所谓静态内容，指的是和数据没有关系，不需要每次都更新的内容。
标记静态节点的作用的作用是为了之后dom diff时，是否需要patch，diff算法会直接跳过静态节点，从而减少了比较的过程，优化了patch的性能。

- 如果是表达式AST节点，直接返回 false
- 如果是文本AST节点，直接返回 true
- 如果元素是元素节点，阶段有 v-pre 指令 ||
  1. 没有任何指令、数据绑定、事件绑定等 &&
  2. 没有 v-if 和 v-for &&
  3. 不是 slot 和 component &&
  4. 是 HTML 保留标签 &&
  5. 不是 template 标签的直接子元素并且没有包含在 for 循环中
  则返回 true


```

  node.static = isStatic(node)

  function isStatic (node: ASTNode): boolean {
    if (node.type === 2) { // expression
      return false
    }
    if (node.type === 3) { // text
      return true
    }
    return !!(node.pre || (
      !node.hasBindings && // no dynamic bindings
      !node.if && !node.for && // not v-if or v-for or v-else
      !isBuiltInTag(node.tag) && // not a built-in
      isPlatformReservedTag(node.tag) && // not a component
      !isDirectChildOfTemplateFor(node) &&
      Object.keys(node).every(isStaticKey)
    ))
  }

```

简单来说，没有使用vue独有的语法的节点就可以称为静态节点;

判断一个父级元素是静态节点，则需要判断它的所有子节点都是静态节点，否则就不是静态节点


#### generate生成render函数

generate是将AST转化成render funtion字符串的过程，他递归了AST，得到结果是render的字符串。

render函数的就是返回一个_c(‘tagName’,data,children)的方法


```

  // compile/codegen/index.js
  genElement: 用来生成基本的render结构或者叫createElement结构

  genData: 处理ast结构上的一些属性，用来生成data

  genChildren:处理ast的children,并在内部调用genElement,形成子元素的_c()方法

```

看上面图二可知，render字符串内部有几种方法

- _c：对应的是 createElement 方法，顾名思义，它的含义是创建一个元素(Vnode)
- _v：创建一个文本结点。
- _s：把一个值转换为字符串。（eg: {{data}}）
- _m：渲染静态内容

总结
vue template模板编译的过程经过parse()生成ast(抽象语法树),optimize对静态节点优化，generate()生成render字符串

之后调用new Watcher()函数，用来监听数据的变化，render 函数就是数据监听的回调所调用的，其结果便是重新生成 vnode。

当这个 render 函数字符串在第一次 mount、或者绑定的数据更新的时候，都会被调用，生成 Vnode。

如果是数据的更新，那么 Vnode 会与数据改变之前的 Vnode 做 diff，对内容做改动之后，就会更新到我们真正的 DOM

参考：

原文链接：https://blog.csdn.net/wang729506596/java/article/details/90947583