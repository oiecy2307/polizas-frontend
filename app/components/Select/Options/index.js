/**
 *
 * Options
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { components } from 'react-select';

import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import green from '@material-ui/core/colors/green';
import { withStyles } from '@material-ui/core/styles';

const OptionStyles = {
  root: {
    color: green[600],
    '&$checked': {
      color: green[500],
    },
  },
  checked: {},
};

function OptionsStyled(props) {
  const {
    classes,
    selectProp: { setFieldValue },
  } = props;
  return (
    <React.Fragment>
      <div>
        <components.Option {...props}>
          {/* <input
            type="checkbox"
            checked={props.isSelected}
            onChange={() => null}
          />{' '}
          <label>{props.label}</label> */}
          <FormControlLabel
            control={
              <Checkbox
                checked={props.isSelected}
                selectProp={e => setFieldValue(e.target.value)}
                value="false"
                onChange={() => null}
                classes={{
                  root: classes.root,
                  checked: classes.checked,
                }}
              />
            }
            label={props.label}
          />
        </components.Option>
      </div>
    </React.Fragment>
  );
}

OptionsStyled.propTypes = {
  field: PropTypes.object,
  error: PropTypes.string,
  value: PropTypes.string,
  label: PropTypes.string,
  name: PropTypes.string,
  classes: PropTypes.object,
  setFieldValue: PropTypes.func,
  setEveryDayState: PropTypes.func,
  isSelected: PropTypes.bool,
  selectProp: PropTypes.object,
};

export default memo(withStyles(OptionStyles)(OptionsStyled));
