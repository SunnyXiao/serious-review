<!--
 * @Author:https://zhuanlan.zhihu.com/p/114257330?utm_source=wechat_session&utm_medium=social&utm_oi=986241487784529920
 * @Date: 2020-03-25 10:30:45
 * @LastEditTime: 2020-03-25 11:17:20
 * @LastEditors: Please set LastEditors
 * @Description:104道 CSS 面试题，助你查漏补缺
 * @FilePath: \rmportale:\workspace\My projects\serious-review\src\summary\css\css查漏补缺.md
 -->

### 1.介绍一下标准的 CSS 的盒子模型？低版本 IE 的盒子模型有什么不同的？ ###

知识点： 

    （1）俩种盒子模型： IE和模型(border-box)、W3C标准盒模型(content-box);
     (2) 盒模型： 分为内容(content)、填充、边界、边框四个部分;
    
    
    IE盒模型和W3C标准盒模型的区别：
    
    （1）W3C标准盒模型：属性width，height只包含内容content，不包含border和padding
    （2）IE盒模型：属性width，height包含content、border和padding，指的是content +padding+border。

	若在页面中声明了DOCTYPE类型，所有的浏览器都会把盒模型解释为W3C盒模型。

### 2.CSS 选择符有哪些？

    (1) id选择器
    (2) 类选择器
    (3) 标签选择器
    (4) 后代选择器（h1p）
    (5) 相邻后代选择器（子）选择器（ul>li）
    (6) 兄弟选择器（li~a）
    (7) 相邻兄弟选择器（li+a）
    (8) 属性选择器（a[rel="external"]）
    (9) 伪类选择器（a:hover,li:nth-child）
    (10) 伪元素选择器（::before、::after）
    (11) 通配符选择器（*）


### 3.伪类与伪元素的区别

    伪类: 用于当已有的元素处于某个状态时，为其添加对应的样式，这个状态是根据用户行为而动态变化的。 比如:hover
    
    伪元素： 用于创建一些不在文档树中的元素，并为其添加样式。它们允许我们为元素的某些部分设置样式。

### 4.CSS 中哪些属性可以继承？

    （1）字体系列属性
    font、font-family、font-weight、font-size、font-style、font-variant、font-stretch、font-size-adjust
    
    （2）文本系列属性
    text-indent、text-align、text-shadow、line-height、word-spacing、letter-spacing、
    text-transform、direction、color
    
    （3）表格布局属性
    caption-sideborder-collapseempty-cells
    
    （4）列表属性
    list-style-type、list-style-image、list-style-position、list-style
    
    （5）光标属性
    cursor
    
    （6）元素可见性
    visibility
    
    （7）还有一些不常用的；speak，page，设置嵌套引用的引号类型quotes等属性


    注意：当一个属性不是继承属性时，可以使用inherit关键字指定一个属性应从父元素继承它的值，inherit关键字用于显式地
    指定继承性，可用于任何继承性/非继承性属性。


### 5.CSS3 新增伪类有那些？
    （1）elem:nth-child(n)选中父元素下的第n个子元素，并且这个子元素的标签名为elem，n可以接受具体的数
    值，也可以接受函数。
    
    （2）elem:nth-last-child(n)作用同上，不过是从后开始查找。
    
    （3）elem:last-child选中最后一个子元素。
    
    （4）elem:only-child如果elem是父元素下唯一的子元素，则选中之。
    
    （5）elem:nth-of-type(n)选中父元素下第n个elem类型元素，n可以接受具体的数值，也可以接受函数。
    
    （6）elem:first-of-type选中父元素下第一个elem类型元素。
    
    （7）elem:last-of-type选中父元素下最后一个elem类型元素。
    
    （8）elem:only-of-type如果父元素下的子元素只有一个elem类型元素，则选中该元素。
    
    （9）elem:empty选中不包含子元素和内容的elem类型元素。
    
    （10）elem:target选择当前活动的elem元素。
    
    （11）:not(elem)选择非elem元素的每个元素。
    
    （12）:enabled控制表单控件的禁用状态。
    
    （13）:disabled控制表单控件的禁用状态。
    
    (14):checked单选框或复选框被选中。


