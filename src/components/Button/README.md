Contained button (default)

```jsx
<Button children="Button" />
<Button children="Disabled" disabled />
<Button children="Error" color="error" />
<Button children="Success" color="success" />
<Button children="Warning" color="warning" />
```

Text button

```jsx
<Button children="Button" variant="text" />
<Button children="Disabled" disabled variant="text" />
<Button children="Error" color="error" variant="text" />
<Button children="Success" color="success" variant="text" />
<Button children="Warning" color="warning" variant="text" />
```

Icon button

```jsx {"props": {"style": {"backgroundColor": "#B3E5FC"}}}
<Button variant="icon">
  <img src="public/icons/close.png" />
</Button>
<Button disabled variant="icon">
  <img src="public/icons/close.png" />
</Button>
```

Icon-contained button

```jsx
<Button variant="icon-contained">
  <img src="public/icons/close.png" />
</Button>
<Button disabled variant="icon-contained">
  <img src="public/icons/close.png" />
</Button>
<Button color="error" variant="icon-contained">
  <img src="public/icons/close.png" />
</Button>
<Button color="success" variant="icon-contained">
  <img src="public/icons/close.png" />
</Button>
<Button color="warning" variant="icon-contained">
  <img src="public/icons/close.png" />
</Button>
```
