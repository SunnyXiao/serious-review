<!--
 * @Author: your name
 * @Date: 2020-04-02 14:29:14
 * @LastEditTime: 2020-04-02 14:29:22
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \rmportale:\workspace\My projects\serious-review\src\summary\javascript\如何防止重复发送ajax请求.md
 -->

如何防止重复发送ajax请求？
---

### 方法一

发送ajax请求前，btnDisable置为true，禁止按钮点击，等到ajax请求结束解除限制，这是我们最常用的一种方案

```

	getData(){
		this.btnDisabled = true;
		this.$axios.get('getData')
			.then(data=>{
				this.data=data;
				this.btnDisabled = false
			})
	}
```

缺点：  与业务代码耦合度高

### 方法二

函数节流和函数防抖

固定的一段时间内，只允许执行一次函数，如果有重复的函数调用，可以选择使用函数节流忽略后面的函数调用，以此来解决场景一存在的问题

```

	this.data = _.throttle(this.getData, 2000)

```


缺点： wait time是一个固定时间，而ajax请求的响应时间不固定，wait time设置小于ajax响应时间，两个ajax请求依旧会存在重叠部分，wait time设置大于ajax响应时间，影响用户体验。总之就是wait time的时间设定是个难题。


### 方法三

axios的CancelToken;

思路： 把请求url和状态存储在一个数组中，在axios的拦截器中去匹配，每次执行request拦截器，判断pendingAjax数组中是否还存在同样的url。如果存在，则执行自身的cancel函数进行请求拦截，不重复发送请求，不存在就正常发送并且将该api添加到数组中。等请求完结后删除数组中的这个api

```

	import Vue from 'vue'
	import axios from 'axios'
	
	
	let pendingAjax = [];
	const FAST_CLICK_MSG = '数据请求中，请稍后'
	const CancelToken = axios.CancelToken
	
	const removePendingAjax =(config, c) =>{
		const url = config.url
		const index = pendingAjax.findIndex(i=>i===url);
		if(index > -1) {
			c ? c(FAST_CLICK_MSG) : pendingAjax.splice(index,1)
		} else {
			c && pendingAjax.push(url)
		}
	}


	axios.interceptors.request.use(
		request => {
			 // Do something before request is sent
		    request.cancelToken = new CancelToken(c => {
		      removePendingAjax(request, c)
		    })
		    return request
		},
		error => {
			 return Promise.reject(error)
		}
	)

	// Add a response interceptor
	axios.interceptors.response.use(
	   response => {
	    // Any status code that lie within the range of 2xx cause this function to trigger
	    // Do something with response data
	    removePendingAjax(response.config)
	    return new Promise((resolve, reject) => {
	      if (+response.data.code !== 0) {
	        reject(new Error('network error:' + response.data.msg))
	      } else {
	        resolve(response)
	      }
	    })
	  },
	  error => {
	    // Any status codes that falls outside the range of 2xx cause this function to trigger
	    // Do something with response error
	    Message.error(error)
	    return Promise.reject(error)
	  }
	)


```


fetch:

	import Vue from 'vue'
	
	let pendingAjax = []
	let removePendingAjax = function (url) {
	  const index = pendingAjax.findIndex(i => i.url === url)
	  if (index > -1) {
	    pendingAjax[index].controller.abort()
	    pendingAjax.splice(index, 1)
	  }
	}

	Vue.prototype.$fetch = function (url) {
	  let controller = new AbortController()
	  let { signal } = controller
	  removePendingAjax(url)
	  pendingAjax.push({
	    url,
	    controller
	  })
	  return fetch(url, {
	    signal
	  })
	  .then(function(response) {
	    return response.json()
	  })
	}