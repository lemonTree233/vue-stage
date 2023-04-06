import { createElementVnode, createTextVnode } from "./vdom";
import Watcher from "./observe/watcher";
export function initLifeCycle(Vue) {
    //根据虚拟DOM生成真实DOM
    Vue.prototype._update = function (vnode){
        const vm = this
        const el = vm.$el
        //既有初始化功能 也有更新的功能
        vm.$el = patch(el, vnode)
    }
    //_c('div',{},children)  div null undefined
    Vue.prototype._c = function (){
        return createElementVnode(this, ...arguments)
    }
    Vue.prototype._s = function (value){
        if(typeof value !== 'object')   return value
        return JSON.stringify(value)
    }
    Vue.prototype._v = function (){
        return createTextVnode(this, ...arguments)
    }
    //生成虚拟DOM 虚拟节点
    Vue.prototype._render = function (){
        return this.$options.render.call(this)
    }

}

export function mountComponent(vm, el){
    function updateComponent() {
        vm._update(vm._render())
    }
    vm.$el = el
    //1. 调用render方法产生虚拟节点 虚拟DOM
     let watcher = new Watcher(vm, updateComponent, true)

    console.log(watcher, 'watcher')
    //2. 根据虚拟DOM产生真实DOM

    //3. 插入到el元素中
}
function createElm(vnode) {
    let { tag, props, children, text } = vnode
    if(typeof tag === 'string'){
        vnode.el = document.createElement(tag)
        genProps(vnode.el, props)
        children.forEach(child => {
            vnode.el.appendChild(createElm(child))
        })
    }else {
        //tag 是undefined 文本节点
        vnode.el = document.createTextNode(text)
    }
    return vnode.el
}

function genProps(el, props) {
    // style: { color: 'red', backgroundColor: yellow }
    for (const key in props) {
        if(key === 'style'){
            for(const styleName in props[key]){
                el[styleName] = props[key][styleName]
            }
        }else{
            el.setAttribute(key, props[key])
        }
    }
}

export function patch(oldNode, vnode) {
    const isRealElement = oldNode.nodeType
    if(isRealElement){
        const elm = oldNode //获取真实元素

        const parentElm = elm.parentNode
        let newElm = createElm(vnode)
        //删除旧节点 插入新节点
        parentElm.insertBefore(newElm, oldNode.nextSibling)
        parentElm.removeChild(elm)

        return newElm
    }else{
        //diff算法
    }

}

// vue核心流程 1） 创造了响应式数据  2） 模板转换成ast语法树
// 3) 将ast语法树转换了render函数 4) 后续每次数据更新可以只执行render函数 (无需再次执行ast转化的过程)
// render函数会去产生虚拟节点（使用响应式数据）
// 根据生成的虚拟节点创造真实的DOM

// 执行具体的某一个生命周期
export function callHook(vm, hook) {
    const handlers = vm.$options[hook]

    if(handlers){
        handlers.forEach(handler => handler.call(vm))
    }
}