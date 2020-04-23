```jsx noeditor
import configuration from '../../tools/configuration.json';

const documentation = {

  application: {
    open: ['0: Minimized - 1: Teaser - 2: Open - 3: Maximized', 'Boolean'],
    qualification: ['Whether requests should carry the `qualificationMode` option', 'Boolean'],
    languages: ['Enabled languages', 'Array'],
  },

  avatar: {
    background: ['Add a background on avatars', 'Boolean'],
  },

  banner: {
    active: ['Render the banner', 'Boolean'],
    cookie: ['Use cookies to remember the banner status', 'Boolean'],
    dismissable: ['Display the dismissing button', 'Boolean'],
    more: ['Display the custom link', 'Boolean'],
    moreLink: ['Custom link', 'String'],
    transient: ['Consider the banner as seen as soon as rendered', 'Boolean'],
  },

  chatbox: {
    expandable: ['Allow maximizing the chatbox', 'Boolean'],
    margin: ['Margins to the viewport', 'Number'],
  },

  dragon: {
    active: ['Enable drag on the chatbox', 'Boolean'],
    boundaries: ['Constrain the chatbox to the viewport', 'Boolean'],
    factor: ['Grid size', 'Number'],
    persist: ['Save the position through refreshes', 'Boolean'],
  },

  feedback: {
    active: ['Enable the feedback prompts', 'Boolean'],
    askChoices: ['Enable the prompt for choices', 'Boolean'],
    askComment: ['Enable the prompt for comment', 'Boolean'],
  },

  footer: {
    more: ['Enable the extra menu', 'Boolean'],
  },

  header: {
    actions: ['Toggles for the optional header actions', 'Object'],
    title: ['Display the header title', 'Boolean'],
  },

  input: {
    delay: ['Debounce-delay before suggestions are fired', 'Number'],
    maxLength: ['Maximum length for the text field', 'Number'],
  },

  interaction: {
    avatar: ['Whether interaction types should use avatars', 'Object'],
    loader: ['Values to use for the average mocked response time', 'Array'],
  },

  loader: {
    size: ['Number of fragments used by the loader', 'Number'],
  },

  menu: {
    spacing: ['Margin to use when the menu is against the viewport', 'Number'],
  },

  modal: {
    maxWidth: ['Maximum width for centered modals', 'String'],
    minWidth: ['Minimum width for centered modals', 'String'],
  },

  onboarding: {
    tips: ['Display the carousel', 'Boolean'],
    top: ['Display the top-knowledges if any', 'Boolean'],
  },

  onboarding: {
    tips: ['Display the carousel', 'Boolean'],
    top: ['Display the top-knowledges if any', 'Boolean'],
  },

  root: ['HTML ID to attach the application onto', 'String'],

  secondary: {
    automatic: ['Automatically display the panel when available', 'Boolean'],
    mode: ["Panel position: 'left', 'right' or 'over'", 'String'],
    transient: ["Don't keep the panel open when using the chatbox", 'Boolean'],
  },

  spaces: {
    active: ['Prompt for a consulting space when relevant', 'Boolean'],
    detection: ['Automatic detection strategy', 'Array'],
    items: ['Automatically display the panel when available', 'Array'],
  },

  suggestions: {
    limit: ['Set the maximum number of candidates', 'Number'],
  },

  tabs: {
    items: ['Define the available tabs', 'Array'],
    selected: ['Initial tab', 'String'],
    title: ['Display the title for each tab', 'Boolean'],
  },

  top: {
    size: ['Number of top-knowledges to fetch', 'Number'],
  },
};

<div style={{width: '100%'}}>
  <div style={{display: 'flex', flexWrap: 'wrap', justifyContent: 'space-between', margin: '0px 8px'}}>
    {Object.entries(configuration).map(([ component, data ]) => (
      <div style={{marginBottom: 8, maxWidth: '100%', minWidth: '50%'}}>
        <div children={<strong children={component} />} />
        <div style={{display: 'flex'}}>
          <pre children={JSON.stringify(data, null, 2)} style={{margin: 0, overflowX: 'auto'}} />
          <div style={{marginLeft: '1em'}}>
            {typeof data === 'object' ? (
              <dl style={{margin: 0}}>
                {Object.keys(data).map((key, index) => {
                  const [ definition, type ] = (documentation[component] || {})[key] || ['-'];
                  const label = <><code children={key} /> {!!type && <small children={`(${type})`} />}</>;
                  return (
                    <React.Fragment key={index}>
                      <dt children={label} />
                      <dd children={<small children={definition || '-'} />} />
                    </React.Fragment>
                  );
                })}
              </dl>
            ) : <small children={documentation[component]} />}
          </div>
        </div>
      </div>
    ))}
  </div>
</div>
```
