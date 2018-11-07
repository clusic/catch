# @clusic / Catch module

主要用来解决回滚问题。

## Install

```shell
npm i @clusic/catch
```

## Usage

```javascript
const Catcher = require('@clusic/catch');

await Catcher(roll => {
  fs.writeFileSync('/test', 'aaaaaa', 'utf8');
  roll(() => fs.unlinkSync('/test')); // 回滚行为
  throw new Error('this is error');
}, error);

function error(e) {
  console.log('catch error', e);
}
```

## Arguments

- callback {function} 具体行为代码
- error {function} 错误处理代码

> 如果没有定义error，则将`throw error`。callback函数自带一个回滚函数即`roll`。

## In Clusic

### onResponseError

请求级别接管错误输出

```javascript
// app.bootstrap.js
module.exports = app => {
  app.use(async (ctx, next) => {
    ctx.onResponseError(error => {
      ctx.status = error.status || 500;
      ctx.body = {
        error: error.messasge
      }
    })
  })
}
```

### onErrorCatch

绑定回滚物理事件

```javascript
fs.writeFileSync('/test.txt', 'hello world', 'utf8');
ctx.onErrorCatch(() => fs.unlinkSync('/test.txt'));
```

### error

生成一个带status的错误信息

```javascript
throw ctx.error('error', 503);
// 相当于
const err = new Error('error');
err.status = 503;
throw err;
```

### sendResult

发送成功结果

```javascript
ctx.sendResult({
  a: 1
}, 126000);
// 相当于
ctx.body = { status: 126000, data: { a: 1 } };
ctx.status = 200;
```