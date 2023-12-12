import styled, { css } from 'styled-components';

export const StyledSidebarMode = styled.div<{
  $mode: string;
  $configuration: Models.Configuration;
  $height: number;
  $width: number;
}>`
  ${(props) => {
    console.log(props.theme);
    const base = {
      backgroundColor: props.theme.palette.background.sidebar,
      boxShadow: props.theme.shadows[1],
      display: 'flex',
      flexDirection: 'column',
      height: props.$configuration.sidebar.fixedDimensions ? undefined : props.$height,
      overflowY: 'auto',
      maxHeight: '648px',
      width: props.$configuration.sidebar.fixedDimensions ? props.$configuration.sidebar.width : props.$width,
      [props.theme.breakpoints?.up('xl')]: {
        minWidth: props.$configuration.sidebar.fixedDimensions ? props.$configuration.sidebar.width : props.$width,
        maxHeight: '100%',
      },
      [props.theme.breakpoints?.down('md')]: {
        maxHeight: '100%',
        maxWidth: '100%',
      },
    };

    let modeStyle = {};

    const side = {
      borderRadius: props.theme.shape?.radius?.outer,
      bottom: 0,
      position: 'absolute',
      top: 0,
      [props.theme.breakpoints?.down('sm')]: {
        borderRadius: 0,
        left: 0,
        marginRight: 'unset',
        right: 0,
        width: 'unset !important',
        top: '3.4em',
        height: 'calc(100% - 115px)', // size of the chatbox header (minHeight + padding)
      },
    };

    switch (props.$mode) {
      case 'left':
        modeStyle = { ...modeStyle, ...side, marginRight: '.5em', right: '100%' };
        break;
      case 'right':
        modeStyle = { ...modeStyle, ...side, marginLeft: '.5em', left: '100%' };
        break;
      case 'over':
        modeStyle = { ...modeStyle, boxShadow: 'none', flexGrow: 1, width: 'unset' };
        break;
    }

    return css`
      ${base},
      ${modeStyle}
    `;
  }}
`;

export const StyledSidebarFrame = styled.iframe`
  border: 0;
  flex-grow: 1;
`;

export const StyledSidebarActions = styled.div`
  & > :not(:first-child): {
    margin-left: 1em;
  }
  display: flex;
  margin-left: auto;
`;

export const StyledSidebarHeader = styled.div<{ $isTransparent: boolean }>`
  ${(props) => {
    const header = {
      zIndex: props.$isTransparent ? null : 10,
      backgroundColor: `${props.theme.palette.background.sidebar}${props.$isTransparent ? 'CC' : ''}`,
      display: 'flex',
      padding: '1.6em 1.6em 10px',
      position: 'sticky',
      top: 0,
    };
    return css`
      ${header}
    `;
  }}
`;

export const StyledSidebarTitle = styled.h1`
  margin: 0;
  margin-right: 1em;
  flex-grow: 1;
`;
