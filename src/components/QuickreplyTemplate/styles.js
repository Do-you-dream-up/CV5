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
            flexShrink: '0',
            justifyContent: 'center',
            padding : '0.5em 1.2em',
        },
        '& > div > a[href] > img': {
            display: 'inline',
            height: 'auto',
            marginRight: '3px',
            objectFit: 'cover',
        },
        display: 'grid',
        gridGap: '1em',
        gridTemplateColumns: items === 4 ? 'repeat(2, 1fr)' : 'repeat(2, 1fr)',
        gridTemplateRows: 'auto',
        text: () => ({
            margin: '0.8em 0',
            padding: '0 1em',
        })
    }),
}));
