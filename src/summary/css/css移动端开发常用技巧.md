<!--
 * @Author: your name
 * @Date: 2020-06-08 10:42:53
 * @LastEditTime: 2020-06-08 18:30:52
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \serious-review\src\summary\css\css移动端.md
--> 
 [html](#html)
 
 [常用的meta属性设置](#常用的meta属性设置)
 
 [电话号码识别](#电话号码识别)
 
 [邮箱](#邮箱)
 
 [css](#css)
 
 [屏蔽用户选择](#屏蔽用户选择)
 
 [清除输入框内阴影](#清除输入框内阴影)
 
 [如何禁止保存或拷贝图像](#如何禁止保存或拷贝图像)
 
 [输入框默认字体颜色](#输入框默认字体颜色)
 
 [用户设置字号放大或者缩小导致页面布局错误](#用户设置字号放大或者缩小导致页面布局错误)
 
 [android系统中元素被点击时产生边框](#android系统中元素被点击时产生边框)
 
 [iOS 滑动不流畅](#ios-滑动不流畅)
 
 [js](#js)
 
 [移动端click屏幕产生200-300 ms的延迟响应](#移动端click屏幕产生200-300-ms的延迟响应)
 
 [iOS 上拉边界下拉出现空白](#ios-上拉边界下拉出现空白)
 
 [软键盘问题](#软键盘问题)
 
 [IOS 键盘弹起挡住原来的视图](#ios-键盘弹起挡住原来的视图)
 
 [onkeyUp 和 onKeydown 兼容性问题](#onkeyup-和-onkeydown-兼容性问题)
 
 [IOS12 输入框难以点击获取焦点，弹不出软键盘](#ios12-输入框难以点击获取焦点弹不出软键盘)
 
 [IOS 键盘收起时页面没用回落，底部会留白](#ios-键盘收起时页面没用回落底部会留白)
 
 [IOS 下 fixed 失效的原因](#ios-下-fixed-失效的原因)

#### 常用的meta属性设置

```
  
<meta name="screen-orientation" content="portrait"> //Android 禁止屏幕旋转
<meta name="full-screen" content="yes">             //全屏显示
<meta name="browsermode" content="application">     //UC应用模式，使用了application这种应用模式后，页面讲默认全屏，禁止长按菜单，禁止收拾，标准排版，以及强制图片显示。
<meta name="x5-orientation" content="portrait">     //QQ强制竖屏
<meta name="x5-fullscreen" content="true">          //QQ强制全屏
<meta name="x5-page-mode" content="app">            //QQ应用模式

```

#### 电话号码识别

开启

```
  <a href="tel:123456">123456</a>
```

关闭

```
  <meta name="format-detection" content="telephone=no" />

```

#### 邮箱

开启

```
  <a mailto:dooyoe@gmail.com">dooyoe@gmail.com</a>
```

关闭

```
  <meta content="email=no" name="format-detection" />
```


### css

#### 屏蔽用户选择

禁止用户选择页面中的文字或者图片

```
  div {
  -webkit-touch-callout: none;
  -webkit-user-select: none;
  -khtml-user-select: none;
  -moz-user-select: none;
  -ms-user-select: none;
  user-select: none;
}


```

#### 清除输入框内阴影

在 iOS 上，输入框默认有内部阴影,以这样关闭：

```

  div {
    -webkit-appearance: none;
  }


```

#### 如何禁止保存或拷贝图像

```
img {
  -webkit-touch-callout: none;
}

```

#### 输入框默认字体颜色

设置 input 里面 placeholder 字体的颜色

```
  input::-webkit-input-placeholder,
  textarea::-webkit-input-placeholder {
    color: #c7c7c7;
  }
  input:-moz-placeholder,
  textarea:-moz-placeholder {
    color: #c7c7c7;
  }
  input:-ms-input-placeholder,
  textarea:-ms-input-placeholder {
    color: #c7c7c7;
  }

```

#### 用户设置字号放大或者缩小导致页面布局错误

设置字体禁止缩放

```

  body {
    -webkit-text-size-adjust: 100% !important;
    text-size-adjust: 100% !important;
    -moz-text-size-adjust: 100% !important;
  }

```

#### android系统中元素被点击时产生边框

部分android系统点击一个链接，会出现一个边框或者半透明灰色遮罩, 不同生产商定义出来额效果不一样。去除代码如下

```
  a,button,input,textarea{
    -webkit-tap-highlight-color: rgba(0,0,0,0)
    -webkit-user-modify:read-write-plaintext-only; 
  }

```

#### iOS 滑动不流畅

ios 手机上下滑动页面会产生卡顿，手指离开页面，页面立即停止运动。整体表现就是滑动不流畅，没有滑动惯性。

解决方案

在滚动容器上增加滚动 touch 方法
```
.wrapper {
  -webkit-overflow-scrolling: touch;
}


```

### js

#### 移动端click屏幕产生200-300 ms的延迟响应

- fastclick可以解决在手机上点击事件的300ms延迟;
- zepto的touch模块，tap事件也是为了解决在click的延迟问题;

触摸事件的响应顺序

ontouchstart

ontouchmove

ontouchend

onclick

#### iOS 上拉边界下拉出现空白

手指按住屏幕下拉，屏幕顶部会多出一块白色区域。手指按住屏幕上拉，底部多出一块白色区域。

在 iOS 中，手指按住屏幕上下拖动，会触发 touchmove 事件。这个事件触发的对象是整个 webview 容器，容器自然会被拖动，剩下的部分会成空白。

解决方案:

```
  document.body.addEventListener(
    'touchmove',
    function(e) {
      if (e._isScroller) return
      // 阻止默认事件
      e.preventDefault()
    },
    {
      passive: false
    }
  )
```

### 软键盘问题

#### IOS 键盘弹起挡住原来的视图

- 可以通过监听移动端软键盘弹起,Element.scrollIntoViewIfNeeded（Boolean）方法用来将不在浏览器窗口的可见区域内的元素滚动到浏览器窗口的可见区域。 如果该元素已经在浏览器窗口的可见区域内，则不会发生滚动。

- true，则元素将在其所在滚动区的可视区域中居中对齐。

- false，则元素将与其所在滚动区的可视区域最近的边缘对齐。 根据可见区域最靠近元素的哪个边缘，元素的顶部将与可见区域的顶部边缘对准，或者元素的底部边缘将与可见区域的底部边缘对准。

```
  window.addEventListener('resize', function() {
    if (
      document.activeElement.tagName === 'INPUT' ||
      document.activeElement.tagName === 'TEXTAREA'
    ) {
      window.setTimeout(function() {
        if ('scrollIntoView' in document.activeElement) {
          document.activeElement.scrollIntoView(false)
        } else {
          document.activeElement.scrollIntoViewIfNeeded(false)
        }
      }, 0)
    }
  })

```

#### onkeyUp 和 onKeydown 兼容性问题

IOS 中 input 键盘事件 keyup、keydown、等支持不是很好, 用 input 监听键盘 keyup 事件，在安卓手机浏览器中没有问题，但是在 ios 手机浏览器中用输入法输入之后，并未立刻相应 keyup 事件


#### IOS12 输入框难以点击获取焦点，弹不出软键盘

定位找到问题是 fastclick.js 对 IOS12 的兼容性，可在 fastclick.js 源码或者 main.js 做以下修改

```
  FastClick.prototype.focus = function(targetElement) {
    var length
    if (
      deviceIsIOS &&
      targetElement.setSelectionRange &&
      targetElement.type.indexOf('date') !== 0 &&
      targetElement.type !== 'time' &&
      targetElement.type !== 'month'
    ) {
      length = targetElement.value.length
      targetElement.setSelectionRange(length, length)
      targetElement.focus()
    } else {
      targetElement.focus()
    }
  }


```

#### IOS 键盘收起时页面没用回落，底部会留白

通过监听键盘回落时间滚动到原来的位置

```
  window.addEventListener('focusout', function() {
    window.scrollTo(0, 0)
  })

  //input输入框弹起软键盘的解决方案。
  var bfscrolltop = document.body.scrollTop
  $('input')
    .focus(function() {
      document.body.scrollTop = document.body.scrollHeight
      //console.log(document.body.scrollTop);
    })
    .blur(function() {
      document.body.scrollTop = bfscrolltop
      //console.log(document.body.scrollTop);
    })


```

#### IOS 下 fixed 失效的原因

软键盘唤起后，页面的 fixed 元素将失效，变成了 absolute，所以当页面超过一屏且滚动时，失效的 fixed 元素就会跟随滚动了。不仅限于 type=text 的输入框，凡是软键盘（比如时间日期选择、select 选择等等）被唤起，都会遇到同样地问题。


解决方法: 不让页面滚动，而是让主体部分自己滚动,主体部分高度设为 100%，overflow:scroll

```
  <body>
    <div class='warper'>
      <div class='main'></div>
    <div>
    <div class="fix-bottom"></div>
  </body>

```

```
  .warper {
    position: absolute;
    width: 100%;
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    overflow-y: scroll;
    -webkit-overflow-scrolling: touch; /* 解决ios滑动不流畅问题 */
  }
  .fix-bottom {
    position: fixed;
    bottom: 0;
    width: 100%;
  }

```