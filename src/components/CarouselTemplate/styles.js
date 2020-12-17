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
            fontSize: '.7em',
            justifyContent: 'center',
        },
        alignItems: 'center',
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        marginTop: '.8em',
    }),
    image : () => ({
        height: '20%',
        width: 'auto',
    }),
    text: () => ({
        '& div > span': {
            fontSize: '.7em',
            margin: '.2em 0',
        },
        '& h3': {
            fontSize: '.9em',
            margin: '.4em 0 .4em 0 !important',
        },
        '& p': {
            fontSize: '.7em',
            margin: '.2em 0',
        },
    })
}));
