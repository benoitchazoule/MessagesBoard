import { createTheme } from '@mui/material/styles';

const theme = createTheme({
    palette: {
        primary: {
            main: '#2B4C5E',
        },
        secondary: {
            main: '#F1F1E6',
        },
        background: {
            default: '#2B4C5E',
        },
        text: {
            primary: '#3c424d',
            secondary: '#4d6f84',
        },
        button: {
            main: '#6b7c94',
        },
    },
    typography: {
        poster: {
            fontSize: '2.4rem',
            color: '#F1F1E6',
        },
    },
});

export default theme;