let strats = {}
let lifeCycleArr = [
    'beforeCreate',
    'created',
    'beforeMount',
    'mounted',
    'beforeUpdate',
    'updated',
    'beforeDestroy',
    'destroyed',
    'activated',
    'deactivated',
    'errorCaptured',
    'serverPrefetch'
]

lifeCycleArr.forEach(cycle => {
    strats[cycle] = (parentVal, childVal) => {
        if (childVal) {
            if (parentVal) {
                return parentVal.concat(childVal)
            } else {
                return [childVal]
            }
        } else {
            return parentVal
        }
    }
})

export function mergeOptions(parent, child) {
    const options = {}

    for (let key in parent) {
        mergeFields(key)
    }

    for (let key in child) {
        // 合并父亲中不出现的属性
        if (!parent.hasOwnProperty(key)) {
            mergeFields(key)
        }
    }

    function mergeFields(key) {
        // 策略模式
        if (strats[key]) {
            options[key] = strats[key](parent[key], child[key])
        } else {
            //默认合并
            // 优先合并儿子的属性
            options[key] = child[key] || parent[key]
        }
    }


    return options
}