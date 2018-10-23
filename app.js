const MakeCatch = require('./index');
const MakeError = require('./error');
module.exports = async app => {
  app.MakeCatch = MakeCatch;
  app.use(async (ctx, next) => {
    await MakeCatch(async roll => {
      ctx.Rollback = roll;
      ctx.error = MakeError;
      await next();
    }, error => {
      ctx.body = {
        status: error.status || 500,
        message: error.message
      };
      ctx.status = 200;
    })
  });
};