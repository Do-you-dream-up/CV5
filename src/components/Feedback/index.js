import c from 'classnames';
import React, { useContext, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import { DialogContext } from '../../contexts/DialogContext';
import dydu from '../../tools/dydu';
import Bubble from '../Bubble';
import Button from '../Button';
import FeedbackChoices from '../FeedbackChoices';
import Form from  '../Form';
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

  const onComment = ({ comment }) => {
    const value = comment.trim();
    if (value.length) {
      setThinking(true);
      dydu.feedbackComment(value).then(() => setTimeout(() => {
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

  return active && (showChoices || showComment || showVote) && (
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
        <Bubble component={Scroll} type="response">
          <Form className="dydu-feedback-comment" data={{comment: ''}} onResolve={onComment} thinking={thinking}>
            {({ data, onChange }) => (
              <>
                {commentHelp && <p children={commentHelp} className="dydu-feedback-comment-help" />}
                <div className={c('dydu-feedback-comment-field', classes.commentField)}>
                  <textarea autoFocus
                            className={c(classes.commentFieldText, {[classes.thinking]: thinking})}
                            disabled={thinking}
                            maxLength={100}
                            name="comment"
                            onChange={onChange}
                            onKeyDown={onKeyDown}
                            placeholder={t('comment.placeholder')}
                            value={data.comment} />
                  <div children={data.comment} className={classes.commentFieldShadow} />
                </div>
              </>
            )}
          </Form>
        </Bubble>
      )}
    </div>
  );
}
