const path = require('path');
const docgen = require('react-docgen');
const { version } = require('./package');
const styles = require('./src/styleguide/styles');
const theme = require('./src/styleguide/theme');


module.exports = {
  ignore: [
    '**/*.d.ts',
    '**/*.spec.{js,jsx,ts,tsx}',
    '**/*.test.{js,jsx,ts,tsx}',
    '**/__tests__/**',
    '**/components/*/styles.js',
  ],
  ribbon: {
    text: 'Repository',
    url: 'https://git.nereide.dydu.ai/mmarques/bliss/',
  },
  styleguideComponents: {
    'PathlineRenderer': path.join(__dirname, 'src/styleguide/components/PathlineRenderer'),
    'slots/IsolateButton': path.join(__dirname, 'src/styleguide/components/IsolateButton'),
  },
  styles,
  theme,
  usageMode: 'expand',
  version,
};
