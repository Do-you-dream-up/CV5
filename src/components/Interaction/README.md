```jsx
import { useState } from 'react';

const [ replied, setReplied ] = useState(false);
const onReply = () => setReplied(previous => !previous);

<div style={{width: '100%'}}>
  <button children="Reply" onClick={onReply} />
  <Interaction children="<p>Lorem.</p>" scroll={false} type="request" />
  <Interaction children="Duis aute irure dolor in reprehenderit." scroll={false} type="response" />
  <Interaction children="<p>Ipsum.</p>" scroll={false} type="request" />
  <Interaction children="<p>Laudantium.</p><p>At vero eos et <em>accusamus</em>.</p>"
               scroll={false}
               type="response" />
  {replied && <Interaction children="Faucibus." scroll={false} thinking={true} type="response" />}
</div>
```
