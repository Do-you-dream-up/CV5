import { createUseStyles } from 'react-jss';

export default createUseStyles(theme => ({
    button: () => ({
        '& > :not(:last-child)': {
            marginRight: '.5em',
        },
        '& a[href]': {
            '&:hover': {
                backgroundColor: theme.palette.primary.hover,
                textDecoration: 'none',
            },
            alignItems: 'center',
            background: theme.palette.primary.main,
            borderRadius: '4px',
            color: theme.palette.primary.text,
            display: 'flex',
            fontSize: '1em',
            justifyContent: 'center',
            margin: '0.2em 0',
            padding: '0.5em 1.2em',
        },
        '& div' : {
            flexShrink: '0',
        },
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        margin: '0.8em 0',
        padding: '0 1em',
    }),
    image : () => ({
        '& img': {
            maxWidth: '80%',
        }
    }),
    root : () => ({
        margin: '-0.8em -1em',
    }),
    text: () => ({
        '& h3': {
            '& + p': {
                marginTop: '-0.75em',
            },
            fontWeight: 'bold!important',
        },
        margin: '0.8em 0',
        padding: '0 1em',
    })
}));
