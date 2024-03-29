import styled, { css } from 'styled-components';

export const IconWrapper = styled.div`
  & + * {
    margin-left: 10px;
  }

  ${({ color }) =>
    color &&
    css`
      color: ${({ color }) => color};
      &:before {
        color: inherit;
      }
    `}

  ${({ onClick }) =>
    onClick &&
    css`
      cursor: pointer;
    `}
`;
