/**
 * Export ready-to-use dummy texts.
 */
export const LOREM = {

  links: `
    <h2>Links</h2>
    <p>
      Internal link: <a href>click</a>
      <br />
      External link: <a href target="_blank">click</a>
    </p>
  `,

  lists: `
    <h2>Lists</h2>
    <ol>
      <li>Quis lectus nulla at volutpat diam ut venenatis!</li>
      <li>Nibh nisl.</li>
    </ol>
    <ul>
      <li>Pretium quam vulputate dignissim suspendisse in est ante in nibh mauris.</li>
      <li>Cursus mattis molestie a, iaculis at erat?</li>
    </ul>
  `,

  paragraphs: `
    <h2>Paragraphs</h2>
    <p>Pellentesque massa placerat duis ultricies lacus sed turpis tinciduntid aliquet risus.</p>
    <p>Dictum at tempor commodo.</p>
    <p>Ullamcorper a lacus vestibulum sed? Ullamcorper eget nulla facilisi etiam!</p>
  `,
};


export const LOREM_HTML = Object.values(LOREM).join('');
export const LOREM_HTML_SPLIT = Object.values(LOREM).join('<hr />');
