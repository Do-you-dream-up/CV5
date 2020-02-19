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
const onClick = text => () => alert(text);
const items = [[
  {onClick: onClick('One!'), text: 'One'},
  {onClick: onClick('Two!'), text: 'Two'},
  {onClick: onClick('Three!'), text: 'Three'},
]];
const actions = [
  {
    children: <img src="icons/thumb-up.png" />,
    color: 'primary',
    onClick: onClick('Foo!'),
    variant: 'icon',
  },
  {
    children: <img src="icons/thumb-down.png" />,
    color: 'primary',
    onClick: onClick('Bar!'),
    variant: 'icon',
  },
  {
    children: <img src="icons/dots-vertical.png" />,
    color: 'primary',
    items: () => items,
    variant: 'icon',
  },
];

<Actions actions={actions} />
```
