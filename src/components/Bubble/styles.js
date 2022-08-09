import { createUseStyles } from 'react-jss';

export default createUseStyles((theme) => {
  const request = ({ color = 'primary' } = {}) => {
    return {
      ...(color && {
        /*  add '33' at the end to add 20% opacity and transform rgb to rgba
            https://stackoverflow.com/a/55735175/9535028
        */
        backgroundColor: `${theme.palette[color].main}33`,
      }),
    };
  };

  return {
    actions: () => ({
      '&:not(:first-child)': {
        marginTop: '1em',
      },
    }),
    base: ({ hasCarouselAndSidebar }) => ({
      alignItems: 'center',
      display: 'flex',
      minHeight: hasCarouselAndSidebar ? '9.5em' : '3em',
      overflow: 'hidden',
      position: 'relative',
      wordBreak: 'break-word',
      // eslint-disable-next-line sort-keys
      '&:not(:last-child)': {
        marginBottom: '.5em',
      },
    }),
    body: () => ({
      '&:focus': {
        outline: 'none',
      },
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      padding: [['.8em', '1em']],
      width: '100%',
    }),
    progress: () => ({
      left: 0,
      position: 'absolute',
      right: 0,
      top: 0,
    }),
    request: ({ color = 'primary' }) => ({
      ...request({ color }),
      color: theme.palette.request.text,
      marginLeft: 'auto',
      borderRadius: '15px 0px 15px 15px',
    }),
    response: () => ({
      borderRadius: '0 15px 15px 15px',
      backgroundColor: theme.palette.response.background,
      color: theme.palette.response.text,
      marginRight: 'auto',

      '&.template-style': {
        width: 270,
        backgroundColor: '#FFFFFF',
        alignItems: 'normal',
        borderRadius: 10,
        boxShadow: '0px 2px 4px #BABFC4',
        height: '364px !important',
        '& .dydu-bubble-body': {
          alignItems: 'center',
          padding: 0,
          '& .content-prettyhtml': {
            width: '100%',
            height: '100%',
            //!\ needed to modify the product template here to not modify the basic Carousel component //!\
            '& .dydu-product-template': {
              width: '100%',
              // height: 374,
              height: '100%',
            },
          },
        },
      },
    }),
  };
});
