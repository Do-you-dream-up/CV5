# Layout

The application lists a number of components with dependencies between one
another. All components are located under `src/components/` and are composed of
the following:

- `index.js`  
  React code implementing the logic of said component.
- `styles.js`  
  React-Jss code applied to the component.
- `README.md` *optional*  
  An optional Markdown documentation to be displayed in the styleguide.

The root element is `<Application>`. Its role is to instanciate the UI layout
corresponding to the currently applicable open mode.

- Hidden: no UI
- `<Teaser>`: minimized
- `<Chatbox>`: fully opened, dialog-ready

Once opened, the chatbox renders 3 main sections: `<Header>`, `<Dialog>` (body)
and `<Footer>`.

Following headings briefly describe each of these 3 sections. For more
information, read the source, as well as the documentation for each component.

## Header

The header implements a fixed (top) section of the application. It holds a
number of clickable actions as well has the optional tab bar `<Tabs>`and banner
`<Banner>`.

## Body

The body lists all current dialog bubbles (further referenced to as
*interactions*) through the `<Interaction>` component.

The body of the application also implements a collection of helpers all
available through the `window.dydu` object in the context of a browser.

Lastly, the body component also serves as anchor for the potential prompts.
Think of them as modal content, transient and dismissable.

## Footer

Akin to the header, the footer also holds a number of clickable actions in a
fixed (bottom) section. However the footer also implements the `<Input` field.
