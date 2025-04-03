import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => {
  const pathSvg = ({ color = 'primary' } = {}) => {
    return {
      ...(color && {
        /*  add '33' at the end to add 20% opacity and transform rgb to rgba
            https://stackoverflow.com/a/55735175/9535028
        */
        fill: `${theme.palette[color].main}7F`,
      }),
    };
  };

  return {
    poweredText: () => ({
      display: 'flex',
      justifyContent: 'center',
      marginTop: 'auto',
      paddingTop: 10,
      '& $p': {
        display: 'flex',
        alignItems: 'center',
        fontSize: '12px',
        color: theme.palette.primary.main,
        '& $svg': {
          width: '15px',
          height: 'auto',
          margin: '0 5px',
        },
        '& $path:last-of-type': {
          fill: theme.palette.primary.main,
        },
        '& $path:not(:last-of-type)': {
          ...pathSvg(theme.palette.primary.main),
        },
        '& $a': {
          color: theme.palette.primary.main,
          fontWeight: '700',
        },
      },
    }),
    poweredByLogo: {
      width: '70px',
    },
  };
});
