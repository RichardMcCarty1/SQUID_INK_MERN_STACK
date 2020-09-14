import { createMuiTheme } from '@material-ui/core/styles';
import purple from '@material-ui/core/colors/purple';
import orange from "@material-ui/core/colors/orange";
import Button from "@material-ui/core";

const theme = createMuiTheme({
    button: {
        backgroundColor: "primary",
        "&:hover": {
            backgroundColor: "orange"
        }
    },
    palette: {
        primary: {
            main: purple[500],
        },
        secondary: {
            main: '#f44336',
        },
    },
});
export default theme