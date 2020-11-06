```jsx
import { createUseStyles } from 'react-jss';

const classes = createUseStyles({
  progress: {
    left: 0,
    position: 'absolute',
    right: 0,
  },
})();

<div style={{position: 'relative', width: '100%'}}>
  <Progress className={classes.progress} />
</div>
```
