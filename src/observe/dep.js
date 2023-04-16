let id = 0

// 每个属性有一个dep （属性就是被观察者） ， watcher就是观察者（属性变化了会通知观察者来更新） -》 观察者模式
class Dep {
    constructor() {
        this.id = id++
        this.subs = []
    }

    depend() {
        // this.subs.push(Dep.target)   // 没有进行去重操作 相同数据会创建多个watcher
        Dep.target.addDep(this)
    }

    addWat(watcher) {
        this.subs.push(watcher)
    }

    notify() {
        this.subs.forEach(watcher => {
            watcher.update()
        })
    }
}

Dep.target = null

export default Dep