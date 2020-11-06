```jsx
import { useState } from 'react';

const [ mode, setMode ] = useState(1);
const onToggle = mode => () => setMode(mode);

<div style={{height: 100, position: 'relative', width: '100%'}}>
  <button children={`Mode: minified`} onClick={onToggle(0)} />
  <button children={`Mode: teaser`} onClick={onToggle(1)} />
  <button children={`Mode: chatbox`} onClick={onToggle(2)} />
  <Teaser open={mode === 1} toggle={onToggle} />
</div>
```
