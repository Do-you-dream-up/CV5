import { ConfigurationProvider, useConfiguration } from '../ConfigurationContext';
import { act, render } from '@testing-library/react';

import { getConfigurationObject } from '../../test/fixtures/configuration';

describe('ConfigurationContext', () => {
  const configurationProp = getConfigurationObject();
  test('renders children and provides context value', () => {
    const ChildComponent = () => {
      const { configuration } = useConfiguration();
      return <div>{configuration.interaction.NameBot.toString()}</div>;
    };
    const { getByText } = render(
      <ConfigurationProvider configuration={configurationProp}>
        <ChildComponent />
      </ConfigurationProvider>,
    );
  });

  test('updates configuration', async () => {
    const ChildComponent = () => {
      const { configuration, update } = useConfiguration();
      const handleClick = async () => {
        await act(async () => {
          await update('parent', 'key', 'value');
        });
      };
      return (
        <div>
          <div>{configuration.interaction.NameBot.toString()}</div>
          <button onClick={handleClick}>Update configuration</button>
        </div>
      );
    };
    const { getByText } = render(
      <ConfigurationProvider configuration={configurationProp}>
        <ChildComponent />
      </ConfigurationProvider>,
    );
    const updateButton = getByText('Update configuration');
    await act(async () => {
      updateButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
  });

  test('resets configuration', async () => {
    const ChildComponent = () => {
      const { configuration, reset } = useConfiguration();
      const handleClick = async () => {
        await act(async () => {
          await reset({ newConfiguration: true });
        });
      };
      return (
        <div>
          <div>{configuration.interaction.NameBot.toString()}</div>
          <button onClick={handleClick}>Reset configuration</button>
        </div>
      );
    };
    const { getByText } = render(
      <ConfigurationProvider configuration={configurationProp}>
        <ChildComponent />
      </ConfigurationProvider>,
    );
    const resetButton = getByText('Reset configuration');
    await act(async () => {
      resetButton.dispatchEvent(new MouseEvent('click', { bubbles: true }));
    });
  });
});
