```jsx static
const onFoo = () => ();
const onBar = () => ();
const actions = [
  {action: onFoo, text: 'Foo'},
  {action: onBar, text: 'Bar'},
];
const html = '<p>Foo. Bar.</p>'
```

```jsx static
<Bubble actions={actions} component="li" html={html} type="response" />
```
