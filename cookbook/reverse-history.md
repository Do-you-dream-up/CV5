# Reverse History of Dialog

Following the recipe where one might want to move the input field, it also might
make sense for your interface to have the history of interactions read from
bottom to top instead of top to bottom.

Interactions are rendered in the `<Dialog />` component. Study its
implementation and notice that interactions are basically a simple array that
the component iterate over.

You can simply modify that array: filter, reverse, split, ...
