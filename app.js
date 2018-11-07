const MakeCatch = require('./index');
const MakeError = require('./error');
const { EventEmitter } = require('events');
module.exports = async app => {
  app.MakeCatch = MakeCatch;
  app.use(async (ctx, next) => {
    const event = new EventEmitter();

    await MakeCatch(async roll => {
      defineReactive(ctx, 'onResponseError', callback => event.on('error catch', callback));
      defineReactive(ctx, 'onErrorCatch', roll);
      defineReactive(ctx, 'error', MakeError);
      defineReactive(ctx, 'sendResult', sendResult(ctx));
      await next();
    }, onError);

    function onError(error) {
      if (event.listenerCount('error catch') > 0) {
        event.emit('error catch', error);
      } else {
        ctx.status = 200;
        ctx.body = {
          status: error.status || 500,
          message: error.message
        };
      }
      ctx.app.Logger.error(error);
    }
  });
};

function defineReactive(ctx, name, target) {
  Object.defineProperty(ctx, name, {
    get() {
      return target;
    }
  })
}

function sendResult(ctx) {
  return (data, status) => {
    ctx.body = { status: status || 200, data };
    ctx.status = 200;
  }
}