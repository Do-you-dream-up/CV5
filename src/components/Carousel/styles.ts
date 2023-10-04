/* istanbul ignore file */

import { createUseStyles } from 'react-jss';

export default createUseStyles<any, any>((theme: any): any => ({
  carousel: {
    '& .slick-slide': {
      '& .dydu-bubble-response': {
        marginBottom: 10,
      },
    },
    '& .slick-next::before, .slick-prev::before': {
      color: theme?.palette?.primary?.main ?? '#41479B',
    },
    '& .slick-next': {
      right: 0,
    },
    '& .slick-prev': {
      left: 0,
      zIndex: 1,
    },
  },
}));
