
import Vue from "./index";
import { initState } from "./state";
import { compileToFunction } from "./compiler";
import { mountComponent } from "./lifecycle";

//扩展vue的初始化
export const initMixin = function (Vue){
    //用于初始化操作
    Vue.prototype._init = function (options){
        const vm = this
        vm.$options = options
        //初始化状态
        initState(vm)
        if(options.el){
            vm.$mount(options.el)
        }
    }
    //挂载操作
    Vue.prototype.$mount = function (el){
        const vm = this
        let ops = vm.$options
        el = document.querySelector(el)
        if(!ops.render){
            let template
            if(!ops.template && el){    //没写template 但是写了el
                template = el.outerHTML
            }else{
                // 有template 就用template
                if(el)  template = ops.template
            }
            if(template){
                //对模板进行编辑
                const render = compileToFunction(template)
                ops.render = render
            }
        }

        //挂载组件
        mountComponent(vm, el)
    }
}

