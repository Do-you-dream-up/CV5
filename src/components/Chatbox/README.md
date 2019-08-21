```jsx static
<Chatbox open={false} toggle={onToggle} />
```

This component implements the exposed API through `window`:

- `window.dydu.ask`: Add a request to the conversation
- `window.dydu.empty`: Empty the current conversation
- `window.dydu.lorem.split`: Display test content with split bubbles
- `window.dydu.lorem.standard`: Display test content
- `window.dydu.reply`: Add a response to the conversation
- `window.dydu.toggle`: Toggle the application between chatbox and teaser views
- `window.dydu.toggleSecondary`: Toggle the secondary panel
