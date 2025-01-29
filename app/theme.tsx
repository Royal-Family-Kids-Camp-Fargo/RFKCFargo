import { createTheme } from '@mui/material/styles';
import { red } from '@mui/material/colors';

// A custom theme for this app
const theme = createTheme({
  cssVariables: true,
  typography: {
    fontFamily: '"Figtree", "Helvetica", "Arial", sans-serif',
    button: {
      textTransform: 'none',
    },
    h1: {
      fontWeight: 600,
    },
    h2: {
      fontWeight: 600,
    },
    h3: {
      fontWeight: 600,
    },
    h4: {
      fontWeight: 600,
    },
  },
  components: {
    // Name of the component
    MuiButtonBase: {
      defaultProps: {
        // The props to change the default for.
        disableRipple: true, // No more ripple, on the whole application 💣!',
      },
    },
  },
  palette: {
    mode: 'light',
    primary: {
      main: '#5f3494',
    },
    secondary: {
      main: '#ce202d',
    },
    error: {
      main: '#fd1169',
    },
  },
});

export default theme;
