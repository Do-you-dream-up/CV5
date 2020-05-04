# Emoji

Let's divide the feature in manageable tasks:

1. Make a popin displaying a number of hard-coded icons
1. Dynamically populate the list of choices
1. Insert glyphs on click
1. Close the popin by default and open it on click

When that's implemented, you can start thinking about extra features to enhance
the user experience:

- Add a search feature within the emoji popin
- Offer emoji completion through typeahead as the input reads colon-wrapped text
- Provide several different emoji theme
- Insert the glyph at point, rather than the end of the input string

# Make a Popin Displaying a Number of Hard-Coded Icons

First, pick a place within the interface where that popin should render.

Having it near the input sounds proper. Slightly above it not to hinder
accessibility. This means the popin should anchor together with the input
component. For now, make a new component `<Emoji />`. It can look as simple as
that:

```jsx
function Emoji() {
  return <div className={classes.root} />;
}
```

Which will render just a static and empty `<div />`. Ensure it correctly appears
in the DOM as you utilize your new component within the input, then you can
start adding hard-coded icons using a list.

# Dynamically Populate the List of Choices

Depending on what glyph you want available, use a dynamically populated array
(eg. backend API, global JS variable, hard-coded list) in order to display the
glyphs within your component using the `children` property.

# Insert Glyphs on Click

Now we want to insert content within the string input itself as the user clicks
on the popin. It's as simple as providing a `onClick` handler directly on each
icon within your list of emoji.

However that handler needs to be aware of the destination string (the input
text) in order to append the corresponding glyph. If you take a clook at the
input component and how it handles the input as a string, you'll notice that
it's a state variable and that it has a debounced value.

```
const [ input, setInput ] = useState('');
const debouncedInput = useDebounce(input, delay);
```

For short, there's a stable value, and a live value. The value within `input`
reflects the current value of the input, to be visually displayed. The debounced
value `debouncedInput` corresponds to the stable value, the one that is safe to
use. If you rely on the live value, you might end up triggering too many API
calls depending on hat you're trying to accomplish. The debounced value is
updated every 300ms (devault value). This allows behaviors like typehead and
suggestions not to fire too often.

Going back to our current need, appending the glyph to the live value will
trigger a new cycle and the debounce value will in turn trigger all its
subsequent cycles. If you append directly to the debounced value, you might not
see the glyph directly appear in the text input. That wouldn't be too visually
pleasing and make the user think the application is not responding well. To
avoid that, append the glyph to the live input value, the one that is displayed
at every moment.

You might be stuck while thinking about how your component could edit a value
that is hierarchically above it. Instead of thinking how the emoji component can
edit the string, try to establish better responsibilities for your components.
Instead, make the emoji component only decide at what time the edit should
occur: on click. then you can let the parent component decide *what* to do
*when* it is the time. The *when* is dealt with within the emoji component, the
*what* should be done in the parent component. Here is a simple and naive
reproduction:

```jsx
function Input() {
  const [ value, setValue ] = useState('Sample text');
  const onAppend = suffix => () => setValue(previous => previous.concat(suffix));
  return (
    <div>
      <Emoji onClick={onAppend} />
      <Field value={value} />
    </div>
  );
}

function Emoji({ onClick }) {
  return (
    <ul>
      <li children=":-)" onClick={onClick(':-)')}/>
      <li children=":-(" onClick={onClick(':-(')}/>
      <li children=":-|" onClick={onClick(':-|')}/>
    </ul>
  );
}
```

# Close the Popin by Default and Open it on Click

In order to let the user open and close the popin on demand, base that behavior
on a boolean that you would initialize at `false`. Then it becomes as easy as
toggling said boolean on click on an action button.
