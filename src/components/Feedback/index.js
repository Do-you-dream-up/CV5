/* eslint-disable */

import { useLivechat } from '../../contexts/LivechatContext';
import { useState } from 'react';

import Bubble from '../Bubble';
import Button from '../Button/Button';
import { COLOR_RGAA } from '../../tools/constants';
import FeedbackChoices from '../FeedbackChoices';
import Form from '../Form';
import Icon from '../Icon/Icon';
import Scroll from '../Scroll/Scroll';
import c from 'classnames';
import dydu from '../../tools/dydu';
import icons from '../../tools/icon-constants';
import { useConfiguration } from '../../contexts/ConfigurationContext';
import useStyles from './styles';
import { useTheme } from 'react-jss';
import { useTranslation } from 'react-i18next';

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
  const { configuration } = useConfiguration();
  const { addNotificationOrResponse } = useLivechat();
  const [showChoices, setShowChoices] = useState(false);
  const [showComment, setShowComment] = useState(false);
  const [showVote, setShowVote] = useState(true);
  const [thinking, setThinking] = useState(false);
  const classes = useStyles();
  const { t } = useTranslation('translation');
  const { active, askChoices, askComment } = configuration.feedback;
  const commentHelp = t('feedback.comment.help');
  const commentThanks = t('feedback.comment.thanks');
  const voteThanks = t('feedback.vote.thanks');
  const downVote = t('feedback.vote.negative');
  const upVote = t('feedback.vote.positive');
  const { customFeedback } = configuration?.feedback;
  const theme = useTheme();

  const onComment = ({ comment }) => {
    const value = comment ? comment.trim() : '';
    if (value.length) {
      dydu.feedbackComment(value).then(() => {
        setShowComment(false);
        if (commentThanks) {
          addNotificationOrResponse({ text: commentThanks });
        }
      });
    }
  };

  const onKeyDown = (event) => {
    if (event.keyCode === 13 && !event.defaultPrevented) {
      event.preventDefault();
      onComment();
    }
  };

  const onVoteNegative = () => {
    dydu.feedback(false).then(() => {
      setShowVote(false);
      if (customFeedback?.enable && customFeedback?.negativeCustom?.length > 0) {
        dydu.talk(customFeedback?.negativeCustom, { doNotRegisterInteraction: false, hide: false }).then((response) => {
          addNotificationOrResponse(response);
        });
      } else if (askChoices) {
        setShowChoices(true);
      } else if (askComment) {
        setShowComment(true);
      } else if (voteThanks) {
        addNotificationOrResponse({ text: voteThanks });
      }
    });
  };

  const onVotePositive = () => {
    dydu.feedback(true)?.then(() => {
      setShowVote(false);

      if (customFeedback?.enable && customFeedback?.positiveCustom?.length > 0) {
        dydu.talk(customFeedback?.positiveCustom, { doNotRegisterInteraction: false, hide: false }).then((response) => {
          addNotificationOrResponse(response);
        });
      } else if (voteThanks) {
        addNotificationOrResponse({ text: voteThanks });
      }
    });
  };

  const onChoicesSelect = (value) => {
    setThinking(true);
    dydu.feedbackInsatisfaction(value).then(() =>
      setTimeout(() => {
        setShowChoices(false);
        if (askComment) {
          setShowComment(true);
        } else if (voteThanks) {
          addNotificationOrResponse({ text: voteThanks });
        }
        setThinking(false);
      }, 1000),
    );
  };

  const onDismiss = () => {
    setShowComment(false);
    setThinking(false);
  };

  return (
    active &&
    (showChoices || showComment || showVote) && (
      <div className="dydu-feedback">
        {showVote && (
          <div className={c('dydu-feedback-vote', classes.vote)}>
            <Button
              style={{ backgroundColor: `${COLOR_RGAA.error}` }}
              onClick={onVoteNegative}
              variant="icon"
              data-testid="vote-buttons-down"
            >
              <Icon icon={icons?.thumbDown} color={theme.palette.primary.text} alt={downVote} />
            </Button>
            <Button
              style={{ backgroundColor: `${COLOR_RGAA.success}` }}
              onClick={onVotePositive}
              variant="icon"
              data-testid="vote-buttons-up"
            >
              <Icon icon={icons?.thumbUp} color={theme.palette.primary.text} alt={upVote} />
            </Button>
          </div>
        )}
        {showChoices && (
          <Bubble
            component={Scroll}
            thinking={thinking}
            type="response"
            data-testid="feedback-choices"
            scrollToBottom={true}
          >
            <FeedbackChoices onSelect={onChoicesSelect} />
          </Bubble>
        )}
        {showComment && (
          <Bubble component={Scroll} type="response" data-testid="feedback-comment" scrollToBottom={true}>
            <Form className="dydu-feedback-comment" data={{ comment: '' }} onResolve={onComment} onDismiss={onDismiss}>
              {({ data, onChange }) => (
                <>
                  {commentHelp && <p children={commentHelp} className="dydu-feedback-comment-help" />}
                  <div className={c('dydu-feedback-comment-field', classes.commentField)}>
                    <textarea
                      autoFocus
                      className={c(classes.commentFieldText, {
                        [classes.thinking]: thinking,
                      })}
                      disabled={thinking}
                      maxLength={100}
                      name="comment"
                      onChange={onChange}
                      onKeyDown={onKeyDown}
                      placeholder={t('feedback.comment.placeholder')}
                      value={data.comment}
                    />
                    <div children={data.comment} className={classes.commentFieldShadow} />
                  </div>
                </>
              )}
            </Form>
          </Bubble>
        )}
      </div>
    )
  );
}
