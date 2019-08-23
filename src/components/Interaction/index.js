import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import styles from  './styles';
import Avatar from  '../Avatar';
import Bubble from  '../Bubble';
import Loader from  '../Loader';
import Scroll from  '../Scroll';
import { DialogContext } from  '../../contexts/DialogContext';
import Configuration from  '../../tools/configuration';
import sanitize from  '../../tools/sanitize';


const { avatar: AVATAR={}, loader: LOADER } = Configuration.get('interaction');
const DELAYS = (Array.isArray(LOADER) ? LOADER : [LOADER]).map(it => it === true ? 1000 : ~~it);
const SECONDARY_AUTOMATIC = !!Configuration.get('secondary.automatic');


/**
 * Build an interaction to display content within the conversation. An
 * interaction usually contains a single bubble but can contain one bubble
 * depending on the content. Interactions are split after the horizontal rule
 * HTML tag.
 */
class Interaction extends React.PureComponent {

  static contextType = DialogContext;

  static propTypes = {
    /** @ignore  */
    classes: PropTypes.object.isRequired,
    secondary: PropTypes.object,
    secondaryOpen: PropTypes.bool,
    text: PropTypes.string.isRequired,
    thinking: PropTypes.bool,
    type: PropTypes.oneOf(['request', 'response']).isRequired,
  };

  state = {bubbles: [], length: 0};

  /**
   * Push text into the conversation. If the delay between bubbles is enabled,
   * then push bubbles in the conversation one at a time, otherwise pushy
   * everything directly.
   *
   * @param {string[]} bubbles - Interaction's text.
   * @param {function} callback - Function to call when all of the bubbles are pushed.
   * @param {number} [index=0] - To keep track of the current delay.
   * @public
   */
  addBubble = (bubbles, callback, index=0) => {
    if (this.props.thinking) {
      setTimeout(function() {
        this.setState(
          state => ({bubbles: [...state.bubbles, bubbles.shift()]}),
          () => bubbles.length ? this.addBubble(bubbles, callback, index + 1) : callback(),
        );
      }.bind(this), DELAYS[index % DELAYS.length]);
    }
    else {
      this.setState(({bubbles: bubbles}), callback);
    }
  };

  /**
   * Update secondary content and open it if relevant.
   *
   * @public
   */
  addSecondary = () => {
    const { content, title } = this.props.secondary || {};
    if (content) {
      this.context.toggleSecondary(
        this.props.secondaryOpen && SECONDARY_AUTOMATIC,
        {body: sanitize(content), title},
      )();
    }
  };

  componentDidMount() {
    const bubbles = sanitize(this.props.text).split('<hr>');
    this.setState(
      ({length: bubbles.length}),
      () => this.addBubble(bubbles, this.addSecondary),
    );
  }

  render() {
    const { toggleSecondary } = this.context;
    const { classes, secondary, type } = this.props;
    const { bubbles, length } = this.state;
    return (
      <div className={classNames(
        'dydu-interaction', `dydu-interaction-${type}`, classes.base, classes[type],
      )} ref={node => this.node = node}>
        {!!AVATAR[type] && <Avatar type={type} />}
        <div className={classNames('dydu-interaction-bubbles', classes.bubbles)}>
          {bubbles.map((it, index) => {
            const actions = secondary ? [{action: toggleSecondary(), text: 'Plus'}] : [];
            return <Bubble actions={actions} component={Scroll} html={it} key={index} type={type} />;
          })}
          {bubbles.length < length && <Loader />}
        </div>
      </div>
    );
  }
}


export default withStyles(styles)(Interaction);
