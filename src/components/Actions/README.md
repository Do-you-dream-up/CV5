### Text Actions

```jsx
const onFoo = () => alert('Foo!') ;
const onBar = () => alert('Bar!') ;
const actions = [
  {children: 'Foo', onClick: onFoo, when: true},
  {children: 'Bar', onClick: onBar, when: true},
  {children: 'Baz', type: 'submit'},
];
<Actions actions={actions} />
```

### Icon Actions

```jsx
const menuItems = []
const onFoo = () => alert('Foo!') ;
const onBar = () => alert('Bar!') ;
const actions = [
  {children: <img src="icons/close.png" />, color: 'primary', onClick: onFoo, variant: 'icon'},
  {children: <img src="icons/close.png" />, color: 'primary', onClick: onBar, variant: 'icon'},
  {children: <img src="icons/dots-vertical.png" />, color: 'primary', items: () => menuItems, variant: 'icon'},
];
<Actions actions={actions} />
```