### 6.position 的值 relative 和 absolute 定位原点是？
    absolute
    生成绝对定位的元素，相对于值不为static的第一个父元素的paddingbox进行定位，也可以理解为离自己这一级元素最近的
    一级position设置为absolute或者relative的父元素的paddingbox的左上角为原点的。
    
    fixed（老IE不支持）
    生成绝对定位的元素，相对于浏览器窗口进行定位。
    
    relative
    生成相对定位的元素，相对于其元素本身所在正常位置进行定位。
    
    static
    默认值。没有定位，元素出现在正常的流中（忽略top,bottom,left,right,z-index声明）。
    
    inherit
    规定从父元素继承position属性的值。

### 7.用纯 CSS 创建一个三角形的原理是什么？

	采用的是相邻边框连接处的均分原理。
	  将元素的宽高设为0，只设置
	  border
	  ，把任意三条边隐藏掉（颜色设为
	  transparent），剩下的就是一个三角形。


### 8.CSS 多列等高如何实现？
	
	（1）利用padding-bottom|margin-bottom正负值相抵，不会影响页面布局的特点。设置父容器设置超出隐藏（overflow:
	hidden），这样父容器的高度就还是它里面的列没有设定padding-bottom时的高度，当它里面的任一列高度增加了，则
	父容器的高度被撑到里面最高那列的高度，其他比这列矮的列会用它们的padding-bottom补偿这部分高度差。
	
	（2）利用table-cell所有单元格高度都相等的特性，来实现多列等高。
	
	（3）利用flex布局中项目align-items属性默认为stretch，如果项目未设置高度或设为auto，将占满整个容器的高度
	的特性，来实现多列等高。

