import { newArrayProto } from "./array";

class Observer{
    constructor(data) {
        //如果data是对象的话 就会出现循环遍历的情况 所以要避免循环遍历 __ob__ enumerable设置为false
        Object.defineProperty(data, '__ob__',{
            value: this,
            enumerable: false
        })
        // data.__ob__ = this  //给观测类添加一个属性 方便调用类中的方法 同时也可以利用该属性做判断对象是否已经监测过了
        if(Array.isArray(data)){
            data.__proto__ =  newArrayProto
            //重写数组的七个方法
            this.observeArray(data)
        }else{
            //对data中已经存在的属性进行劫持 新增的和删除的无法劫持 需要使用$set $delete
            this.walk(data)
        }

    }
    observeArray(data){
        //观测数组中的对象
        data.forEach(item => observe(item))
    }
    walk(data){
        Object.keys(data).forEach(key => defineReactive(data,key,data[key]))
    }
}
export function defineReactive(target,key, value) {
    //对象中的value 是对象的话 要递归进行数据劫持
    observe(value)
    Object.defineProperty(target, key,{
        get(){
            console.log('用户获取值了',key)
            return value
        },
        set(newValue){
            console.log('用户设置值了')
            if(newValue === value)  return
            value = newValue
        }
    })
}
export function observe(data) {
    //只对 对象进行劫持
    if(typeof data !== 'object' || data === null) return
    if(data.__ob__ instanceof Observer) return  //对象已经被代理过了
    return new Observer(data)
}