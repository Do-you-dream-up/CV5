const css = JSON.parse(localStorage.getItem('dydu.css'));
import theme from './theme.json';
theme.palette.primary.main  = css && css.main ? css.main : '#3636B9';
export default theme;
