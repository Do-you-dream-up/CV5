import classNames from 'classnames';
import PropTypes from 'prop-types';
import React from 'react';
import withStyles from 'react-jss';
import styles from './styles';
import Interaction from '../Interaction';
import { withConfiguration } from '../../tools/configuration';
import dydu from '../../tools/dydu';


/**
 * Fetch the top-asked resources and display them in a numbered list.
 */
export default withConfiguration(withStyles(styles)(class Top extends React.PureComponent {

  static propTypes = {
    /** @ignore */
    classes: PropTypes.object.isRequired,
    /** @ignore */
    configuration: PropTypes.object.isRequired,
  };

  state = {items: []};

  /**
   * Fetch the N top-asked knowledge. N is pulled from the configuration.
   *
   * @public
   */
  fetch = () => {
    const { size } = this.props.configuration.top;
    return !!size && dydu.top(size).then(({ knowledgeArticles }) => {
      try {
        const top = JSON.parse(knowledgeArticles);
        this.setState({items: Array.isArray(top) ? top : [top]});
      }
      catch (e) {
        this.setState({items: []});
      }
    });
  };

  componentDidMount() {
    this.fetch();
  }

  render() {
    const { classes, configuration } = this.props;
    const { items } = this.state;
    const { text } = configuration.top;
    const html = !!items.length && [
      text,
      '<ol>',
      items.map(({ reword }) => {
        const ask = `window.dydu.chat.ask('${reword}')`;
        return `<li><span class="dydu-link" onclick="${ask}">${reword}</span></li>`;
      }).join(''),
      '</ol>',
    ].join('');
    return html && (
      <article className={classNames('dydu-top', classes.root)}>
        <Interaction live text={html} type="response" />
      </article>
    );
  }
}));
