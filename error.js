const toString = Object.prototype.toString;
module.exports = (msg, code) => {
  let err;
  if (msg instanceof Error || toString.call(msg) === '[object Error]') {
    err = msg;
  } else {
    err = new Error(msg);
  }
  if (code) {
    if (!isNaN(code)) {
      code = Number(code);
      if (code < 100 || code > 60000) {
        code = 500;
      }
    } else {
      code = 500;
    }
    err.status = code;
  }
  return err;
};