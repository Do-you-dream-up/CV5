```jsx static
const onFoo = () => ();
const onBar = () => ();
const actions = [
  {action: onFoo, text: 'Foo'},
  {action: onBar, text: 'Bar'},
  {text: 'Baz', type: 'submit'},
];
```

```jsx static
<Actions actions={actions} />
```
