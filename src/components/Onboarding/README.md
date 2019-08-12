The below example describes an application that has a header with 3 buttons, a
body and a footer.

- The header is visible at all times
- The button `a` and `b` are only visible once the onboarding is passed
- The button `c` is visible at all times
- The body and the footer are only visible once the onboarding is passed

```jsx static
<Header>
  <Onboarding>
    <Button a />
    <Button b />
  </Onboarding>
  <Button c />
</Header>
<Onboarding render>
  <Body />
  <Footer />
</Onboarding>
```
