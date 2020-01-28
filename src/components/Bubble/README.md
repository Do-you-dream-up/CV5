```jsx
import { useState } from 'react';
import Actions from '../Actions';

const [ thinking, setThinking ] = useState(false);
const onThink = () => {
  setThinking(true);
  setTimeout(() => setThinking(false), 2000);
};
const actions = <Actions actions={[{children: 'Think', onClick: onThink}]} />;

<div style={{display: 'flex', flexDirection: 'column'}}>
  <Bubble html="Lorem." type="request" />
  <Bubble actions={actions}
          html="<p>Sed ut perspiciatis unde <em>omnis iste natus</em> error sit.</p>"
          thinking={thinking}
          type="request" />
          <Bubble html="Ut enim ad minima veniam." type="response" />
</div>
```
