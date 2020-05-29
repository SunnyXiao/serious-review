<!--
 * @Author: your name
 * @Date: 2020-05-29 11:16:08
 * @LastEditTime: 2020-05-29 17:05:02
 * @LastEditors: Please set LastEditors
 * @Description: In User Settings Edit
 * @FilePath: \serious-review\src\summary\node\nodejs知识点一.md
 -->
### 进程与线程

进程：  我们启动一个服务、运行一个实例，就是开一个服务进程，是系统进行资源分配和调度的基本单位，是操作系统结构的基础，进程是线程的容器。 打个比方，进程就好比是一个车间。

线程： 线程是隶属于进程的，被包含于进程之中。一个线程只能隶属于一个进程，但是一个进程是可以拥有多个线程的。线程就如车间的工人。

### Node.js是单线程吗？

单线程：  就是一个进程只开一个线程。

node.js采用单线程异步非阻塞模式，也就是说每一个计算独占cpu，遇到I/O请求不阻塞后面的计算，当I/O完成后，以事件的方式通知，继续执行计算2。

### Node如何与操作系统进行互动？

我们在 Javascript 中调用的方法，最终都会通过node-bindings 传递到 C/C++ 层面，最终由他们来执行真正的操作。Node.js 即这样与操作系统进行互动。

### Nodejs全是异步调用和非阻塞I/O，就真的不用管并发数了吗？

在线程池中，我们发现Nodejs并不是单线程的，而且还有并发事件，线程池默认大小是4，也就是说，同时能有4个线程去做文件I/O的工作，剩下的请求会被挂起直到线程池有空闲。所以nodejs对于并发数，是有限制的。

线程池的大小可以通过 UV_THREADPOOL_SIZE 这个环境变量来改变 或者在nodejs代码中通过 process.env.UV_THREADPOOL_SIZE来重新设置。

### Node.js 做耗时的计算时候，如何避免阻塞？

可以通过fork开启子进程来解决，创建子进程有俩种方法：
1. cluster.fork()
2. require('child_process').fork
```
  const http = require('http');
  const fork = require('child_process').fork;

  const server = http.createServer((req, res) => {
      if(req.url == '/compute'){
          const compute = fork('./fork_compute.js');
          compute.send('开启一个新的子进程');

          // 当一个子进程使用 process.send() 发送消息时会触发 'message' 事件
          compute.on('message', sum => {
              res.end(`Sum is ${sum}`);
              compute.kill();
          });

          // 子进程监听到一些错误消息退出
          compute.on('close', (code, signal) => {
              console.log(`收到close事件，子进程收到信号 ${signal} 而终止，退出码 ${code}`);
              compute.kill();
          })
      }else{
          res.end(`ok`);
      }
  });
  server.listen(3000, 127.0.0.1, () => {
      console.log(`server started at http://${127.0.0.1}:${3000}`);
  });

```


### Node.js如何实现多进程的开启和关闭？

编写主进程：
master.js主要任务：
- 创建一个server并监听端口4000；
- 根据cpus开启多个子进程；
- 通过子进程对象的send方法发送消息到子进程进行通信；
- 在主进程中监听子进程的变化，如果是自杀信号重新启动一个子进程；
- 主进程在监听到退出消息的时候，先退出子进程在退出主进程

```
  const fork = require('child_process').fork;
  const cpus = require('os').cpus();

  const server = require('net').createServer();
  server.listen(4000);
  process.title = 'node-master'

  const worker = {};
  const createWorker = () => {
    const worker = require('worker.js')
    worker.on('message', function(message){
      if(message.act === 'suicide') {
        createWorker();
      }
    })

    worker.on('exit', function(code, signal) {
        console.log('worker process exited, code: %s signal: %s', code, signal);
        delete workers[worker.pid];
    });
    worker.send('server', server);
    workers[worker.pid] = worker;
    console.log('worker process created, pid: %s ppid: %s', worker.pid, process.pid);
  }
```

worker.js 子进程处理逻辑如下：

- 创建一个 server 对象，注意这里最开始并没有监听 3000 端口
- 通过 message 事件接收主进程 send 方法发送的消息
- 监听 uncaughtException 事件，捕获未处理的异常，发送自杀信息由主进程重建进程，子进程在链接关闭之后退出

```

  // worker.js
  const http = require('http');
  const server = http.createServer((req, res) => {
    res.writeHead(200, {
      'Content-Type': 'text/plan'
    });
    res.end('I am worker, pid: ' + process.pid + ', ppid: ' + process.ppid);
    throw new Error('worker process exception!'); // 测试异常进程退出、重启
  });

  let worker;
  process.title = 'node-worker'
  process.on('message', function (message, sendHandle) {
    if (message === 'server') {
      worker = sendHandle;
      worker.on('connection', function(socket) {
        server.emit('connection', socket);
      });
    }
  });

  process.on('uncaughtException', function (err) {
    console.log(err);
    process.send({act: 'suicide'});
    worker.close(function () {
      process.exit(1);
    })
  })


```

### Node.js可以创建线程吗？
Node 10.5.0 的发布，官方才给出了一个实验性质的模块 worker_threads 给 Node 提供真正的多线程能力。

```
  const {
    isMainThread,
    parentPort,
    workerData,
    threadId,
    MessageChannel,
    MessagePort,
    Worker
  } = require('worker_threads');

  function mainThread() {
    for (let i = 0; i < 5; i++) {
      const worker = new Worker(__filename, { workerData: i });
      worker.on('exit', code => { console.log(`main: worker stopped with exit code ${code}`); });
      worker.on('message', msg => {
        console.log(`main: receive ${msg}`);
        worker.postMessage(msg + 1);
      });
    }
  }

  function workerThread() {
    console.log(`worker: workerDate ${workerData}`);
    parentPort.on('message', msg => {
      console.log(`worker: receive ${msg}`);
    }),
    parentPort.postMessage(workerData);
  }

  if (isMainThread) {
    mainThread();
  } else {
    workerThread();
  }


```

上述代码在主线程中开启五个子线程，并且主线程向子线程发送简单的消息。

### 你们开发过程中如何实现进程守护的？

#### 什么是进程守护？

每次启动 Node.js 程序都需要在命令窗口输入命令 node app.js 才能启动，但如果把命令窗口关闭则Node.js 程序服务就会立刻断掉。除此之外，当我们这个  Node.js 服务意外崩溃了就不能自动重启进程了。这些现象都不是我们想要看到的，所以需要通过某些方式来守护这个开启的进程，执行 node app.js 开启一个服务进程之后，我还可以在这个终端上做些别的事情，且不会相互影响。，当出现问题可以自动重启。

#### 如何实现进程守护

可以通过第三方的进程守护框架，pm2和forever，底层也都是通过上面讲的 child_process 模块和 cluster 模块实现的。

