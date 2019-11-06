import React, { useContext, useState } from 'react';
import { DialogContext } from '../../contexts/DialogContext';
import dydu from '../../tools/dydu';



/**
 * Render handles for the user to submit feedback.
 *
 * The component contains two buttons: positive and negative.
 */
export default function Feedback() {

  const { addResponse } = useContext(DialogContext);
  const [ show, setShow ] = useState(true);

  const onNegative = () => {
    dydu.feedback(false).then(() => {
      addResponse({text: 'Negative'});
      setShow(false);
    });
  };

  const onPositive = () => {
    dydu.feedback(true).then(() => {
      addResponse({text: 'Positive'});
      setShow(false);
    });
  };

  return show && (
    <div>
      <button children="P" onClick={onPositive} />
      <button children="N" onClick={onNegative} />
    </div>
  );
}
