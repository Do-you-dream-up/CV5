### Contained Button (default)

```jsx
<Button children="Button" />
<Button children="Disabled" disabled />
<Button children="Error" color="error" />
<Button children="Success" color="success" />
<Button children="Warning" color="warning" />
<Button children="Button" icon="icons/close.png" />
<Button children="Button" icon="icons/loading.png" spin={true} />
<Button children="Link" href="https://goo.gle" icon="icons/open-in-new.png" />
```

### Text Button

```jsx
<Button children="Button" variant="text" />
<Button children="Disabled" disabled variant="text" />
<Button children="Error" color="error" variant="text" />
<Button children="Success" color="success" variant="text" />
<Button children="Warning" color="warning" variant="text" />
<Button children="Button" icon="icons/close.black.png" variant="text" />
<Button children="Button" icon="icons/loading.black.png" spin={true} variant="text" />
<Button children="Link" href="https://goo.gle" icon="icons/open-in-new.black.png" variant="text" />
```

### Icon Button

```jsx
<Button color="primary" variant="icon">
  <img src="icons/close.png" />
</Button>
<Button color="primary" disabled variant="icon">
  <img src="icons/close.png" />
</Button>
<Button variant="icon">
  <img src="icons/close.black.png" />
</Button>
<Button disabled variant="icon">
  <img src="icons/close.black.png" />
</Button>
<Button color="error" variant="icon">
  <img src="icons/close.png" />
</Button>
<Button color="success" variant="icon">
  <img src="icons/close.png" />
</Button>
<Button color="warning" variant="icon">
  <img src="icons/close.png" />
</Button>
<Button color="primary" href="https://goo.gle" variant="icon">
  <img src="icons/open-in-new.png" />
</Button>
```
