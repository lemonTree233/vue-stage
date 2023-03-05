import { parseHTML } from "./parse";

//生成属性
function genprops(attrs) {
    let str = ''
    for(let i= 0;i<attrs.length; i++){
        if(attrs[i].name === 'style'){
            let obj = {}
            attrs[i].value.split(';').forEach(item =>{
                let [key, value] = item.split(':')
                key = key.trim()
                value = value.trim()
                obj[key] = value
            })
            attrs[i].value = obj
        }
        str += `${attrs[i].name}:${JSON.stringify(attrs[i].value) },`
    }
    //去掉最末端的逗号
    return `{${str.slice(0,-1)}}`
}

//处理节点的children
function genChildren(children) {
    return children.map(child => gen(child)).join(',')
}
const defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{ asdsadsa }}  匹配到的内容就是我们表达式的变量
function gen(node) {
    if(node.type === 1){
        return codegen(node)
    }else{
        // 文本节点
         let text = node.text
         if(!defaultTagRE.test(text)){
             return `_v(${JSON.stringify(text)})`
         }else{
             // _v(_s(name)+ 'hello' + _s(name))
             let tokens = []
             let match
             //正则有g 会记录位置 为了循环能够一直执行 需要重置lastIndex位置
             defaultTagRE.lastIndex = 0
             let lastIndex = 0
             while(match = defaultTagRE.exec(text)){        // hello  {{ name }} hello {{age}} hi
                 //根据索引的位置 获取差值表达式 和 普通文本
                 let index = match.index
                 if(index > lastIndex){
                     tokens.push(JSON.stringify(text.slice(lastIndex, index)))
                 }
                 tokens.push(`_s(${match[1].trim()})`)
                 lastIndex = index + match[0].length

             }
             //截取最后的普通文本
             if(lastIndex < text.length){
                 tokens.push(JSON.stringify(text.slice(lastIndex)))
             }
             return `_v(${tokens.join('+')})`
         }
    }
}

//代码生成方法
function codegen(ast) {
    const children = genChildren(ast.children)
    const code = (`_c('${ast.tag}', 
    ${ast.attrs.length ? genprops(ast.attrs) : 'null' }
    ${ast.children.length ? `,${children}` : ''}
    )`)
    return code
}
// 对模板进行编译处理
export function compileToFunction(template) {
    // 1. 将template转化成AST语法树
    let ast = parseHTML(template)
    //2. 生成render方法  （render方法执行后的结果就是虚拟DOM）
    let code = codegen(ast)

    //模板引擎的实现原理 就是 with + new Function
    code = `with(this){return ${code}}`
    let render = new Function(code)
    return render

}