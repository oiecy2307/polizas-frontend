/**
 *
 * Datepicker
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import MomentUtils from '@date-io/moment';
import moment from 'moment/min/moment-with-locales';
import IconButton from '@material-ui/core/IconButton';
import ClearIcon from '@material-ui/icons/Clear';

import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';

const Container = styled.div`
  position: relative;

  & > div {
    width: 100%;
  }

  & .clear-button {
    position: absolute;
    right: 4px;
    top: 4px;
  }
`;

function Datepicker({ language, ...restProps }) {
  const handleClear = () => {
    const { onChange } = restProps;
    if (typeof onChange === 'function') {
      onChange(null);
    }
  };

  return (
    <Container>
      <MuiPickersUtilsProvider
        utils={MomentUtils}
        locale={language}
        libInstance={moment}
      >
        <DatePicker
          autoOk
          format="DD-MM-YYYY"
          inputVariant="filled"
          helperText=""
          cancelLabel="Cancelar"
          okLabel=""
          clearable
          clearLabel="Limpiar"
          {...restProps}
        />
        {restProps.value && (
          <IconButton className="clear-button" onClick={handleClear}>
            <ClearIcon />
          </IconButton>
        )}
      </MuiPickersUtilsProvider>
    </Container>
  );
}

Datepicker.propTypes = {
  language: PropTypes.string,
};

export default memo(Datepicker);
