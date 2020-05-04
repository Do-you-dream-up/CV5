# Move Input Field

By default the chatbox application sees from top to bottom, in that order:
header, body and footer. The input by default makes more sense placed in the
footer. Traditionally, users are more accustomed to having an input field that
feeds the history of conversation directly above it that reads top to bottom as
well.

In a different UX and layout you might want to have the input field placed
elsewhere in the interface.

It's as simple as moving the `<Input />` component in the DOM. See its default
location: `src/components/Footer/index.js`. Doing so you might separate the
input from the context in which footer actions where available, so be wary of
that.
