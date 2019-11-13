import React, { useContext, useState } from 'react';
import { DialogContext } from '../../contexts/DialogContext';
import dydu from '../../tools/dydu';
import Button from '../Button';
import useStyles from './styles';



/**
 * Render handles for the user to submit feedback.
 *
 * The component contains two buttons: positive and negative.
 */
export default function Feedback() {

  const { addResponse } = useContext(DialogContext);
  const [ show, setShow ] = useState(true);
  const classes = useStyles();

  const onVoteNegative = () => {
    dydu.feedback(false).then(() => {
      addResponse({text: 'Negative'});
      setShow(false);
    });
  };

  const onVotePositive = () => {
    dydu.feedback(true).then(() => {
      addResponse({text: 'Positive'});
      setShow(false);
    });
  };

  return show && (
    <div className={classes.root}>
      <Button color="error" filled onClick={onVoteNegative} variant="icon">
        <img alt="Negative feedback" src="icons/thumb-down.png" title="Negative feedback" />
      </Button>
      <Button color="success" filled onClick={onVotePositive} variant="icon">
        <img alt="Positive feedback" src="icons/thumb-up.png" title="Positive feedback" />
      </Button>
    </div>
  );
}
