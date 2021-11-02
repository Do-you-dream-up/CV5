```jsx
const onSubmit = ({ email, withForget, withGet }) =>
  alert(`Submitted: '${email}','${withGet}', '${withForget}'`);

<PromptEmail onResolve={onSubmit} scroll={false} />;
```
