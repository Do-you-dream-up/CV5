const RE_ACTION = /javascript:\s*(\w+\s*\(\s*(?:'.*?'|".*?"|[^;]*)?(?:,\s*.*)*\))(?:\s*;+\s*(\w+\s*\(\s*(?:'.*?'|".*?"|[^;]*)?(?:,\s*.*)*\)))*/g;
const RE_ACTION_NAME = /(\w+)\s*\(\s*(.+)?\)/;
const RE_ACTION_PARAMETERS = /(?:^|,)\s*((('|").*?(?<!\\)(\3))|(\d?\.?\d+))/g;


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
    let [ , action, parameters ] = it.match(RE_ACTION_NAME);
    if (parameters) {
      parameters = parameters.match(RE_ACTION_PARAMETERS);
      response = [...response, {action, parameters}] ;
    }
    else {
      response = [...response, {action}] ;
    }
  });
  return response;
};
