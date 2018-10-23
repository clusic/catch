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