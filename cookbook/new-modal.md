# Add a Custom Modal on Click

To programmatically trigger a modal within the application, there's a function
exported by the `ModalProvider` context.

You can inspect its signature in `src/contexts/ModalContext.js`. The modal is
placed in the DOM where the component `<Modal />` is placed and use it as an
anchor.

With that in mind, triggering a modal interface becomes as simple as calling
`ModalContext.modal` whenever relevant.

In our example, let us pop open a modal on click, and create an alert box when
the user closes it.

## Make a Modal Component

The modal workflow requires you to make a modal component in order to insert it
as you trigger the modal system. You can look at the existing ones for
reference, they're all prefixed with `Modal`. eg.
`src/components/ModalClose/Icon.tsx`

Here is a simple one for our example:

```jsx
function ModalSimple({ onReject, onResolve }) {
  return (
    <div>
      <h3 children="Simple Title" />
      <p children="Simple body." />
      <div>
        <Button children="Cancel" onClick={onReject} />
        <Button children="Ok" onClick={onResolve} />
      </div>
    </div>
  );
}
```

## Pop Open the Modal

Calling the `onClick` function here will make a new instance of `ModalSimple`
and insert it at the `<Modal />` anchor. Our simple modal component implements 2
buttons to close or dismiss the modal.

```jsx
const { modal } = useContext(ModalContext);
const onClick = () => modal(ModalSimple);
```

## Handling User Response

The modal system implements modals as promise by default, which makes it easy to
handle either of the 2 outcomes for a given modal: rejecting and resolving.

Let us update the code from previous section:

```jsx
const { modal } = useContext(ModalContext);
const onDismiss = () => window.alert('You dismissed the modal.');
const onValidate = () => window.alert('You validated the modal.');
const onClick = () => modal(ModalSimple).then(onValidate, onDismiss);
```

## Resolve a Modal Based on Another Promise

The modal system also handles inner promises. For instance, you might want to
wait for an operation to be resolved before the modal interface actually closes.

See the `modal` function signature for more details.

Below is an example of a modal that will call `send` which is a heavy task that
will return a promise and take more time to resolve, faked with a 1 second
timeout. Our goal is to call this task as the user validates the modal, wait for
the promise response and only then close the modal interface.

```jsx
const { modal } = useContext(ModalContext);
const task = () => new Promise(resolve => setTimeout(resolve, 1000));
const onDismiss = () => window.alert('You dismissed the modal.');
const onValidate = () => window.alert('You validated the modal.');
const onClick = () => modal(ModalSimple, task).then(onValidate, onDismiss);
```
