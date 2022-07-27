import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => ({
  button: () => ({
    display: 'flex',
    flexDirection: 'column',
    width: '100%',
    padding: '0 10px',
    margin: 'auto 0 0.8em 0',
    '& a[href]': {
      '&:hover': {
        backgroundColor: theme.palette.primary.hover,
        textDecoration: 'none',
      },
      alignItems: 'center',
      background: theme.palette.primary.main,
      borderRadius: 6,
      color: '#FFFFFF',
      display: 'flex',
      height: 36,
      fontSize: 14,
      justifyContent: 'center',
      margin: '0.2em 0',
    },
    '& div': {
      '&:not(:first-child) a[href]': {
        backgroundColor: 'transparent',
        border: '1px solid',
        borderColor: theme.palette.primary.main,
        color: theme.palette.primary.main,
      },
      flexShrink: '0',
    },
  }),
  image: () => ({
    width: 250,
    height: 258,
    minHeight: 108,
    marginTop: 10,
    borderRadius: 10,
    '& img': {
      width: '100%',
      height: '100% !important',
      objectFit: 'cover',
      borderRadius: 10,
      '&.empty-image': {
        border: '1px solid rgba(112, 145, 216, .2)', // #7091D8
        background: 'url("./icons/empty-img.svg") no-repeat center',
      },
    },
  }),
  root: () => ({
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    height: '100%',
  }),
  body: () => ({
    width: '100%',
  }),
  bodyTruncated: () => ({
    overflowY: 'scroll',
  }),
  text: () => ({
    margin: '10px 0',
    marginBottom: 20,
    padding: '0 10px',
    '& div': {
      textAlign: 'justify',
      color: '#74889D',
      fontSize: 12,
    },
    '& h3': {
      marginBottom: 10,
      fontSize: 14,
      fontFamily: 'Roboto Medium',
      textTransform: 'uppercase !important',
      color: '#33333B',
      display: '-webkit-box',
      lineClamp: 2,
      boxOrient: 'vertical',
      overflow: 'hidden',
      textOverflow: 'ellipsis',
    },
  }),
}));
