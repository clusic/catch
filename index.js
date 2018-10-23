const catchers = Symbol('ContextCatcher#catchers');
const catcher = Symbol('ContextCatcher#catcher');
const rollback = Symbol('ContextCatcher#')

class ContextCatcher {
  constructor() {
    this[catchers] = [];
  }

  [catcher](callback) {
    this[catchers].push(callback);
    return this;
  }

  async [rollback]() {
    let i = this[catchers].length;
    while (i--) await this[catchers][i]();
  }
}

module.exports = async (callback, errorHandler) => {
  const context = new ContextCatcher();
  try{ return await callback(context[catcher].bind(context)); } catch(e) {
    await context[rollback]();
    if (typeof errorHandler === 'function') return await errorHandler(e);
    throw e;
  }
}