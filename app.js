const MakeCatch = require('./index');
const MakeError = require('./error');
module.exports = async app => {
  app.MakeCatch = MakeCatch;
  app.use(async (ctx, next) => {
    await MakeCatch(async roll => {
      defineReactive(ctx, 'Rollback', roll);
      defineReactive(ctx, 'error', MakeError);
      defineReactive(ctx, 'sendResult', (data, status) => {
        ctx.body = { status: status || 200, data };
        ctx.status = 200;
      });
      await next();
    }, error => {
      ctx.body = {
        status: error.status || 500,
        message: error.message
      };
      ctx.status = 200;
      ctx.app.Logger.error(error);
    })
  });
};

function defineReactive(ctx, name, target) {
  Object.defineProperty(ctx, name, {
    get() {
      return target;
    }
  })
}