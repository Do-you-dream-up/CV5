```jsx static
const [ thinking, setThinking ] = useState(false);
const onFoo = () => {
  setThinking(true);
  api.foo().then(() => setThinking(false));
};
const actions = <Actions ... />
const html = '<p>Foo. Bar.</p>'
```

```jsx static
<Bubble actions={actions} component="li" html={html} thinking={thinking} type="response" />
```
