/**
 *
 * Input
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import TextField from '@material-ui/core/TextField';
import { withStyles, createMuiTheme } from '@material-ui/core/styles';
import { ThemeProvider } from '@material-ui/styles';
import { green } from '@material-ui/core/colors';
import classNames from 'classnames';

const theme = createMuiTheme({
  palette: {
    primary: green,
  },
  typography: {
    fontFamily: ['product-sans', '"Helvetica Neue"', 'Helvetica', 'Arial'],
  },
});

const styles = () => ({
  root: {
    display: 'flex',
    flexWrap: 'wrap',
    width: '100%',
    marginBottom: 32,
  },
});

function Input(props) {
  const { classes, maxLength } = props;
  return (
    <ThemeProvider theme={theme}>
      <TextField
        {...props}
        className={classNames(classes.root)}
        variant="filled"
        inputProps={{
          maxLength,
          ...props.inputProps,
        }}
      />
    </ThemeProvider>
  );
}

Input.propTypes = {
  classes: PropTypes.object,
  inputProps: PropTypes.object,
  maxLength: PropTypes.any,
};

Input.defaultValue = {
  maxLength: 255,
};

export default withStyles(styles)(memo(Input));
