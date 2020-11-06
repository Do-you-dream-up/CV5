```jsx
import { useState } from 'react';

const [ hidden, setHidden ] = useState(true);
const onToggle = () => setHidden(previous => !previous);

<>
  <button children="Toggle" onClick={onToggle} />
  <Skeleton hide={hidden} height="2em" variant="paragraph">
    <div>
      <p>Quasi architecto beatae vitae dicta sunt explicabo.</p>
      <p>
        Nisi porta lorem mollis aliquam ut porttitor leo a diam sollicitudin
        tempor id eu! Porttitor massa id neque aliquam vestibulum morbi blandit
        cursus risus, at ultrices mi tempus imperdiet nulla?
      </p>
    </div>
  </Skeleton>
</>
```
