const RE_ACTION = /javascript:\s*([\w.]+\s*\(\s*(?:'.*?'|".*?"|[^;]*)?(?:,\s*.*)*\))(?:\s*;+\s*([\w.]+\s*\(\s*(?:'.*?'|".*?"|[^;]*)?(?:,\s*.*)*\)))*/g;
const RE_ACTION_NAME = /^(\w+(?:.\w+)*)\s*\(\s*(.+)?\)/;
const RE_ACTION_PARAMETERS = /(?:^|,)\s*((('|").*?(?<!\\)(\3))|(\d?\.?\d+))/g;
const RE_ACTION_SANITIZE_STRING = /^('|")(.+)(\1)$/;


/**
 * Sanitize actions.
 */
export default data => {
  let actions = [];
  let response = [];
  let match = null;
  while ((match = (RE_ACTION).exec(data))) {
    const [ , ...matches ] = match;
    actions = [...actions, ...matches.filter(it => it)];
  }
  actions.map(it => {
    let [ , action, values ] = it.match(RE_ACTION_NAME);
    let parameters = [];
    let match = null;
    while ((match = RE_ACTION_PARAMETERS.exec(values))) {
      parameters = [...parameters, match[1]];
    }
    parameters = parameters.map(it => {
      const match = it.match(RE_ACTION_SANITIZE_STRING);
      return match ? match[2] : it;
    });
    response = [...response, {action, parameters}];
  });
  return response;
};
