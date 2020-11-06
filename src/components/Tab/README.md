The below example describes an application that has clickable tabs in its header
and contextual content displayed in the body.

- When the `foo` tab is selected then the component `Foo` is rendered
- When the `bar` tab is selected then the component `Bar` is rendered
- The `render` property forces the render so that the tab content is mounted
  only once. The visiblity is then handled through the `display` CSS property

```jsx static
<Header>
  <Tabs />
</Header>
<Body>
  <Tab component={Foo} value="foo" render />
  <Tab component={Bar} value="bar" />
</Body>
```
