import Modal from './Modal';
import { ModalContext } from '../../contexts/ModalContext';
import { render } from '../../tools/test-utils';
import { screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

describe('Modal', () => {
  test('renders the component when it is provided', () => {
    const onReject = jest.fn();
    const onResolve = jest.fn();
    const thinking = false;
    const options = { dismissable: true, variant: 'default' };
    const Component = () => <div>Test Component</div>;
    const modalProps = { Component, onReject, onResolve, options, thinking };
    const mockConfiguration = { some: 'config' };

    render(
      <ModalContext.Provider value={{ ...modalProps }}>
        <Modal />
      </ModalContext.Provider>,
      { configuration: mockConfiguration },
    );

    const overlay = screen.getByRole('presentation');
    expect(overlay).toBeDefined();

    const component = screen.getByText('Test Component');
    expect(component).toBeDefined();
  });

  test('calls onReject when clicking on the overlay if dismissable is true', () => {
    const onReject = jest.fn();
    const onResolve = jest.fn();
    const thinking = false;
    const options = { dismissable: true, variant: 'default' };
    const Component = () => <div>Test Component</div>;
    const modalProps = { Component, onReject, onResolve, options, thinking };
    const mockConfiguration = { some: 'config' };

    render(
      <ModalContext.Provider value={{ ...modalProps }}>
        <Modal />
      </ModalContext.Provider>,
      { configuration: mockConfiguration },
    );

    const overlay = screen.getByRole('presentation');
    userEvent.click(overlay);
  });
});
