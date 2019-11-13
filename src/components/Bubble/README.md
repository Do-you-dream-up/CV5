```jsx static
const [ thinking, setThinking ] = useState(false);
const onFoo = () => {
  setThinking(true);
  api.foo().then(() => setThinking(false));
};
const onBar = () => ();
const actions = [
  {action: onFoo, text: 'Foo'},
  {action: onBar, text: 'Bar'},
];
const html = '<p>Foo. Bar.</p>'
```

```jsx static
<Bubble actions={actions} component="li" html={html} thinking={thinking} type="response" />
```
