```js static
const menu = [
  [
    {id: 'foo', onClick: onFoo, text: 'Foo'},
  ],
  [
    {id: 'bar', onClick: onBar, text: 'Bar'},
    {id: 'baz', onClick: onBaz, text: 'Baz'},
  ],
];
```

```jsx static
<Menu children="Toggle" component={Button} items={menu} selected="baz" />
```
