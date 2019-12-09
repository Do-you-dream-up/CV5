```js static
const onCancel = () => {};
const onSubmit = () => {};
```

```jsx static
<Form data={{bar: false, baz: false, foo: ''}} onReject={onCancel} onResolve={onSubmit}>
  {({ data, onChange }) => (
    <>
      <input name="email" onChange={onChange} type="text" value={data.foo} />
      <input checked={data.bar} name="bar" onChange={onChange} type="checkbox" />
      <input checked={data.baz} name="baz" onChange={onChange} type="checkbox" />
    </>
  )}
</Form>
```
