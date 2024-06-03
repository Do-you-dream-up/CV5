import { createUseStyles } from 'react-jss';

export default createUseStyles<any, any>((theme: any): any => {
  return {
    '@keyframes bouncing': {
      '0%': {
        transform: 'translateY(0px)',
      },
      '50%': {
        transform: 'translateY(5px)',
      },
      '100%': {
        transform: 'translateY(0px)',
      },
    },
    base: () => ({
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: theme.palette.primary.main,
      opacity: '.5',
      position: 'absolute',
      width: '30px',
      height: '30px',
      borderRadius: '15px',
      bottom: '80px',
      right: '10px',
      '&:hover': {
        '& .dydu-icon-scroll-to-bottom': {
          animation: '$bouncing 1.5s linear infinite',
        },
      },
    }),
  };
});
