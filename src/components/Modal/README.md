```jsx
import { useContext } from 'react';
import { ModalContext } from '../../contexts/ModalContext';
import Paper from '../Paper';

const ModalComponent = ({ onReject, onResolve }) => (
  <Paper>
    <p children="Some prompt component." />
    <button children="Reject" onClick={onReject} />
    <button children="Resolve" onClick={onResolve} />
  </Paper>
);

const { modal } = useContext(ModalContext);
const task = () => new Promise(resolve => {
  setTimeout(resolve, 1000);
});
const onOpen = () => {
  modal(ModalComponent, null, {dismissable: false}).then(
    () => alert('Resolved!'),
    () => alert('Rejected!'),
  );
};

<div style={{height: 150, position: 'relative', width: '100%'}}>
  <button children="Open" onClick={onOpen} />
  <Modal />
</div>
```
