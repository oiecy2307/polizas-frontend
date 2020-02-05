/**
 *
 * Select
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { withStyles } from '@material-ui/core/styles';
import ClickAwayListener from '@material-ui/core/ClickAwayListener';
import Fade from '@material-ui/core/Fade';
import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import styles from './styles';
import messages from './messages';
import {
  Wrapper,
  OptionsWrapper,
  EmptyOptions,
  OptionsList,
  OptionsItem,
} from './styledComponents';

function Select({
  classes,
  options,
  open,
  setFieldValue,
  setFieldValueAll,
  selected,
  onClose,
  allSelected,
  allLabel,
  optionsType,
}) {
  const [openMenu, setOpenMenu] = useState(open);
  const handleClose = () => {
    onClose();
    setOpenMenu(false);
  };

  const handleChange = (e, option) => {
    const { checked } = e.target;
    setFieldValue(option, checked);
  };

  const handleChangeAll = (e, option) => {
    const { checked } = e.target;
    setFieldValueAll(option, checked);
  };

  const handleClick = option => {
    if (selected.indexOf(option) > -1) {
      return setFieldValue(option, false);
    }
    return setFieldValue(option, true);
  };

  const handleClickAll = option => {
    if (allSelected) {
      setFieldValueAll(option, false);
    } else {
      setFieldValueAll(option, true);
    }
  };
  return (
    <Wrapper>
      <ClickAwayListener onClickAway={handleClose}>
        <div>
          {openMenu && (
            <Fade in={openMenu}>
              <OptionsWrapper>
                {options.length < 1 && (
                  <EmptyOptions>{messages[optionsType]}</EmptyOptions>
                )}
                {options.length > 0 && (
                  <OptionsList>
                    <OptionsItem
                      key="todos"
                      onClick={() => handleClickAll('todos')}
                    >
                      <FormControlLabel
                        control={
                          <Checkbox
                            value="Seleccionar todos"
                            checked={allSelected}
                            classes={{
                              root: classes.checkboxRoot,
                              checked: classes.checked,
                            }}
                            onChange={e => handleChangeAll(e, 'todos')}
                          />
                        }
                        label={allLabel}
                      />
                    </OptionsItem>
                    {options.map(option => (
                      <OptionsItem
                        key={option.id}
                        onClick={() => handleClick(option)}
                      >
                        <FormControlLabel
                          control={
                            <Checkbox
                              value={option.name}
                              checked={selected.indexOf(option) !== -1}
                              onChange={e => handleChange(e, option)}
                              classes={{
                                root: classes.checkboxRoot,
                                checked: classes.checked,
                              }}
                            />
                          }
                          label={option.name}
                        />
                      </OptionsItem>
                    ))}
                  </OptionsList>
                )}
              </OptionsWrapper>
            </Fade>
          )}
        </div>
      </ClickAwayListener>
    </Wrapper>
  );
}

Select.propTypes = {
  classes: PropTypes.object.isRequired,
  options: PropTypes.array.isRequired,
  setFieldValue: PropTypes.func.isRequired,
  allLabel: PropTypes.string.isRequired,
  open: PropTypes.bool,
  selected: PropTypes.array,
  onClose: PropTypes.func,
  allSelected: PropTypes.bool,
  setFieldValueAll: PropTypes.func,
  optionsType: PropTypes.string,
};

export default withStyles(styles)(Select);
