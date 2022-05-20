class MultipleProxySandbox {

  active() {
    this.sandboxRunning = true;
  }

  inactive() {
    this.sandboxRunning = false;
  }

  assign(obj) {
    for (const objKey in obj) {
      this.proxy[objKey] = obj[objKey];
    }
  }

  /**
   * 构造函数
   * @param {*} name 沙箱名称
   * @param {*} context 共享的上下文
   * @returns
   */
  constructor(name, context = {}) {
    this.name = name;
    this.proxy = null;
    const fakeWindow = Object.create({});
    this.proxy = new Proxy(fakeWindow, {
      set: (target, name, value) => {
        if (this.sandboxRunning) {
          if (Object.keys(context).includes(name)) {
            context[name] = value;
          }
          target[name] = value;
        }
        return true;
      },
      get: (target, name) => {
        // 优先使用共享对象
        if (Object.keys(context).includes(name)) {
          return context[name];
        }
        return target[name];
      },
    });
  }
}

// module.exports = MultipleProxySandbox;
