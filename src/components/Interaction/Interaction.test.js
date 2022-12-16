import { ContextQuery, contextName } from '../../setupTests';
import { JssProvider, ThemeProvider } from 'react-jss';

import { ConfigurationContext } from '../../contexts/ConfigurationContext';
import Interaction from './index';
import React from 'react';
import configuration from '../../../public/override/configuration.json';
import { render } from '@testing-library/react';
import theme from '../../../public/override/theme.json';

jest.mock('../../contexts/DialogContext', () => ({
  useDialog: jest.fn().mockReturnValue({ startAnimationOperatorWriting: false }),
}));

// eslint-disable-next-line react/prop-types
const AppProviderMock = ({ children }) => {
  const mockTheme = theme;
  const mockConfiguration = JSON.parse(JSON.stringify(configuration));
  return (
    <JssProvider>
      <ThemeProvider theme={mockTheme}>
        {/* TOFIX */}
        <ConfigurationContext.Provider value={mockConfiguration}>{children}</ConfigurationContext.Provider>
      </ThemeProvider>
    </JssProvider>
  );
};
describe('Interaction', function () {
  describe('Writing', function () {
    it.skip('should show loader', function () {
      const { debug } = render(
        <AppProviderMock>
          <Interaction.Writing />
        </AppProviderMock>,
      );
      debug();
    });

    it.skip('should show loader', function () {
      const contextList = [
        ContextQuery.make(contextName.configurationContext),
        ContextQuery.make(contextName.dialogContext, { startAnimationOperatorWriting: false }),
      ];

      const { debug } = render(<Interaction.Writing />, { contexts: contextList });
      debug();
    });
  });
});
