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

import { MuiPickersUtilsProvider, DatePicker } from '@material-ui/pickers';

const Container = styled.div`
  & > div {
    width: 100%;
  }
`;

function Datepicker({ language, ...restProps }) {
  return (
    <Container>
      <MuiPickersUtilsProvider
        utils={MomentUtils}
        locale={language}
        libInstance={moment}
      >
        <DatePicker
          format="DD-MM-YYYY"
          inputVariant="filled"
          helperText=""
          {...restProps}
        />
      </MuiPickersUtilsProvider>
    </Container>
  );
}

Datepicker.propTypes = {
  language: PropTypes.string,
};

export default memo(Datepicker);
