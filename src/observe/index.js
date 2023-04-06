import { newArrayProto } from "./array";
import Dep from "./dep";

class Observer{
    constructor(data) {
        this.dep = new Dep()
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
// 递归遍历数组进行更新
function dependArray(value) {
    for(let i= 0;i <value.length; i++){
        let cur = value[i]
        cur.__ob__ && cur.__ob__.dep.depend()
        if(Array.isArray(cur)){
            dependArray(cur)
        }
    }
}

export function defineReactive(target,key, value) {
    //对象中的value 是对象的话 要递归进行数据劫持
    let childOB = observe(value)
    let dep = new Dep()     // 每一个属性都有一个Dep
    Object.defineProperty(target, key,{
        get(){
            if(Dep.target){
                dep.depend()
                if(childOB){
                    childOB.dep.depend()
                    if(Array.isArray(value)){
                        dependArray(value)
                    }

                }
            }
            return value
        },
        set(newValue){
            if(newValue === value)  return
            observe(newValue)
            value = newValue
            //数据变化 通知视图更新
            dep.notify()
        }
    })
}
export function observe(data) {
    //只对 对象进行劫持
    if(typeof data !== 'object' || data === null) return
    if(data.__ob__ instanceof Observer) return  //对象已经被代理过了
    return new Observer(data)
}