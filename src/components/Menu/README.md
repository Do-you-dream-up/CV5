```jsx
const onToggle = text => () => alert(text);
const menu = [
  [
    {id: 'foo', onClick: onToggle('Foo!'), text: 'Do foo'},
  ],
  [
    {id: 'bar', onClick: onToggle('Bar!'), text: 'Or bar'},
    {id: 'baz', onClick: onToggle('Baz!'), text: 'Maybe baz instead'},
  ],
];

<Menu children="Toggle" component="button" items={menu} selected="baz" />
```
