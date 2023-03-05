(function (global, factory) {
  typeof exports === 'object' && typeof module !== 'undefined' ? module.exports = factory() :
  typeof define === 'function' && define.amd ? define(factory) :
  (global = typeof globalThis !== 'undefined' ? globalThis : global || self, global.Vue = factory());
})(this, (function () { 'use strict';

  function _iterableToArrayLimit(arr, i) {
    var _i = null == arr ? null : "undefined" != typeof Symbol && arr[Symbol.iterator] || arr["@@iterator"];
    if (null != _i) {
      var _s,
        _e,
        _x,
        _r,
        _arr = [],
        _n = !0,
        _d = !1;
      try {
        if (_x = (_i = _i.call(arr)).next, 0 === i) {
          if (Object(_i) !== _i) return;
          _n = !1;
        } else for (; !(_n = (_s = _x.call(_i)).done) && (_arr.push(_s.value), _arr.length !== i); _n = !0);
      } catch (err) {
        _d = !0, _e = err;
      } finally {
        try {
          if (!_n && null != _i.return && (_r = _i.return(), Object(_r) !== _r)) return;
        } finally {
          if (_d) throw _e;
        }
      }
      return _arr;
    }
  }
  function _typeof(obj) {
    "@babel/helpers - typeof";

    return _typeof = "function" == typeof Symbol && "symbol" == typeof Symbol.iterator ? function (obj) {
      return typeof obj;
    } : function (obj) {
      return obj && "function" == typeof Symbol && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj;
    }, _typeof(obj);
  }
  function _classCallCheck(instance, Constructor) {
    if (!(instance instanceof Constructor)) {
      throw new TypeError("Cannot call a class as a function");
    }
  }
  function _defineProperties(target, props) {
    for (var i = 0; i < props.length; i++) {
      var descriptor = props[i];
      descriptor.enumerable = descriptor.enumerable || false;
      descriptor.configurable = true;
      if ("value" in descriptor) descriptor.writable = true;
      Object.defineProperty(target, _toPropertyKey(descriptor.key), descriptor);
    }
  }
  function _createClass(Constructor, protoProps, staticProps) {
    if (protoProps) _defineProperties(Constructor.prototype, protoProps);
    if (staticProps) _defineProperties(Constructor, staticProps);
    Object.defineProperty(Constructor, "prototype", {
      writable: false
    });
    return Constructor;
  }
  function _slicedToArray(arr, i) {
    return _arrayWithHoles(arr) || _iterableToArrayLimit(arr, i) || _unsupportedIterableToArray(arr, i) || _nonIterableRest();
  }
  function _arrayWithHoles(arr) {
    if (Array.isArray(arr)) return arr;
  }
  function _unsupportedIterableToArray(o, minLen) {
    if (!o) return;
    if (typeof o === "string") return _arrayLikeToArray(o, minLen);
    var n = Object.prototype.toString.call(o).slice(8, -1);
    if (n === "Object" && o.constructor) n = o.constructor.name;
    if (n === "Map" || n === "Set") return Array.from(o);
    if (n === "Arguments" || /^(?:Ui|I)nt(?:8|16|32)(?:Clamped)?Array$/.test(n)) return _arrayLikeToArray(o, minLen);
  }
  function _arrayLikeToArray(arr, len) {
    if (len == null || len > arr.length) len = arr.length;
    for (var i = 0, arr2 = new Array(len); i < len; i++) arr2[i] = arr[i];
    return arr2;
  }
  function _nonIterableRest() {
    throw new TypeError("Invalid attempt to destructure non-iterable instance.\nIn order to be iterable, non-array objects must have a [Symbol.iterator]() method.");
  }
  function _toPrimitive(input, hint) {
    if (typeof input !== "object" || input === null) return input;
    var prim = input[Symbol.toPrimitive];
    if (prim !== undefined) {
      var res = prim.call(input, hint || "default");
      if (typeof res !== "object") return res;
      throw new TypeError("@@toPrimitive must return a primitive value.");
    }
    return (hint === "string" ? String : Number)(input);
  }
  function _toPropertyKey(arg) {
    var key = _toPrimitive(arg, "string");
    return typeof key === "symbol" ? key : String(key);
  }

  var oldArrayProto = Array.prototype;
  var newArrayProto = Object.create(oldArrayProto);
  var methods = ['push', 'pop', 'shift', 'unshift', 'reverse', 'splice', 'sort'];
  methods.forEach(function (method) {
    newArrayProto[method] = function () {
      var _oldArrayProto$method;
      var ob = this.__ob__;
      console.log(ob, 'ob');
      for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
        args[_key] = arguments[_key];
      }
      var result = (_oldArrayProto$method = oldArrayProto[method]).call.apply(_oldArrayProto$method, [this].concat(args));
      var inserted;
      switch (method) {
        case 'push':
        case 'unshift':
          inserted = args;
          break;
        case 'splice':
          //arr.splice(0, 1, {a: 1})
          inserted = arr.slice(2);
          break;
      }
      if (inserted) {
        //需要对数组中新增的对象进行劫持
        ob.observeArray(inserted);
      }
      return result;
    };
  });

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);
      //如果data是对象的话 就会出现循环遍历的情况 所以要避免循环遍历 __ob__ enumerable设置为false
      Object.defineProperty(data, '__ob__', {
        value: this,
        enumerable: false
      });
      // data.__ob__ = this  //给观测类添加一个属性 方便调用类中的方法 同时也可以利用该属性做判断对象是否已经监测过了
      if (Array.isArray(data)) {
        data.__proto__ = newArrayProto;
        //重写数组的七个方法
        this.observeArray(data);
      } else {
        //对data中已经存在的属性进行劫持 新增的和删除的无法劫持 需要使用$set $delete
        this.walk(data);
      }
    }
    _createClass(Observer, [{
      key: "observeArray",
      value: function observeArray(data) {
        //观测数组中的对象
        data.forEach(function (item) {
          return observe(item);
        });
      }
    }, {
      key: "walk",
      value: function walk(data) {
        Object.keys(data).forEach(function (key) {
          return defineReactive(data, key, data[key]);
        });
      }
    }]);
    return Observer;
  }();
  function defineReactive(target, key, value) {
    //对象中的value 是对象的话 要递归进行数据劫持
    observe(value);
    Object.defineProperty(target, key, {
      get: function get() {
        console.log('用户获取值了', key);
        return value;
      },
      set: function set(newValue) {
        console.log('用户设置值了');
        if (newValue === value) return;
        value = newValue;
      }
    });
  }
  function observe(data) {
    //只对 对象进行劫持
    if (_typeof(data) !== 'object' || data === null) return;
    if (data.__ob__ instanceof Observer) return; //对象已经被代理过了
    return new Observer(data);
  }

  //初始化状态
  function initState(vm) {
    var ops = vm.$options;
    if (ops.data) {
      initData(vm);
    }
  }
  function proxy(vm, target, key) {
    Object.defineProperty(vm, key, {
      get: function get() {
        return vm[target][key];
      },
      set: function set(newValue) {
        vm[target][key] = newValue;
      }
    });
  }
  function initData(vm) {
    var data = vm.$options.data; //data可能是函数和对象

    data = typeof data === 'function' ? data.call(vm) : data;
    vm._data = data;

    //对数据进行劫持 vue2采用的是Object.defineProperty
    observe(data);

    //将vm._data进行代理 便于访问
    for (var key in data) {
      proxy(vm, '_data', key);
    }
  }

  var ncname = "[a-zA-Z_][\\-\\.0-9_a-zA-Z]*";
  var qnameCapture = "((?:".concat(ncname, "\\:)?").concat(ncname, ")");
  var startTagOpen = new RegExp("^<".concat(qnameCapture)); // 他匹配到的分组是一个 标签名  <xxx 匹配到的是开始 标签的名字
  var endTag = new RegExp("^<\\/".concat(qnameCapture, "[^>]*>")); // 匹配的是</xxxx>  最终匹配到的分组就是结束标签的名字
  var attribute = /^\s*([^\s"'<>\/=]+)(?:\s*(=)\s*(?:"([^"]*)"+|'([^']*)'+|([^\s"'=<>`]+)))?/; // 匹配属性
  // 第一个分组就是属性的key value 就是 分组3/分组4/分组五
  var startTagClose = /^\s*(\/?)>/; // <div> <br/>

  function parseHTML(html) {
    var ELEMENT_TYPE = 1;
    var TEXT_TYPE = 3;
    var stack = [];
    var currentParent; //用于指向栈中的最后一个元素
    var root;

    //最终需要转化成AST语法树
    function createASTElement(tag, attrs) {
      return {
        tag: tag,
        type: ELEMENT_TYPE,
        children: [],
        attrs: attrs,
        parent: null
      };
    }
    function start(tag, attrs) {
      var node = createASTElement(tag, attrs);
      if (!root) {
        //根节点赋值
        root = node;
      }
      if (currentParent) {
        node.parent = currentParent;
        // 节点是当前父节点的子节点
        currentParent.children.push(node);
      }
      stack.push(node);
      currentParent = node; //curentParent为栈中最后一个
    }

    function _char(text) {
      // 去重操作
      text = text.replace(/\s/g, '');
      text && currentParent.children.push({
        type: TEXT_TYPE,
        text: text,
        parent: currentParent
      });
    }
    function end(tag) {
      stack.pop(); //弹出栈中最后一个节点
      currentParent = stack[stack.length - 1];
    }
    function advance(n) {
      html = html.substring(n);
    }
    function parseStartag() {
      var start = html.match(startTagOpen);
      if (start) {
        var match = {
          tagName: start[1],
          attrs: []
        };
        advance(start[0].length);
        var attr, endMatch;
        while (!(endMatch = html.match(startTagClose)) && (attr = html.match(attribute))) {
          advance(attr[0].length);
          match.attrs.push({
            name: attr[1],
            value: attr[3] || attr[4] || attr[5]
          });
        }
        if (endMatch) {
          advance(endMatch[0].length);
        }
        return match;
      }
      //匹配属性

      return false;
    }
    while (html) {
      var textEnd = html.indexOf('<'); //如果indexof中的索引是0 则说明是个标签 textEnd为0 说明是开始或者结束标签
      if (textEnd === 0) {
        var startTagMatch = parseStartag();
        if (startTagMatch) {
          start(startTagMatch.tagName, startTagMatch.attrs);
          continue;
        }
        var endTagName = html.match(endTag);
        if (endTagName) {
          advance(endTagName[0].length);
          end(endTagName[1]);
          continue;
        }
        break;
      }
      if (textEnd > 0) {
        var text = html.substring(0, textEnd);
        if (text) {
          _char(text);
          advance(text.length);
        }
      }
    }
    return root;
  }

  //生成属性
  function genprops(attrs) {
    var str = '';
    var _loop = function _loop() {
      if (attrs[i].name === 'style') {
        var obj = {};
        attrs[i].value.split(';').forEach(function (item) {
          var _item$split = item.split(':'),
            _item$split2 = _slicedToArray(_item$split, 2),
            key = _item$split2[0],
            value = _item$split2[1];
          key = key.trim();
          value = value.trim();
          obj[key] = value;
        });
        attrs[i].value = obj;
      }
      str += "".concat(attrs[i].name, ":").concat(JSON.stringify(attrs[i].value), ",");
    };
    for (var i = 0; i < attrs.length; i++) {
      _loop();
    }
    //去掉最末端的逗号
    return "{".concat(str.slice(0, -1), "}");
  }

  //处理节点的children
  function genChildren(children) {
    return children.map(function (child) {
      return gen(child);
    }).join(',');
  }
  var defaultTagRE = /\{\{((?:.|\r?\n)+?)\}\}/g; // {{ asdsadsa }}  匹配到的内容就是我们表达式的变量
  function gen(node) {
    if (node.type === 1) {
      return codegen(node);
    } else {
      // 文本节点
      var text = node.text;
      if (!defaultTagRE.test(text)) {
        return "_v(".concat(JSON.stringify(text), ")");
      } else {
        // _v(_s(name)+ 'hello' + _s(name))
        var tokens = [];
        var match;
        //正则有g 会记录位置 为了循环能够一直执行 需要重置lastIndex位置
        defaultTagRE.lastIndex = 0;
        var lastIndex = 0;
        while (match = defaultTagRE.exec(text)) {
          // hello  {{ name }} hello {{age}} hi
          //根据索引的位置 获取差值表达式 和 普通文本
          var index = match.index;
          if (index > lastIndex) {
            tokens.push(JSON.stringify(text.slice(lastIndex, index)));
          }
          tokens.push("_s(".concat(match[1].trim(), ")"));
          lastIndex = index + match[0].length;
        }
        //截取最后的普通文本
        if (lastIndex < text.length) {
          tokens.push(JSON.stringify(text.slice(lastIndex)));
        }
        return "_v(".concat(tokens.join('+'), ")");
      }
    }
  }

  //代码生成方法
  function codegen(ast) {
    var children = genChildren(ast.children);
    var code = "_c('".concat(ast.tag, "', \n    ").concat(ast.attrs.length ? genprops(ast.attrs) : 'null', "\n    ").concat(ast.children.length ? ",".concat(children) : '', "\n    )");
    return code;
  }
  // 对模板进行编译处理
  function compileToFunction(template) {
    // 1. 将template转化成AST语法树
    var ast = parseHTML(template);
    //2. 生成render方法  （render方法执行后的结果就是虚拟DOM）
    var code = codegen(ast);

    //模板引擎的实现原理 就是 with + new Function
    code = "with(this){return ".concat(code, "}");
    var render = new Function(code);
    return render;
  }

  function createElementVnode(vm, tag, data) {
    var key = data === null || data === void 0 ? void 0 : data.key;
    key ? delete data.key : '';
    for (var _len = arguments.length, children = new Array(_len > 3 ? _len - 3 : 0), _key = 3; _key < _len; _key++) {
      children[_key - 3] = arguments[_key];
    }
    return vnode(vm, tag, key, data, children);
  }
  function createTextVnode(vm, text) {
    return vnode(vm, undefined, undefined, undefined, undefined, text);
  }
  /*
  * ast 是语法层面的转化 描述得是语法本身（js css html）
  *   而虚拟DOM描述的是DOM元素 可以增加一些自定义属性*/
  function vnode(vm, tag, key, props, children, text) {
    return {
      vm: vm,
      tag: tag,
      key: key,
      props: props,
      children: children,
      text: text
    };
  }

  function initLifeCycle(Vue) {
    //根据虚拟DOM生成真实DOM
    Vue.prototype._update = function (vnode) {
      var vm = this;
      var el = vm.$el;
      //既有初始化功能 也有更新的功能
      vm.$el = patch(el, vnode);
    };
    //_c('div',{},children)  div null undefined
    Vue.prototype._c = function () {
      return createElementVnode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };
    Vue.prototype._s = function (value) {
      if (_typeof(value) !== 'object') return value;
      return JSON.stringify(value);
    };
    Vue.prototype._v = function () {
      return createTextVnode.apply(void 0, [this].concat(Array.prototype.slice.call(arguments)));
    };
    //生成虚拟DOM 虚拟节点
    Vue.prototype._render = function () {
      return this.$options.render.call(this);
    };
  }
  function mountComponent(vm, el) {
    vm.$el = el;
    //1. 调用render方法产生虚拟节点 虚拟DOM
    vm._update(vm._render());
    //2. 根据虚拟DOM产生真实DOM

    //3. 插入到el元素中
  }

  function createElm(vnode) {
    var tag = vnode.tag,
      props = vnode.props,
      children = vnode.children,
      text = vnode.text;
    if (typeof tag === 'string') {
      vnode.el = document.createElement(tag);
      genProps(vnode.el, props);
      children.forEach(function (child) {
        vnode.el.appendChild(createElm(child));
      });
    } else {
      vnode.el = document.createTextNode(text);
    }
    return vnode.el;
  }
  function genProps(el, props) {
    // style: { color: 'red', backgroundColor: yellow }
    for (var key in props) {
      if (key === 'style') {
        for (var styleName in props[key]) {
          el[styleName] = props[key][styleName];
        }
      } else {
        el.setAttribute(key, props[key]);
      }
    }
  }
  function patch(oldNode, vnode) {
    var isRealElement = oldNode.nodeType;
    if (isRealElement) {
      var elm = oldNode; //获取真实元素

      var parentElm = elm.parentNode;
      var newElm = createElm(vnode);
      //删除旧节点 插入新节点
      parentElm.insertBefore(newElm, oldNode.nextSibling);
      parentElm.removeChild(elm);
      return newElm;
    }
  }

  // vue核心流程 1） 创造了响应式数据  2） 模板转换成ast语法树
  // 3) 将ast语法树转换了render函数 4) 后续每次数据更新可以只执行render函数 (无需再次执行ast转化的过程)
  // render函数会去产生虚拟节点（使用响应式数据）
  // 根据生成的虚拟节点创造真实的DOM

  //扩展vue的初始化
  var initMixin = function initMixin(Vue) {
    //用于初始化操作
    Vue.prototype._init = function (options) {
      var vm = this;
      vm.$options = options;
      //初始化状态
      initState(vm);
      if (options.el) {
        vm.$mount(options.el);
      }
    };
    //挂载操作
    Vue.prototype.$mount = function (el) {
      var vm = this;
      var ops = vm.$options;
      el = document.querySelector(el);
      if (!ops.render) {
        var template;
        if (!ops.template && el) {
          //没写template 但是写了el
          template = el.outerHTML;
        } else {
          // 有template 就用template
          if (el) template = ops.template;
        }
        if (template) {
          //对模板进行编辑
          var render = compileToFunction(template);
          ops.render = render;
        }
      }

      //挂载组件
      mountComponent(vm, el);
    };
  };

  function Vue(options) {
    this._init(options);
  }
  initMixin(Vue);
  initLifeCycle(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
