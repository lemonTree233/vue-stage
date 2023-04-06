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
      ob.dep.notify();
      return result;
    };
  });

  var id$1 = 0;

  // 每个属性有一个dep （属性就是被观察者） ， watcher就是观察者（属性变化了会通知观察者来更新） -》 观察者模式
  var Dep = /*#__PURE__*/function () {
    function Dep() {
      _classCallCheck(this, Dep);
      this.id = id$1++;
      this.subs = [];
    }
    _createClass(Dep, [{
      key: "depend",
      value: function depend() {
        // this.subs.push(Dep.target)   // 没有进行去重操作 相同数据会创建多个watcher
        Dep.target.addDep(this);
      }
    }, {
      key: "addWat",
      value: function addWat(watcher) {
        this.subs.push(watcher);
      }
    }, {
      key: "notify",
      value: function notify() {
        this.subs.forEach(function (watcher) {
          watcher.update();
        });
      }
    }]);
    return Dep;
  }();
  Dep.target = null;

  var Observer = /*#__PURE__*/function () {
    function Observer(data) {
      _classCallCheck(this, Observer);
      this.dep = new Dep();
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
  }(); // 递归遍历数组进行更新
  function dependArray(value) {
    for (var i = 0; i < value.length; i++) {
      var cur = value[i];
      cur.__ob__ && cur.__ob__.dep.depend();
      if (Array.isArray(cur)) {
        dependArray(cur);
      }
    }
  }
  function defineReactive(target, key, value) {
    //对象中的value 是对象的话 要递归进行数据劫持
    var childOB = observe(value);
    var dep = new Dep(); // 每一个属性都有一个Dep
    Object.defineProperty(target, key, {
      get: function get() {
        if (Dep.target) {
          dep.depend();
          if (childOB) {
            childOB.dep.depend();
            if (Array.isArray(value)) {
              dependArray(value);
            }
          }
        }
        return value;
      },
      set: function set(newValue) {
        if (newValue === value) return;
        observe(newValue);
        value = newValue;
        //数据变化 通知视图更新
        dep.notify();
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
    var ELEMENT_TYPE = 1; // 节点类型
    var TEXT_TYPE = 3; // 文本类型
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
      text = text.replace(/\s/g, ' ');
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
    var code = "_c('".concat(ast.tag, "',").concat(ast.attrs.length ? genprops(ast.attrs) : 'null', "\n    ").concat(ast.children.length ? ",".concat(children) : '', "\n    )");
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

  var id = 0;
  var Watcher = /*#__PURE__*/function () {
    // 每个组件分配一个watcher
    function Watcher(vm, fn, options) {
      _classCallCheck(this, Watcher);
      this.id = id++;
      this.getter = fn;
      this.renderWatcher = options;
      this.deps = []; // 后序实现计算属性 和 一些清理工作需要用到
      this.depsIDSet = new Set();
      this.get();
    }
    _createClass(Watcher, [{
      key: "get",
      value: function get() {
        Dep.target = this; // 静态属性赋值
        this.getter();
        Dep.target = null;
      }
    }, {
      key: "addDep",
      value: function addDep(dep) {
        if (!this.depsIDSet.has(dep.id)) {
          this.deps.push(dep);
          this.depsIDSet.add(dep.id);
          dep.addWat(this);
        }
      }
    }, {
      key: "update",
      value: function update() {
        // this.get()  // 重新渲染
        queueWatcher(this); //
      }
    }, {
      key: "run",
      value: function run() {
        console.log('run');
        this.get();
      }
    }]);
    return Watcher;
  }();
  var queue = [];
  var has = {};
  var flag = false;
  function flushSchedulerQueue() {
    var flushQueue = queue.slice(0);
    queue = [];
    has = {};
    flag = false;
    flushQueue.forEach(function (item) {
      return item.run();
    }); //在数据更新的过程中 如果数据再次发生变化 则放进下一轮的更新中
  }

  function queueWatcher(watcher) {
    var id = watcher.id;
    if (!has[id]) {
      // 实现去重操作  相同属性值变化只更新一次
      queue.push(watcher);
      has[id] = true;
      if (!flag) {
        nextTick(flushSchedulerQueue);
        flag = true;
      }
    }
  }
  var callbacks = [];
  var waiting = false;
  function flushCallbacks() {
    var cbs = callbacks.slice(0);
    callbacks = [];
    waiting = false;
    cbs.forEach(function (cb) {
      return cb();
    });
  }
  var timerFunc;
  if (Promise) {
    timerFunc = function timerFunc() {
      Promise.resolve().then(flushCallbacks);
    };
  } else if (MutationObserver) {
    var observer = new MutationObserver(flushCallbacks);
    var textNode = document.createTextNode(1);
    observer.observe(textNode, {
      characterData: true
    });
    timerFunc = function timerFunc() {
      textNode.textContent = 2;
    };
  } else if (setImmediate) {
    timerFunc = function timerFunc() {
      return setImmediate(flushCallbacks);
    };
  } else {
    timerFunc = function timerFunc() {
      return setTimeout(flushCallbacks, 0);
    };
  }
  function nextTick(cb) {
    callbacks.push(cb);
    if (!waiting) {
      waiting = true;
      timerFunc(flushCallbacks);
    }
  }
  // 每个属性增加一个dep 目的是收集watcher

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
    function updateComponent() {
      vm._update(vm._render());
    }
    vm.$el = el;
    //1. 调用render方法产生虚拟节点 虚拟DOM
    var watcher = new Watcher(vm, updateComponent, true);
    console.log(watcher, 'watcher');
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
      //tag 是undefined 文本节点
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

  // 执行具体的某一个生命周期
  function callHook(vm, hook) {
    var handlers = vm.$options[hook];
    if (handlers) {
      handlers.forEach(function (handler) {
        return handler.call(vm);
      });
    }
  }

  var strats = {};
  var lifeCycleArr = ['beforeCreate', 'created', 'beforeMount', 'mounted', 'beforeUpdate', 'updated', 'beforeDestroy', 'destroyed', 'activated', 'deactivated', 'errorCaptured', 'serverPrefetch'];
  lifeCycleArr.forEach(function (cycle) {
    strats[cycle] = function (parentVal, childVal) {
      if (childVal) {
        if (parentVal) {
          return parentVal.concat(childVal);
        } else {
          return [childVal];
        }
      } else {
        return parentVal;
      }
    };
  });
  function mergeOptions(parent, child) {
    var options = {};
    for (var key in parent) {
      mergeFields(key);
    }
    for (var _key in child) {
      // 合并父亲中不出现的属性
      if (!parent.hasOwnProperty(_key)) {
        mergeFields(_key);
      }
    }
    function mergeFields(key) {
      // 策略模式
      if (strats[key]) {
        options[key] = strats[key](parent[key], child[key]);
      } else {
        //默认合并
        // 优先合并儿子的属性
        options[key] = child[key] || parent[key];
      }
    }
    return options;
  }

  //扩展vue的初始化
  var initMixin = function initMixin(Vue) {
    //用于初始化操作
    Vue.prototype._init = function (options) {
      var vm = this;

      //用户定义的全局指令、过滤器 都会挂载到实例上
      vm.$options = mergeOptions(this.constructor.options, options);
      callHook(vm, 'beforeCreate');
      //初始化状态
      initState(vm);
      callHook(vm, 'created');
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

  function initGloablAPI(Vue) {
    Vue.options = {};
    Vue.mixin = function (mixin) {
      this.options = mergeOptions(this.options, mixin);
      return this;
    };
  }

  function Vue(options) {
    this._init(options);
  }
  Vue.prototype.$nextTick = nextTick;
  initMixin(Vue);
  initLifeCycle(Vue);
  initGloablAPI(Vue);

  return Vue;

}));
//# sourceMappingURL=vue.js.map
