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
import { withConfiguration } from  '../../tools/configuration';
import sanitize from  '../../tools/sanitize';


/**
 * Build an interaction to display content within the conversation. An
 * interaction usually contains a single bubble but can contain one bubble
 * depending on the content. Interactions are split after the horizontal rule
 * HTML tag.
 */
export default withConfiguration(withStyles(styles)(class Interaction extends React.PureComponent {

  static contextType = DialogContext;

  static propTypes = {
    /** @ignore  */
    classes: PropTypes.object.isRequired,
    /** @ignore */
    configuration: PropTypes.object.isRequired,
    live: PropTypes.bool,
    secondary: PropTypes.object,
    secondaryOpen: PropTypes.bool,
    text: PropTypes.string.isRequired,
    thinking: PropTypes.bool,
    type: PropTypes.oneOf(['request', 'response']).isRequired,
  };

  state = {bubbles: [], length: 0};

  /**
   * Push text into the conversation. If the delay between bubbles is enabled,
   * then push bubbles in the conversation one at a time, otherwise push
   * everything directly.
   *
   * Bubbles are consumed and shifted out of the array.
   *
   * @param {string[]} bubbles - Interaction's text.
   * @param {function} callback - Function to call when all of the bubbles are pushed.
   * @public
   */
  addBubble = (bubbles, callback) => {
    const { loader } = this.props.configuration.interaction;
    const [ left, right ] = Array.isArray(loader) ? loader : [loader, loader];
    const delay = Math.floor(Math.random() * (~~right - ~~left)) + ~~left;
    if (this.props.thinking) {
      setTimeout(function() {
        this.setState(
          state => ({bubbles: [...state.bubbles, bubbles.shift()]}),
          () => bubbles.length ? this.addBubble(bubbles, callback) : callback(),
        );
      }.bind(this), delay);
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
    const { automatic } = this.props.configuration.secondary;
    const { content, title } = this.props.secondary || {};
    if (content) {
      this.context.toggleSecondary(
        this.props.secondaryOpen && automatic,
        {body: sanitize(content), title},
      )();
    }
  };

  /**
   * Initialize the interaction content from the `text` property.
   *
   * @public
   */
  initialize = () => {
    const bubbles = sanitize(this.props.text).split('<hr>');
    this.setState(
      ({length: bubbles.length}),
      () => this.addBubble(bubbles, this.addSecondary),
    );
  };

  componentDidMount() {
    this.initialize();
  }

  componentDidUpdate(previousProps) {
    if (this.props.live && previousProps.text !== this.props.text) {
      this.initialize();
    }
  }

  render() {
    const { toggleSecondary } = this.context;
    const { classes, configuration, secondary, type } = this.props;
    const { bubbles, length } = this.state;
    const avatar = !!configuration.interaction.avatar[type];
    return (
      <div className={classNames(
        'dydu-interaction', `dydu-interaction-${type}`, classes.base, classes[type],
      )} ref={node => this.node = node}>
        {avatar && <Avatar type={type} />}
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
}));
