```jsx
const onSubmit = ({ email, withForget, withGet }) => (
  alert(`Submitted: '${email}','${withGet}', '${withForget}'`)
);

<Gdpr onResolve={onSubmit} scroll={false} />
```
