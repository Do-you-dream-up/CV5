import '@testing-library/jest-dom';

import { ModalContext, ModalProvider } from '../ModalContext';

import PropTypes from 'prop-types';
import React from 'react';
import { render } from '../../tools/test-utils';

describe('ModalProvider', () => {
  it('renders children without crashing', () => {
    const { container } = render(
      <ModalProvider>
        <div>Child Component</div>
      </ModalProvider>,
    );
    expect(container.firstChild).toMatchSnapshot();
  });

  it('provides modal context values to children', () => {
    const ChildComponent = () => {
      const { Component, modal, onReject, onResolve, options, thinking } = React.useContext(ModalContext);
      return (
        <>
          <p>Component: {Component ? 'open' : 'closed'}</p>
          <p>Thinking: {thinking ? 'true' : 'false'}</p>
          <button data-testid="modal-button-open" onClick={() => modal(<div>Test Modal</div>)}>
            Open Modal
          </button>
          <button data-testid="modal-button-resolve" onClick={onResolve}>
            Resolve Modal
          </button>
          <button data-testid="modal-button-reject" onClick={onReject}>
            Reject Modal
          </button>
          <p>Options: {JSON.stringify(options)}</p>
        </>
      );
    };

    ChildComponent.propTypes = {
      onButtonClick: PropTypes.func,
    };

    const { getByText, getByTestId } = render(
      <ModalProvider>
        <ChildComponent />
      </ModalProvider>,
    );

    expect(getByText('Component: closed')).toBeInTheDocument();
    expect(getByText('Thinking: false')).toBeInTheDocument();
    expect(getByTestId('modal-button-open')).toBeInTheDocument();
    expect(getByTestId('modal-button-resolve')).toBeInTheDocument();
    expect(getByTestId('modal-button-reject')).toBeInTheDocument();
    expect(getByText('Options: {"dismissable":true,"variant":"center"}')).toBeInTheDocument();

    getByTestId('modal-button-open').click();
    expect(getByText('Component: open')).toBeInTheDocument();

    getByTestId('modal-button-resolve').click();
    // expect(getByText('Component: closed')).toBeInTheDocument();
    // expect(getByText('Thinking: true')).toBeInTheDocument();

    // // Wait for the promise to resolve
    // setTimeout(() => {
    //   expect(getByText('Component: closed')).toBeInTheDocument();
    //   expect(getByText('Thinking: false')).toBeInTheDocument();
    // }, 2000);

    // getByTestId('modal-button-open').click();
    // expect(getByText('Component: open')).toBeInTheDocument();

    // getByTestId('modal-button-reject').click();
    // expect(getByText('Component: closed')).toBeInTheDocument();
    // expect(getByText('Thinking: false')).toBeInTheDocument();
  });
});
