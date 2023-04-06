import { initMixin } from "./init";
import { initLifeCycle } from "./lifecycle";
import { nextTick } from "./observe/watcher";
import { initGloablAPI } from "./globalAPI";

function Vue(options){
    this._init(options)
}

Vue.prototype.$nextTick = nextTick
initMixin(Vue)
initLifeCycle(Vue)
initGloablAPI(Vue)

export default Vue