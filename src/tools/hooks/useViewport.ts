import { DefaultTheme, useTheme } from 'react-jss';

import { useMemo } from 'react';
import { useWindowSize } from 'react-use';

interface ThemeProps extends DefaultTheme {
  breakpoints: {
    down: (str) => string;
  };
}

const useViewport = () => {
  const theme = useTheme<ThemeProps>();
  const size = useWindowSize();

  const hasSupport = !!window.matchMedia;

  const isMobile = useMemo(() => {
    const query = theme?.breakpoints?.down('xs').replace(/^@media( ?)/m, '');
    return hasSupport && window.matchMedia(query).matches;
  }, [size]);

  return {
    isMobile,
  };
};

export default useViewport;
