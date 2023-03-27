import '@testing-library/jest-dom';

import { render, screen } from '@testing-library/react';

import Scroll from './Scroll';

describe('Scroll', () => {
  it('should scroll to the bottom of the chatbox when rendered', () => {
    // Arrange
    const chatboxDiv = document.createElement('div');
    chatboxDiv.className = 'dydu-chatbox-body';
    chatboxDiv.style.height = '100px';
    chatboxDiv.style.overflow = 'auto';
    chatboxDiv.innerHTML = `
      <div style="height: 200px;"></div>
    `;
    document.body.appendChild(chatboxDiv);

    // Act
    render(
      <Scroll>
        <div style={{ height: '500px' }}></div>
      </Scroll>,
    );

    // Assert
    expect(chatboxDiv.scrollTop).toBe(chatboxDiv.scrollHeight);
  });

  it('should debounce the scroll function by the specified delay', async () => {
    // Arrange
    jest.useFakeTimers();
    const delay = 1000;
    const chatboxDiv = document.createElement('div');
    chatboxDiv.className = 'dydu-chatbox-body';
    chatboxDiv.style.height = '100px';
    chatboxDiv.style.overflow = 'auto';
    chatboxDiv.innerHTML = `
      <div style="height: 200px;"></div>
    `;
    document.body.appendChild(chatboxDiv);

    // Act
    render(
      <Scroll delay={delay}>
        <div style={{ height: '500px' }}></div>
      </Scroll>,
    );

    // Wait for the debounce delay
    jest.advanceTimersByTime(delay - 1);
    expect(chatboxDiv.scrollTop).toBe(0);

    // Wait for the scroll function to execute
    jest.advanceTimersByTime(1);
    expect(chatboxDiv.scrollTop).toBe(chatboxDiv.scrollHeight);
  });
});
