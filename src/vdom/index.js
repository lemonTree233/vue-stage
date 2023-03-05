export function createElementVnode(vm, tag, data, ...children) {
    let key = data?.key
    key ? delete data.key : ''
    return vnode(vm,tag,key, data, children)
}

export function createTextVnode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text)
}
/*
* ast 是语法层面的转化 描述得是语法本身（js css html）
*   而虚拟DOM描述的是DOM元素 可以增加一些自定义属性*/
function vnode(vm, tag, key, props, children, text) {
    return {
        vm,
        tag,
        key,
        props,
        children,
        text
    }
}