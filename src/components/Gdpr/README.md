```jsx
const onError = () => alert('Canceled!');
const onSuccess = () => alert('Success!');

<Gdpr onReject={onError} onResolve={onSuccess} />
```
