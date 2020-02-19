The below example describes an application that has a header with 3 buttons, a
body and a footer.

- The header is visible at all times
- The button `A` and `B` are only visible once the onboarding is passed
- The button `C` is visible at all times
- The body and the footer are only visible once the onboarding is passed

```jsx static
<Header>
  <Onboarding>
    <Button A />
    <Button B />
  </Onboarding>
  <Button C />
</Header>
<Onboarding render>
  <Body />
  <Footer />
</Onboarding>
```