[https://juejin.im/post/5b0fb34151882515662238fd](https://juejin.im/post/5b0fb34151882515662238fd "《CSS：多列等高布局》")

### 9.经常遇到的浏览器的兼容性有哪些？原因，解决方法是什么，常用 hack 的技巧？

	(1) 浏览器默认的margin和padding不同
	解决方案：加一个全局的*{margin:0;padding:0;}来统一。
	
	(2) IE下，可以使用获取常规属性的方法来获取自定义属性，也可以使用getAttribute()获取自定义
	属性；Firefox下，只能使用getAttribute()获取自定义属性
	解决方法：统一通过getAttribute()获取自定义属性。
	
	(3)IE下，event对象有x、y属性，但是没有pageX、pageY属性;Firefox下，event对象有
	pageX、pageY属性，但是没有x、y属性。
	解决方法：（条件注释）缺点是在IE浏览器下可能会增加额外的HTTP请求数。
	
	(4) Chrome中文界面下默认会将小于12px的文本强制按照12px显示
	解决方法：
	
	1.可通过加入CSS属性-webkit-text-size-adjust:none;解决。但是，在chrome
	更新到27版本之后就不可以用了。
	
	2.还可以使用-webkit-transform:scale(0.5);注意-webkit-transform:scale(0.75);
	收缩的是整个span的大小，这时候，必须要将span转换成块元素，可以使用display：block/inline-block/...；
	
### 10.li 与 li 之间有看不见的空白间隔是什么原因引起的？有什么解决办法？
	浏览器会把inline元素间的空白字符（空格、换行、Tab等）渲染成一个空格。而为了美观。我们通常是一个<li>放在一行，
	这导致<li>换行后产生换行字符，它变成一个空格，占用了一个字符的宽度。
	
	解决办法：
	
	（1）为<li>设置float:left。不足：有些容器是不能设置浮动，如左右切换的焦点图等。
	
	（2）将所有<li>写在同一行。不足：代码不美观。
	
	（3）将<ul>内的字符尺寸直接设为0，即font-size:0。不足：<ul>中的其他字符尺寸也被设为0，需要额外重新设定其他
	字符尺寸，且在Safari浏览器依然会出现空白间隔。
	
	（4）消除<ul>的字符间隔letter-spacing:-8px，不足：这也设置了<li>内的字符间隔，因此需要将<li>内的字符
	间隔设为默认letter-spacing:normal。

### 11.CSS 里的 visibility 属性有个 collapse 属性值是干嘛用的？在不同浏览器下以后什么区别？

	（1）对于一般的元素，它的表现跟visibility：hidden;是一样的。元素是不可见的，但此时仍占用页面空间。
	
	（2）但例外的是，如果这个元素是table相关的元素，例如table行，tablegroup，table列，tablecolumngroup，它的
	表现却跟display:none一样，也就是说，它们占用的空间也会释放。
	
	在不同浏览器下的区别：
	
	在谷歌浏览器里，使用collapse值和使用hidden值没有什么区别。
	
	在火狐浏览器、Opera和IE11里，使用collapse值的效果就如它的字面意思：table的行会消失，它的下面一行会补充它的位
	置。

### 12.width:auto 和 width:100%的区别
	一般而言
	
	width:100%会使元素box的宽度等于父元素的contentbox的宽度。
	
	width:auto会使元素撑满整个父元素，margin、border、padding、content区域会自动分配水平空间。

### 13.绝对定位元素与非绝对定位元素的百分比计算的区别
	绝对定位元素的宽高百分比是相对于临近的position不为static的祖先元素的paddingbox来计算的。

	非绝对定位元素的宽高百分比则是相对于父元素的contentbox来计算的。
### 14.简单介绍使用图片 base64 编码的优点和缺点。
	base64编码是一种图片处理格式，通过特定的算法将图片编码成一长串字符串，在页面上显示的时候，可以用该字符串来代替图片的
	url属性。
	
	使用base64的优点是：
	
	（1）减少一个图片的HTTP请求
	
	使用base64的缺点是：
	
	（1）根据base64的编码原理，编码后的大小会比原文件大小大1/3，如果把大图片编码到html/css中，不仅会造成文件体
	积的增加，影响文件的加载速度，还会增加浏览器对html或css文件解析渲染的时间。
	
	（2）使用base64无法直接缓存，要缓存只能缓存包含base64的文件，比如HTML或者CSS，这相比域直接缓存图片的效果要
	差很多。
	
	（3）兼容性的问题，ie8以前的浏览器不支持。
	
	一般一些网站的小图标可以使用base64图片来引入。

### 15.'display'、'position'和'float'的相互关系？

	（1）首先我们判断display属性是否为none，如果为none，则position和float属性的值不影响元素最后的表现。

	（2）然后判断position的值是否为absolute或者fixed，如果是，则float属性失效，并且display的值应该被
	设置为table或者block，具体转换需要看初始转换值。
	
	（3）如果position的值不为absolute或者fixed，则判断float属性的值是否为none，如果不是，则display
	的值则按上面的规则转换。注意，如果position的值为relative并且float属性的值存在，则relative相对
	于浮动后的最终位置定位。
	
	（4）如果float的值为none，则判断元素是否为根元素，如果是根元素则display属性按照上面的规则转换，如果不是，
	则保持指定的display属性值不变。

### 16.margin 重叠问题的理解。
	块级元素的上外边距（margin-top）与下外边距（margin-bottom）有时会合并为单个外边距，这样的现象称为“margin合
	并”。
	
	产生折叠的必备条件：margin必须是邻接的!
	
	而根据w3c规范，两个margin是邻接的必须满足以下条件：
    	
    •必须是处于常规文档流（非float和绝对定位）的块级盒子，并且处于同一个BFC当中。
    •没有线盒，没有空隙，没有padding和border将他们分隔开
    •都属于垂直方向上相邻的外边距，可以是下面任意一种情况
    •元素的margin-top与其第一个常规文档流的子元素的margin-top
    •元素的margin-bottom与其下一个常规文档流的兄弟元素的margin-top
    •height为auto的元素的margin-bottom与其最后一个常规文档流的子元素的margin-bottom
    •高度为0并且最小高度也为0，不包含常规文档流的子元素，并且自身没有建立新的BFC的元素的margin-top
    和margin-bottom
    
    
    margin合并的3种场景：
    
    （1）相邻兄弟元素margin合并。
    
    解决办法：
    •设置块状格式化上下文元素（BFC）
    
    （2）父级和第一个/最后一个子元素的margin合并。
    
    解决办法：
    
    对于margin-top合并，可以进行如下操作（满足一个条件即可）：
    •父元素设置为块状格式化上下文元素；
    •父元素设置border-top值；
    •父元素设置padding-top值；
    •父元素和第一个子元素之间添加内联元素进行分隔。
    
    对于margin-bottom合并，可以进行如下操作（满足一个条件即可）：
    •父元素设置为块状格式化上下文元素；
    •父元素设置border-bottom值；
    •父元素设置padding-bottom值；
    •父元素和最后一个子元素之间添加内联元素进行分隔；
    •父元素设置height、min-height或max-height。
    
    （3）空块级元素的margin合并。
    
    解决办法：
    •设置垂直方向的border；
    •设置垂直方向的padding；
    •里面添加内联元素（直接Space键空格是没用的）；
    •设置height或者min-height。

### 17. 对 BFC 规范的理解；
	通俗来讲
	
	•BFC是一个独立的布局环境，可以理解为一个容器，在这个容器中按照一定规则进行物品摆放，并且不会影响其它环境中的物品。
	•如果一个元素符合触发BFC的条件，则BFC中的元素布局不受外部影响。
	创建BFC
	
	（1）根元素或包含根元素的元素
	（2）浮动元素float＝left|right或inherit（≠none）
	（3）绝对定位元素position＝absolute或fixed
	（4）display＝inline-block|flex|inline-flex|table-cell或table-caption
	（5）overflow＝hidden|auto或scroll(≠visible)

### 18.IFC 是什么？

	IFC指的是行级格式化上下文，它有这样的一些布局规则：
	
	（1）行级上下文内部的盒子会在水平方向，一个接一个地放置。
	（2）当一行不够的时候会自动切换到下一行。
	（3）行级上下文的高度由内部最高的内联盒子的高度决定。

### 19.zoom:1 的清除浮动原理?

	当设置了zoom的值之后，所设置的元素就会扩大或者缩小，高度宽度就会重新计算了，这里一旦改变zoom值时其实也会发
	生重新渲染，运用这个原理，也就解决了ie下子元素浮动时候父元素不随着自动扩大的问题。

### 20.CSS 优化、提高性能的方法有哪些？

	加载性能：
	(1) css 压缩
	(2) css 单一样式，如margin-bottom，not margin：0 0 0 10px；
	(3) 减少使用@import,建议使用link，因为后者在页面加载时一起加载，前者是等待页面加载完成之后再进行加载。
	
	选择器性能：
	
	（1）关键选择器（keyselector）。选择器的最后面的部分为关键选择器（即用来匹配目标元素的部分）。CSS选择符是从右到
	左进行匹配的。当使用后代选择器的时候，浏览器会遍历所有子元素来确定是否是指定的元素等等；
	
	（2）如果规则拥有ID选择器作为其关键选择器，则不要为规则增加标签。过滤掉无关的规则（这样样式系统就不会浪费时间去匹
	配它们了）。
	
	（3）避免使用通配规则，如*{}计算次数惊人！只对需要用到的元素进行选择。
	
	（4）尽量少的去对标签进行选择，而是用class。
	
	（5）尽量少的去使用后代选择器，降低选择器的权重值。后代选择器的开销是最高的，尽量将选择器的深度降到最低，最高不要超过
	三层，更多的使用类来关联每一个标签元素。
	
	（6）了解哪些属性是可以通过继承而来的，然后避免对这些属性重复指定规则。
	
	渲染性能：
	
	（1）慎重使用高性能属性：浮动、定位。
	
	（2）尽量减少页面重排、重绘。
	
	（3）去除空规则：｛｝。空规则的产生原因一般来说是为了预留样式。去除这些空规则无疑能减少css文档体积。
	
	（4）属性值为0时，不加单位。
	
	（5）属性值为浮动小数0.**，可以省略小数点之前的0。
	
	（6）标准化各种浏览器前缀：带浏览器前缀的在前。标准属性在后。
	
	（7）不使用@import前缀，它会影响css的加载速度。
	
	（8）选择器优化嵌套，尽量避免层级过深。
	
	（9）css雪碧图，同一页面相近部分的小图标，方便使用，减少页面的请求次数，但是同时图片本身会变大，使用时，优劣考虑清
	楚，再使用。
	
	（10）正确使用display的属性，由于display的作用，某些样式组合会无效，徒增样式体积的同时也影响解析性能。
	
	（11）不滥用web字体。对于中文网站来说WebFonts可能很陌生，国外却很流行。webfonts通常体积庞大，而且一些浏
	览器在下载webfonts时会阻塞页面渲染损伤性能。
	
	可维护性、健壮性：
	
	（1）将具有相同属性的样式抽离出来，整合并通过class在页面中进行使用，提高css的可维护性。
	（2）样式与内容分离：将css代码定义到外部css中。

### 21.如何修改 chrome 记住密码后自动填充表单的黄色背景？

	chrome表单自动填充后，input文本框的背景会变成黄色的，通过审查元素可以看到这是由于chrome会默认给自动填充的in
	put表单加上input:-webkit-autofill私有属性，然后对其赋予样式

### 22.怎么让 Chrome 支持小于 12px 的文字？

	（1）可以使用Webkit的内核的-webkit-text-size-adjust的私有CSS属性来解决，只要加了-webkit-text-size
	-adjust:none;字体大小就不受限制了。但是chrome更新到27版本之后就不可以用了。所以高版本chrome谷歌浏览器
	已经不再支持-webkit-text-size-adjust样式，所以要使用时候慎用。
	
	（2）还可以使用css3的transform缩放属性-webkit-transform:scale(0.5);注意-webkit-transform:scale(0.
	75);收缩的是整个元素的大小，这时候，如果是内联元素，必须要将内联元素转换成块元素，可以使用display：block/
	inline-block/...；
	
	（3）使用图片：如果是内容固定不变情况下，使用将小于12px文字内容切出做图片，这样不影响兼容也不影响美观。

### 23.让页面里的字体变清晰，变细用 CSS 怎么做？
	webkit内核的私有属性：-webkit-font-smoothing，用于字体抗锯齿，使用后字体看起来会更清晰舒服。

	在MacOS测试环境下面设置-webkit-font-smoothing:antialiased;但是这个属性仅仅是面向MacOS，其他操作系统设
	置后无效。

### 24.font-style 属性中 italic 和 oblique 的区别？
	italic和oblique这两个关键字都表示“斜体”的意思。
	
	它们的区别在于，italic是使用当前字体的斜体字体，而oblique只是单纯地让文字倾斜。如果当前字体没有对应的斜体字体，
	则退而求其次，解析为oblique，也就是单纯形状倾斜。

### 25. 设备像素、css 像素、设备独立像素、dpr、ppi 之间的区别？

	设备像素指的是物理像素，一般手机的分辨率指的就是设备像素，一个设备的设备像素是不可变的。
	
	css像素和设备独立像素是等价的，不管在何种分辨率的设备上，css像素的大小应该是一致的，css像素是一个相对单位，它是相
	对于设备像素的，一个css像素的大小取决于页面缩放程度和dpr的大小。
	
	dpr指的是设备像素和设备独立像素的比值，一般的pc屏幕，dpr=1。在iphone4时，苹果推出了retina屏幕，它的dpr
	为2。屏幕的缩放会改变dpr的值。
	
	ppi指的是每英寸的物理像素的密度，ppi越大，屏幕的分辨率越大。

### 26.layoutviewport、visualviewport 和 idealviewport 的区别？
	移动端一共需要理解三个viewport的概念的理解。
	
	第一个视口是布局视口，在移动端显示网页时，由于移动端的屏幕尺寸比较小，如果网页使用移动端的屏幕尺寸进行布局的话，那么整
	个页面的布局都会显示错乱。所以移动端浏览器提供了一个layoutviewport布局视口的概念，使用这个视口来对页面进行布局展
	示，一般layoutviewport的大小为980px，因此页面布局不会有太大的变化，我们可以通过拖动和缩放来查看到这个页面。
	
	第二个视口指的是视觉视口，visualviewport指的是移动设备上我们可见的区域的视口大小，一般为屏幕的分辨率的大小。visu
	alviewport和layoutviewport的关系，就像是我们通过窗户看外面的风景，视觉视口就是窗户，而外面的风景就是布局视口
	中的网页内容。
	
	第三个视口是理想视口，由于layoutviewport一般比visualviewport要大，所以想要看到整个页面必须通过拖动和缩放才
	能实现。所以又提出了idealviewport的概念，idealviewport下用户不用缩放和滚动条就能够查看到整个页面，并且页面在
	不同分辨率下显示的内容大小相同。idealviewport其实就是通过修改layoutviewport的大小，让它等于设备的宽度，这个
	宽度可以理解为是设备独立像素，因此根据idealviewport设计的页面，在不同分辨率的屏幕下，显示应该相同。

### 27.position:fixed;在 android 下无效怎么处理？
	如果想实现fixed相对于屏幕的固定效果，我们需要改变的是viewport的大小为idealviewport，可以如下设置：
	
	<meta name="viewport"content="width=device-width,initial-scale=1.0,maximum-scale=1.0,minimum-sca
	le=1.0,user-scalable=no"/>
### 28。.如果需要手动写动画，你认为最小时间间隔是多久，为什么？（阿里）

	多数显示器默认频率是60Hz，即1秒刷新60次，所以理论上最小间隔为1/60*1000ms＝16.7ms

### 29.如何让去除 inline-block 元素间间距？
	移除空格、使用margin负值、使用font-size:0、letter-spacing、word-spacing

### 30.overflow:scroll 时不能平滑滚动的问题怎么处理？
	以下代码可解决这种卡顿的问题：-webkit-overflow-scrolling:touch;是因为这行代码启用了硬件加速特性，所以滑动很流畅

### 31..有一个高度自适应的 div，里面有两个 div，一个高度 100px，希望另一个填满剩下的高度

	（1）外层div使用position：relative；高度要求自适应的div使用position:absolute;top:100px;bottom:0;
	left:0;right:0;
	
	（2）使用flex布局，设置主轴为竖轴，第二个div的flex-grow为1。

### 32.什么是 Cookie 隔离？

	网站向服务器请求的时候，会自动带上cookie这样增加表头信息量，使请求变慢。
	
	如果静态文件都放在主域名下，那静态文件请求的时候都带有的cookie的数据提交给server的，非常浪费流量，所以不如隔离开
	，静态资源放CDN。
	
	因为cookie有域的限制，因此不能跨域提交请求，故使用非主要域名的时候，请求头中就不会带有cookie数据，这样可以降低请
	求头的大小，降低请求时间，从而达到降低整体请求延时的目的。
	
	同时这种方式不会将cookie传入WebServer，也减少了WebServer对cookie的处理分析环节，提高了webserver的http请求的解析速度。

### 33.画一条 0.5px 的线
	采用metaviewport的方式
	
	采用border-image的方式
	
	采用transform:scale()的方式
### 34.什么是首选最小宽度？

	“首选最小宽度”，指的是元素最适合的最小宽度。
	
	东亚文字（如中文）最小宽度为每个汉字的宽度。
	
	西方文字最小宽度由特定的连续的英文字符单元决定。并不是所有的英文字符都会组成连续单元，一般会终止于空格（普通空格）、短
	横线、问号以及其他非英文字符等。
	
	如果想让英文字符和中文一样，每一个字符都用最小宽度单元，可以试试使用CSS中的word-break:break-all。

### 35.为什么 height:100%会无效？
	对于普通文档流中的元素，百分比高度值要想起作用，其父级必须有一个可以生效的高度值。
	
	原因是如果包含块的高度没有显式指定（即高度由内容决定），并且该元素不是绝对定位，则计算值为auto，因为解释成了auto，
	所以无法参与计算。
	
	使用绝对定位的元素会有计算值，即使祖先元素的height计算为auto也是如此。
### 36.如何实现单行／多行文本溢出的省略（...）？

### 37.常见的元素隐藏方式？
	-（1）使用 display:none;隐藏元素，渲染树不会包含该渲染对象，因此该元素不会在页面中占据位置，也不会响应绑定的监听事件。
	
	-（2）使用 visibility:hidden;隐藏元素。元素在页面中仍占据空间，但是不会响应绑定的监听事件。
	
	-（3）使用 opacity:0;将元素的透明度设置为 0，以此来实现元素的隐藏。元素在页面中仍然占据空间，并且能够响应元素绑定的监听事件。
	
	-（4）通过使用绝对定位将元素移除可视区域内，以此来实现元素的隐藏。
	
	-（5）通过 z-index 负值，来使其他元素遮盖住该元素，以此来实现隐藏。
	
	-（6）通过 clip/clip-path 元素裁剪的方法来实现元素的隐藏，这种方法下，元素仍在页面中占据位置，但是不会响应绑定的监听事件。
	
	-（7）通过 transform:scale(0,0)来将元素缩放为 0，以此来实现元素的隐藏。这种方法下，元素仍在页面中占据位置，但是不会响应绑定的监听事件。

### 38.css 实现上下固定中间自适应布局？

	利用绝对定位实现body {
	  padding: 0;
	  margin: 0;
	}
	
	.header {
	  position: absolute;
	  top: 0;
	  width: 100%;
	  height: 100px;
	  background: red;
	}
	
	.container {
	  position: absolute;
	  top: 100px;
	  bottom: 100px;
	  width: 100%;
	  background: green;
	}
	
	.footer {
	  position: absolute;
	  bottom: 0;
	  height: 100px;
	  width: 100%;
	  background: red;
	}
	
	利用flex布局实现html,
	body {
	  height: 100%;
	}
	
	body {
	  display: flex;
	  padding: 0;
	  margin: 0;
	  flex-direction: column;
	}
	
	.header {
	  height: 100px;
	  background: red;
	}
	
	.container {
	  flex-grow: 1;
	  background: green;
	}
	
	.footer {
	  height: 100px;
	  background: red;
	}

### 39.css 两栏布局的实现？
	（1）利用浮动，将左边元素宽度设置为200px，并且设置向左浮动。将右边元素的margin-left设置为200px，宽度设置为auto（默认为auto，撑满整个父元素）。
	
	（2）第二种是利用flex布局，将左边元素的放大和缩小比例设置为0，基础大小设置为200px。将右边的元素的放大比例设置为1，缩小比例设置为1，基础大小设置为auto。
	
	(3）第三种是利用绝对定位布局的方式，将父级元素设置相对定位。左边元素设置为absolute定位，并且宽度设置为200px。将右边元素的margin-left的值设置为200px。
	
	（4）第四种还是利用绝对定位的方式，将父级元素设置为相对定位。左边元素宽度设置为200px，右边元素设置为绝对定位，左边定位为200px，其余方向定位为0

### 40. css 三栏布局的实现

	三栏布局一般指的是页面中一共有三栏，左右两栏宽度固定，中间自适应的布局，一共有五种实现方式。
	
	这里以左边宽度固定为100px，右边宽度固定为200px为例。
	
	（1）利用绝对定位的方式，左右两栏设置为绝对定位，中间设置对应方向大小的margin的值。
	
	（2）利用flex布局的方式，左右两栏的放大和缩小比例都设置为0，基础大小设置为固定的大小，中间一栏设置为auto。
	
	（3）利用浮动的方式，左右两栏设置固定大小，并设置对应方向的浮动。中间一栏设置左右两个方向的margin值，注意这种方式，中间一栏必须放到最后。
	
	（4）圣杯布局，利用浮动和负边距来实现。父级元素设置左右的pedding，三列均设置向左浮动，中间一列放在最前面，宽度设置为父级元素的宽度，因此后面两列都被挤到了下一行，通过设置margin负值将其移动到上一行，再利用相对定位，定位到两边。双飞翼布局中间列的宽度不能小于两边任意列的宽度，而双飞翼布局则不存在这个问题。
	
	（5）双飞翼布局，双飞翼布局相对于圣杯布局来说，左右位置的保留是通过中间列的margin值来实现的，而不是通过父元素的pedding来实现的。本质上来说，也是通过浮动和外边距负值来实现的。

### 41..实现一个宽高自适应的正方形

	/*1.第一种方式是利用vw来实现*/
	.square {
	  width: 10%;
	  height: 10vw;
	  background: tomato;
	}
	
	/*2.第二种方式是利用元素的margin/padding百分比是相对父元素width的性质来实现*/
	.square {
	  width: 20%;
	  height: 0;
	  padding-top: 20%;
	  background: orange;
	}
	
	/*3.第三种方式是利用子元素的margin-top的值来实现的*/
	.square {
	  width: 30%;
	  overflow: hidden;
	  background: yellow;
	}
	
	.square::after {
	  content: "";
	  display: block;
	  margin-top: 100%;
	}
