const path = require('path');
const docgen = require('react-docgen');

module.exports = {
  ignore: [
    '**/*.d.ts',
    '**/*.spec.{js,jsx,ts,tsx}',
    '**/*.test.{js,jsx,ts,tsx}',
    '**/__tests__/**',
    '**/components/*/styles.js',
  ],
  styleguideComponents: {
    PathlineRenderer: path.join(__dirname, 'src/styleguide/PathlineRenderer'),
  },
  styles: {
    Table: {
      table: {
        '&:last-child': {
          marginBottom: 0,
        },
      },
    },
  },
  usageMode: 'expand',
};
