# Deploy

In order to deploy your application online and make it available to your
customer, the React application needs to run on a page where JavaScript is
enabled.

First let's get our bundle.

Today's tools let us package all that is necessary to the execution of
applications of varying level of complexity. In this case, bundling refers to
grouping all the dependencies together alongside the code itself into one single
JavaScript file. By convention this file is named `bundle.js`.

```sh
cd ~/path/to/my/project/
npm run build
```

This will run instructions from the Webpack configuration dispatched as per
stated in `package.json`: produce a `build/` folder containing all you need to
deploy your chatbox to your page.

- `build/*bundle.min.js`  
  Contains the JavaScript itself. The entry point is `bundle.min.js` and is the
  only file you should reference manually. Other prefixed bundle files are splits
  that are referenced automatically and should not be dealt with manually.
- `build/assets/`  
  Holds the file assets for the chatbox, generally image files for background.
  The folder should be placed and served next to your HTML so that it can be
  available at the end users load the page from their browser.
- `build/icons/`  
  Contains all icon files to be access to at runtime. Must support transparency.
- `build/locales/`  
  Dictionaries containing all translations for the static content within the
  application. Each language directory contains a JSON file per React component.

Now you need to upload these files next to your `index.html` as well as
reference the entry bundle file in it. This is as simple as this:

```html
<div id="dydu-root"></div>
<script src="bundle.min.js"></script>
```

Place this HTML tag preferably at the bottom of `<body>`. This would ensure our
code doesn't jam your own flow of execution within the page and load the
chatbox code only after all the DOM is loaded in the browser.

The `dydu-root` element is used as an anchor for the application to be placed
wherever you want in the DOM.
