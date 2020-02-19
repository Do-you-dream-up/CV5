```jsx
import { useState } from 'react';
import Actions from '../Actions';

const [ thinking, setThinking ] = useState(false);
const onThink = () => {
  setThinking(true);
  setTimeout(() => setThinking(false), 2000);
};
const actions = [{children: 'Think', onClick: onThink}];

<Paper thinking={thinking} title="Some Title">
  <p>
    At vero eos et accusamus et iusto odio dignissimos ducimus qui blanditiis
    praesentium voluptatum deleniti atque corrupti quos dolores et quas
    molestias.
  </p>
  <p children="Et harum quidem rerum facilis est et expedita distinctio." />
  <Actions actions={actions} />
</Paper>
```

