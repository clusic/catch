const MakeCatch = require('./index');
module.exports = async app => {
  app.MakeCatch = MakeCatch;
  app.feedCatch = async callback => await MakeCatch(callback, error => error);
};