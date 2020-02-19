```jsx
import { useContext } from 'react';
import { ModalContext } from '../../contexts/ModalContext';
import Paper from '../Paper';

const ModalComponent = ({ className, onReject, onResolve }) => (
  <Paper className={className}>
    <p children="Some prompt component." />
    <button children="Reject" onClick={onReject} />
    <button children="Resolve" onClick={onResolve} />
  </Paper>
);

const { modal } = useContext(ModalContext);
const task = () => new Promise(resolve => {
  setTimeout(resolve, 1000);
});
const onOpen = ({ variant } = {}) => () => {
  modal(ModalComponent, null, {dismissable: false, variant}).then(
    () => alert('Resolved!'),
    () => alert('Rejected!'),
  );
};

<div style={{height: 250, position: 'relative', width: '100%'}}>
  <button children="Center" onClick={onOpen()} />
  <button children="Bottom" onClick={onOpen({variant: 'bottom'})} />
  <button children="Full" onClick={onOpen({variant: 'full'})} />
  <Modal />
</div>
```
