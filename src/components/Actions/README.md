```jsx static
const menuItems = []
const onFoo = () => {};
const onBar = () => {};
const actions = [
  {children: 'Foo', onClick: onFoo, when: hasFoo},
  {children: 'Bar', onClick: onBar, when: hasBar},
  {children: 'Baz', type: 'submit'},
  {children: <img ... />, items: () => menuItems, variant: 'icon'},
];
```

```jsx static
<Actions actions={actions} />
```
