```jsx static
<Chatbox open={false} toggle={onToggle} />
```

This component implements the exposed API through `window`:

- `window.dydu.chat.ask`: Add a request to the conversation
- `window.dydu.chat.empty`: Empty the current conversation
- `window.dydu.chat.reply`: Add a response to the conversation
- `window.dydu.localization.get`: Return the current locale
- `window.dydu.localization.set`: Edit the locale
- `window.dydu.lorem.split`: Display test content with split bubbles
- `window.dydu.lorem.standard`: Display test content
- `window.dydu.toggle`: Toggle the application between chatbox and teaser views
- `window.dydu.toggleSecondary`: Toggle the secondary panel
