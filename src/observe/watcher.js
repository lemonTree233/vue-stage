import Dep from "./dep";

let id = 0

class Watcher {
    // 每个组件分配一个watcher
    constructor(vm, fn, options) {
        this.id = id++
        this.getter = fn
        this.renderWatcher = options
        this.deps = []  // 后续实现计算属性 和 一些清理工作需要用到
        this.depsIDSet = new Set()
        this.get()
    }

    get() {
        Dep.target = this   // 静态属性赋值
        this.getter()
        Dep.target = null
    }

    addDep(dep) {
        if (!this.depsIDSet.has(dep.id)) {
            this.deps.push(dep)
            this.depsIDSet.add(dep.id)
            dep.addWat(this)
        }
    }

    update() {
        // this.get()  // 重新渲染
        queueWatcher(this)  //
    }

    run() {
        console.log('run')
        this.get()
    }

}

let queue = []
let has = {}
let flag = false

function flushSchedulerQueue() {
    let flushQueue = queue.slice(0)
    queue = []
    has = {}
    flag = false
    flushQueue.forEach(item => item.run())      //在数据更新的过程中 如果数据再次发生变化 则放进下一轮的更新中
}

function queueWatcher(watcher) {
    let id = watcher.id
    if (!has[id]) {
        // 实现去重操作  相同属性值变化只更新一次
        queue.push(watcher)
        has[id] = true

        if (!flag) {
            nextTick(flushSchedulerQueue, 0)
            flag = true
        }
    }
}

let callbacks = []
let waiting = false

function flushCallbacks() {
    let cbs = callbacks.slice(0)
    callbacks = []
    waiting = false
    cbs.forEach(cb => cb())
}

let timerFunc
if (Promise) {
    timerFunc = () => {
        Promise.resolve().then(flushCallbacks)
    }
} else if (MutationObserver) {
    const observer = new MutationObserver(flushCallbacks)
    let textNode = document.createTextNode(1)
    observer.observe(textNode, {characterData: true})

    timerFunc = () => {
        textNode.textContent = 2
    }
} else if (setImmediate) {
    timerFunc = () => setImmediate(flushCallbacks)
} else {
    timerFunc = () => setTimeout(flushCallbacks, 0)
}


export function nextTick(cb) {
    callbacks.push(cb)
    if (!waiting) {
        waiting = true
        timerFunc(flushCallbacks)
    }
}

export default Watcher
// 每个属性增加一个dep 目的是收集watcher
