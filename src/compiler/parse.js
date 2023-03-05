const ncname = `[a-zA-Z_][\\-\\.0-9_a-zA-Z]*`;
const qnameCapture = `((?:${ncname}\\:)?${ncname})`;
const startTagOpen = new RegExp(`^<${qnameCapture}`); // 他匹配到的分组是一个 标签名  <xxx 匹配到的是开始 标签的名字
const endTag = new RegExp(`^<\\/${qnameCapture}[^>]*>`);  // 匹配的是</xxxx>  最终匹配到的分组就是结束标签的名字
const attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/;  // 匹配属性
// 第一个分组就是属性的key value 就是 分组3/分组4/分组五
const startTagClose = /^\s*(\/?)>/;  // <div> <br/>

export function parseHTML(html) {

    const ELEMENT_TYPE = 1
    const TEXT_TYPE = 3
    const stack = []
    let currentParent   //用于指向栈中的最后一个元素
    let root

    //最终需要转化成AST语法树
    function createASTElement(tag, attrs) {
        return {
            tag,
            type: ELEMENT_TYPE,
            children: [],
            attrs,
            parent: null
        }
    }

    function start(tag, attrs) {
        let node = createASTElement(tag, attrs)
        if(!root){  //根节点赋值
            root = node
        }
        if(currentParent){
            node.parent = currentParent
            // 节点是当前父节点的子节点
            currentParent.children.push(node)
        }
        stack.push(node)
        currentParent = node    //curentParent为栈中最后一个
    }
    function char(text) {
        // 去重操作
        text = text.replace(/\s/g,'')
        text && currentParent.children.push({
            type: TEXT_TYPE,
            text,
            parent: currentParent
        })
    }

    function end(tag) {
        let node = stack.pop()  //弹出栈中最后一个节点
        currentParent = stack[stack.length - 1]
    }

    function advance(n) {
        html = html.substring(n)
    }
    function parseStartag(){
        const start = html.match(startTagOpen)
        if(start){
            let match = {
                tagName: start[1],
                attrs: []
            }
            advance(start[0].length)
            let attr, endMatch
            while(!(endMatch = html.match(startTagClose)) && (attr = html.match(attribute))){
                advance(attr[0].length)
                match.attrs.push({name: attr[1], value: attr[3] || attr[4] || attr[5]})
            }
            if(endMatch){
                advance(endMatch[0].length)
            }
            return match
        }
        //匹配属性

        return false
    }

    while(html){
        let textEnd = html.indexOf('<')   //如果indexof中的索引是0 则说明是个标签 textEnd为0 说明是开始或者结束标签
        if(textEnd === 0){
            const startTagMatch = parseStartag()
            if(startTagMatch){
                start(startTagMatch.tagName, startTagMatch.attrs)
                continue
            }
            let endTagName = html.match(endTag)
            if(endTagName){
                advance(endTagName[0].length)
                end(endTagName[1])
                continue
            }
            break
        }
        if(textEnd > 0){
            let text = html.substring(0, textEnd)
            if(text){
                char(text)
                advance(text.length)
            }
        }
    }
    return root
}