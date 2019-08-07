import React from 'react';
import Interaction from '../Interaction';
import Configuration from '../../tools/configuration';
import dydu from '../../tools/dydu';


const TOP = Configuration.get('top');
const { size: TOP_SIZE=3, text: TOP_TEXT } = TOP;


export default class Top extends React.PureComponent {

  state = {items: []};

  fetch = () => dydu.top({size: TOP_SIZE}).then(({ knowledgeArticles }) => {
    try {
      const top = JSON.parse(knowledgeArticles);
      this.setState({items: Array.isArray(top) ? top : [top]});
    }
    catch (e) {
      this.setState({items: []});
    }
  });

  componentDidMount() {
    if (TOP_SIZE) {
      this.fetch();
    }
  }

  render() {
    const { items } = this.state;
    const html = !!items.length && [
      TOP_TEXT,
      '<ol>',
      items.map(({ reword }) => {
        const ask = `window.dydu.ask('${reword}')`;
        return `<li><span class="dydu-link" onclick="${ask}">${reword}</span></li>`;
      }).join(''),
      '</ol>',
    ].join('');
    return html && (
      <article>
        <Interaction text={html} thinking={!!TOP.loader} type="response" />
      </article>
    );
  }
}
