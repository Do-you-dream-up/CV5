```jsx
import Interaction from '../Interaction';

const items = [<p>Foo.</p>, <p>Bar.</p>, <p>Baz.</p>];

<div style={{ width: '100%' }}>
  <Interaction carousel children={items} scroll={false} steps={[]} type="response" />
</div>;
```
