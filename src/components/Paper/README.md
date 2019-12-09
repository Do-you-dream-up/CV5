```js static
const onFoo = () => {};
const onBar = () => {};
const actions = [
  {action: onFoo, text: 'Foo'},
  {action: onBar, text: 'Bar'},
];
```

```jsx static
<Paper actions={actions} title="Some Title">
  Some content.
</Paper>
```
