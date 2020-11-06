```jsx
const onCancel = data => alert('Canceled!');
const onSubmit = data => alert(JSON.stringify(data));

<Form data={{bar: false, baz: false, foo: 'Foo'}} onReject={onCancel} onResolve={onSubmit}>
  {({ data, onChange }) => (
    <>
      <label>
        <input name="foo" onChange={onChange} type="text" value={data.foo} />
      </label>
      <label>
        Bar
        <input checked={data.bar} name="bar" onChange={onChange} type="checkbox" />
      </label>
      <label>
        Baz
        <input checked={data.baz} name="baz" onChange={onChange} type="checkbox" />
      </label>
    </>
  )}
</Form>
```
