import classNames from 'classnames';
import React, { useContext, useState } from 'react';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
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

  const { configuration } = useContext(ConfigurationContext);
  const { addResponse } = useContext(DialogContext);
  const [ showVote, setShowVote ] = useState(true);
  const classes = useStyles();
  const { voteThanks='' } = configuration.feedback;

  const onVoteNegative = () => {
    dydu.feedback(false).then(() => {
      setShowVote(false);
      if (voteThanks.length) {
        addResponse({text: voteThanks});
      }
    });
  };

  const onVotePositive = () => {
    dydu.feedback(true).then(() => {
      setShowVote(false);
      if (voteThanks.length) {
        addResponse({text: voteThanks});
      }
    });
  };

  return (
    <div className="dydu-feedback">
      {showVote && (
        <div className={classNames('dydu-feedback-vote', classes.vote)}>
          <Button color="error" filled onClick={onVoteNegative} variant="icon">
            <img alt="Negative feedback" src="icons/thumb-down.png" title="Negative feedback" />
          </Button>
          <Button color="success" filled onClick={onVotePositive} variant="icon">
            <img alt="Positive feedback" src="icons/thumb-up.png" title="Positive feedback" />
          </Button>
        </div>
      )}
    </div>
  );
}
