import { createUseStyles } from 'react-jss';

export default createUseStyles( theme => ({
    buttons: ({items}) => ({
        '& > div': {
            '&:hover': {
                '& > a[href]': {
                    textDecoration: 'none',
                },
                backgroundColor: theme.palette.primary.hover,
            },
            alignItems: 'center',
            backgroundColor: theme.palette.primary.main,
            borderRadius: '5px',
            display: 'flex',
            justifyContent: 'center',
        },
        '& > div > a[href]': {
            color: theme.palette.primary.text,
            display: 'flex',
            fontSize: '.8em',
            justifyContent: 'center',
            padding: '.2em',
        },
        '& > div > a[href] > img': {
            display: 'inline',
            height: 'auto',
            marginRight: '3px',
        },
        display: 'grid',
        gridGap: '1em',
        gridTemplateColumns: items === 4 ? 'repeat(2, 1fr)' : 'repeat(3, 1fr)',
        gridTemplateRows: 'auto',
    }),
}));
