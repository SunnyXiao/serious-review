/**
 * @description：自定义简单的发布-订阅模式
 * @example： const ev = new Event()
 * ev.addEvent('event1',function(param){console.log(param)})
 * ev.broadcast('event1',1000)
 */

class Event {
  constructor(){
    this.pool = new Map()
  }
  broadcast(){
    const [key, ...rest] = [...arguments];
    if (this.pool.has(key)) {
      const func = this.pool.get(key)
      func.apply(this,rest)
    }
  }
  addEvent(key, func){
    this.pool.set(key,func)
  }
  removeEvent(key){
    this.pool.delete(key)
  }
}