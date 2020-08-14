# Add Events to your Tagging solution

Events can be created with the useContext hook `src/contexts/EventsContext` on any component you need:

1. Import the context `{ EventsContext }` and add the constant `event` on any component with the `categoryName` you wish.
2. Add the event on the function you would like the event to be triggered with the `eventLabel` you wish. Extra parameters (param1, param2, etc) are optional.
3. On the configuration.json file the `categoryName` and `eventLabel` need to match the ones on the javascript code.

```jsx
const event = useContext(EventsContext).onEvent("categoryName");

const onClick = () => {
event("eventLabel", [param1], [param2]);
};
```

In `src/tools/configuration.json`:

```json
"events": {
    "features": {
        "categoryName": {
            "eventLabel": [‘foo’, ‘bar’]
        }
    }
}
```
