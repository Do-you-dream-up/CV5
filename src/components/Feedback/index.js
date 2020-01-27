import c from 'classnames';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DialogContext } from '../../contexts/DialogContext';
import dydu from '../../tools/dydu';
import Bubble from '../Bubble';
import Button from '../Button';
import FeedbackChoices from '../FeedbackChoices';
import Scroll from '../Scroll';
import useStyles from './styles';


/**
 * Render interfaces for the user to submit feedback.
 *
 * In that order and optionally:
 *
 * 1. Vote
 * 1. Choices
 * 1. Comment
 */
export default function Feedback() {

  const { configuration } = useContext(ConfigurationContext);
  const { addResponse } = useContext(DialogContext);
  const [ comment, setComment ] = useState('');
  const [ showChoices, setShowChoices ] = useState(false);
  const [ showComment, setShowComment ] = useState(false);
  const [ showVote, setShowVote ] = useState(true);
  const [ thinking, setThinking ] = useState(false);
  const classes = useStyles();
  const { t } = useTranslation('feedback');
  const { active, askChoices, askComment } = configuration.feedback;
  const commentHelp = t('comment.help');
  const commentThanks = t('comment.thanks');
  const voteNegative = t('vote.negative');
  const votePositive = t('vote.positive');
  const voteThanks = t('vote.thanks');

  const onChange = event => {
    setComment(event.target.value);
  };

  const onComment = () => {
    const value = comment.trim();
    if (value.length) {
      setThinking(true);
      dydu.feedbackComment(value).then(() => setTimeout(() => {
        setComment('');
        setShowComment(false);
        setThinking(false);
        if (commentThanks) {
          addResponse({text: commentThanks});
        }
      }, 1000));
    }
  };

  const onKeyDown = event => {
    if (event.keyCode === 13 && !event.defaultPrevented) {
      event.preventDefault();
      onComment();
    }
  };

  const onVoteNegative = () => {
    dydu.feedback(false).then(() => {
      setShowVote(false);
      if (askChoices) {
        setShowChoices(true);
      }
      else if (askComment) {
        setShowComment(true);
      }
      else if (voteThanks) {
        addResponse({text: voteThanks});
      }
    });
  };

  const onVotePositive = () => {
    dydu.feedback(true).then(() => {
      setShowVote(false);
      if (voteThanks) {
        addResponse({text: voteThanks});
      }
    });
  };

  const onChoicesSelect = value => {
    setThinking(true);
    dydu.feedbackInsatisfaction(value).then(() => setTimeout(() => {
      setShowChoices(false);
      if (askComment) {
        setShowComment(true);
      }
      else if (voteThanks) {
        addResponse({text: voteThanks});
      }
      setThinking(false);
    }, 1000));
  };

  return active && (
    <div className="dydu-feedback">
      {showVote && (
        <div className={c('dydu-feedback-vote', classes.vote)}>
          <Button color="error" onClick={onVoteNegative} variant="icon">
            <img alt={voteNegative} src="icons/thumb-down.png" title={voteNegative} />
          </Button>
          <Button color="success" onClick={onVotePositive} variant="icon">
            <img alt={votePositive} src="icons/thumb-up.png" title={votePositive} />
          </Button>
        </div>
      )}
      {showChoices && (
        <Bubble component={Scroll} thinking={thinking} type="response">
          <FeedbackChoices onSelect={onChoicesSelect} />
        </Bubble>
      )}
      {showComment && (
        <Bubble component={Scroll} thinking={thinking} type="response">
          <form className="dydu-feedback-comment" onSubmit={onComment}>
            {commentHelp && <p children={commentHelp} className="dydu-feedback-comment-help" />}
            <div className={c('dydu-feedback-comment-field', classes.commentField)}>
              <textarea autoFocus
                        className={c(classes.commentFieldText, {[classes.thinking]: thinking})}
                        disabled={thinking}
                        maxLength={100}
                        onChange={onChange}
                        onKeyDown={onKeyDown}
                        placeholder={t('comment.placeholder')}
                        value={comment} />
              <div children={comment} className={classes.commentFieldShadow} />
            </div>
          </form>
        </Bubble>
      )}
    </div>
  );
}
