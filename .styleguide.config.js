const path = require('path');
const docgen = require('react-docgen');
const { version } = require('./package');
const styles = require('./src/styleguide/styles');


module.exports = {
  ignore: [
    '**/*.d.ts',
    '**/*.spec.{js,jsx,ts,tsx}',
    '**/*.test.{js,jsx,ts,tsx}',
    '**/__tests__/**',
    '**/components/*/styles.js',
  ],
  styleguideComponents: {
    'PathlineRenderer': path.join(__dirname, 'src/styleguide/components/PathlineRenderer'),
  },
  styles,
  usageMode: 'expand',
  version,
};
