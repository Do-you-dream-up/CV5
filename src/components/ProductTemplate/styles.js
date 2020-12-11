import { createUseStyles } from 'react-jss';

export default createUseStyles(theme => ({
    button: () => ({
        '& > :not(:last-child)': {
            marginRight: '.6em',
        },
        '& a[href]': {
            '&:hover': {
                backgroundColor: theme.palette.primary.hover,
                textDecoration: 'none',
            },
            alignItems: 'center',
            background: theme.palette.primary.main,
            borderRadius: '5px',
            color: theme.palette.primary.text,
            display: 'flex',
            fontSize: '.8em',
            height: '1.8em',
            justifyContent: 'center',
            width: '5em',
        },
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: '.8em',
    }),
    text: () => ({
        '& h3': {
            fontSize: '1em',
            margin: '.4em 0 .4em 0 !important',
        },
        '& p': {
            fontSize: '.8em',
            margin: '.2em 0',
        },
    })
}));
