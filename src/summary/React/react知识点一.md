<!--
 * @Author: your name
 * @Date: 2020-02-24 11:04:14
 * @Description: react 
 * @FilePath: /serious-review/src/summary/React/react知识点一.md
 -->

### 1. 为什么虚拟dom会提高性能？

virtual dom相当于在js和真实dom之间加了一个缓存，利用dom diff算法避免了没有必要的dom操作，从而提高性能。

### 2. react中refs的作用？

Refs是React提供给我们的安全访问Dom元素或者某个组件实例的句柄

### 3. 如果你创建了类似于下面的Header元素？那它相关的类定义是怎么样的？

    <Header username="luisa">
      {
        (user) => user === null 
        ? <Loading />
        : <Badge info={user} />
      }
    </Header>


实现：

    import React from 'react';
    import fetchApi from './api';

    class Header extends React.Component {
      constructor(){
        super();
        this.state= {
          user: null
        }
      }
      componentDidMount (){
        fetchApi.getUser(this.props.username)
          .then((user) => this.setState({user}))
      }
      render(){
        return this.props.children(this.state.user)
      }
    }

这种优势在于将父组件和子组件解耦合，父组件可以直接访问子组件内部状态而不需要在通过props传递，这样父组件更方便的控制子组件展示的ui。

### 4. 何为HOC？
 hoc是一个以组件为参数并且返回一个新组件的函数。 hoc运行你重用代码、逻辑和引导抽象。最常见的是redux的connent函数。HOC最好的方式是共享React组件之间的行为。

### 5. 为什么建议传递给setState的参数是一个callback而不是一个对象？

因为this.props和this.state的更新可能是异步的，不能依赖他们的值去计算下一个state

### 6. useMemo和React.memo有什么区别？

- memo: 针对 一个组件的渲染是否重复执行, <Foo />

- usememo: 针对 一段函数逻辑是否重复执行, ()=>{}

推荐使用 React.useMemo 而不是 React.memo，因为在组件通信时存在 React.useContext 的用法，这种用法会使所有用到的组件重渲染，只有 React.useMemo 能处理这种场景的按需渲染。

没有性能问题的组件最好也使用 useMemo，考虑未来维护这个组件的时候，随时可能会通过 useContext 等注入一些数据，这时候谁会想起来添加 useMemo 呢？

### 7. useCallback、useMemo的区别？

- useCallback： 把内联回调函数及依赖项数组作为参数传入 useCallback，它将返回该回调函数的 memoized 版本，该回调函数仅在某个依赖项改变时才会更新。当你把回调函数传递给经过优化的并使用引用相等性去避免非必要渲染（例如 shouldComponentUpdate）的子组件时，它将非常有用。

- useMemo:把“创建”函数和依赖项数组作为参数传入 useMemo，它仅会在某个依赖项改变时才重新计算 memoized 值。这种优化有助于避免在每次渲染时都进行高开销的计算。

两个都是返回一个memoized，同时具备第二个参数依赖项，第二个参数的情况和useEffect类似，但是useCallback往往使用于传递给子组件的函数的优化，useMemo使用于数据的优化

总结：
在子组件不需要父组件的值和函数的情况下，只需要使用memo函数包裹子组件即可。而在使用值和函数的情况，需要考虑有没有函数传递给子组件使用useCallback，值有没有所依赖的依赖项而使用useMemo

### 8. useEffect和useLayoutEffect
- useEffect【异步】: 这个是在render结束后,你的callback函数执行,但是不会block browser painting,算是某种异步的方式吧
- useLayoutEffect【同步】: 这个是用在处理DOM的时候,当你的useEffect里面的操作需要处理DOM,并且会改变页面的样式,就需要用这个,否则可能会出现出现闪屏问题, useLayoutEffect里面的callback函数会在DOM更新完成后立即执行,但是会在浏览器进行任何绘制之前运行完成,阻塞了浏览器的绘制


### 9. 如何解决关于useCallback带来的闭包问题？

    // 举个栗子，我用hooks 写了这么一个组件
    let Test = () => {
        /** Search base infos */
        const [searchID, setSearchID] = useState(0)

        /** Search info action */
        const onSearchInfos = useCallback(() => {
            let fetchUrl = '/api/getSearchInfos'
            let fetchParams = { searchID }
            fetch(fetchUrl, {
                method: 'POST',
                body: JSON.stringify(fetchParams)
            }).then(res => res.json()
            ).then(res => {
              console.log(res)
            })
        }, [])

        return (
            <>
                <button onClick={() => {setSearchID(searchID + 1)}} >button1</button>
                <button onClick={() => {onSearchInfos()}}>button2</button>
            </>
        )
    }

    export default Test

问题： 当我们点击了四次button1，把searchID的值更改到了4，然后点击button2，会发现，发送出去的请求，searhID的值是0。

原因：

只在第一次组件创建的时候onSearchInfos被创建！第一次！
也就是说searchID拿到的值是第一次被创建的时候，传入的值，形成了一个闭包。

方案1:

    let Test = () => {
        /** Search base infos */
        const [searchID, setSearchID] = useState(0)

        /** 解决闭包问题 */
        const fetchRef = useRef() // hooks为我们提供的一个通用容器，里面有一个current属性
        
        // useLayoutEffect (等效于 didMount 和 didUpdate)
        useLayoutEffect(() => {
          fetchRef.current = {
            searchID
          }; //  为current这个属性添加一个searchID，每当searchID状态变更的时候，Test都会进行重新渲染，从而current能拿到最新的值
        });

        /** Search info action */
        const onSearchInfos = useCallback(() => {
            let fetchUrl = '/api/getSearchInfos'
            let fetchParams = { ...fetchRef.current } // 解构参数，这里拿到的是外层fetchRef的引用
            fetch(fetchUrl, {
                method: 'POST',
                body: JSON.stringify(fetchParams)
            }).then(res => res.json()
            ).then(res => {
              console.log(res)
            })
        }, [])

        return (
            <>
                <button onClick={() => {setSearchID(searchID + 1)}} >button1</button>
                <button onClick={() => {onSearchInfos()}}>button2</button>
            </>
        )
    }

    export default Test

方案2:
目前最佳的解法其实是使用 useReducer，因为 reducer 其实是在下次 render 时才执行的，所以在 reducer 里，访问到的永远是新的 props 和 state。

    const TodosDispatch = React.createContext(null);

    function TodosApp() {
      // Tip: `dispatch` 不会在多次渲染时改变
      const [todos, dispatch] = useReducer(todosReducer);

      return (
        <TodosDispatch.Provider value={dispatch}>
          <DeepTree todos={todos} />
        </TodosDispatch.Provider>
      );
    }