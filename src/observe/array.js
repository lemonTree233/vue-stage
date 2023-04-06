
let oldArrayProto = Array.prototype

export const newArrayProto = Object.create(oldArrayProto)

let methods = [
    'push',
    'pop',
    'shift',
    'unshift',
    'reverse',
    'splice',
    'sort'
]

methods.forEach(method =>{
    newArrayProto[method] =  function (...args){
        let ob = this.__ob__
        const result = oldArrayProto[method].call(this, ...args)
        let inserted
        switch (method) {
            case 'push':
            case 'unshift':
                inserted = args
                break
            case 'splice':  //arr.splice(0, 1, {a: 1})
                inserted = arr.slice(2)
                break
            default:
                break
        }
        if(inserted){
            //需要对数组中新增的对象进行劫持
            ob.observeArray(inserted)
        }
        ob.dep.notify()
        return result
    }
})
