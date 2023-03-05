//初始化状态
import { observe } from "./observe/index";

export function initState(vm) {
    const ops = vm.$options
    if(ops.data){
        initData(vm)
    }
}

function proxy(vm, target, key) {
    Object.defineProperty(vm,key, {
        get(){
            return vm[target][key]
        },
        set(newValue){
            vm[target][key] = newValue
        }
    })
}

function initData(vm){

    let data = vm.$options.data     //data可能是函数和对象

    data = typeof data === 'function' ? data.call(vm) : data

    vm._data = data

    //对数据进行劫持 vue2采用的是Object.defineProperty
    observe(data)

    //将vm._data进行代理 便于访问
    for(let key in data){
        proxy(vm,'_data', key)
    }
}
