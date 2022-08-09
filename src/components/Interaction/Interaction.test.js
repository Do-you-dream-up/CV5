import React from 'react';
import Interaction from './index';
import { ContextQuery, contextName } from '../../setupTests';
import { render } from '@testing-library/react';
import { JssProvider, ThemeProvider } from 'react-jss';
import theme from '../../../public/override/theme.json';
import configuration from '../../../public/override/configuration.json';
import { ConfigurationContext } from '../../contexts/ConfigurationContext';

jest.mock('../../contexts/DialogContext', () => ({
  useDialog: jest.fn().mockReturnValue({ startAnimationOperatorWriting: false }),
}));

// eslint-disable-next-line react/prop-types
const AppProviderMock = ({ children }) => {
  const mockTheme = theme;
  const mockConfiguration = JSON.parse(JSON.stringify(configuration));
  //console.log('configuration', configuration);
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
    xit('should show loader', function () {
      const { debug } = render(
        <AppProviderMock>
          <Interaction.Writing />
        </AppProviderMock>,
      );
      debug();
    });

    xit('should show loader', function () {
      const contextList = [
        ContextQuery.make(contextName.configurationContext),
        ContextQuery.make(contextName.dialogContext, { startAnimationOperatorWriting: false }),
      ];

      const { debug } = render(<Interaction.Writing />, { contexts: contextList });
      debug();
    });
  });
});
