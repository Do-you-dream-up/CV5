import PropTypes from 'prop-types';
import React from 'react';
import Interaction from '../Interaction';
import { withConfiguration } from '../../tools/configuration';
import dydu from '../../tools/dydu';


/**
 * Fetch the top-asked resources and display them in a numbered list.
 */
export default withConfiguration(class Top extends React.PureComponent {

  static propTypes = {
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
    const { items } = this.state;
    const { text } = this.props.configuration.top;
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
      <article>
        <Interaction live text={html} type="response" />
      </article>
    );
  }
});
