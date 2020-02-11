/**
 *
 * SelectableCalendar
 *
 */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import ArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import ArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import { times } from 'lodash';
import moment from 'moment/min/moment-with-locales';
import {
  Container,
  IconContainer,
  Header,
  DaysName,
  DaysContainer,
  DayItem,
} from './styledComponents';

const iconStyle = {
  color: '#919EAB',
  fontSize: 24,
  cursor: 'pointer',
};

moment.locale('es');

function SelectableCalendar({ responsive, maxResponsive }) {
  const [currentDate, setCurrentDate] = useState(moment().format());
  const currentMonth = moment(currentDate).month();
  const daysInMonth = moment()
    .month(currentMonth)
    .daysInMonth();
  const currentMonthFormated = moment(currentDate).format('MMMM YYYY');
  const startOfMonth = Number(
    moment(currentDate)
      .startOf('month')
      .format('d'),
  );
  const handleChangeMonth = amount => () => {
    setCurrentDate(
      moment(currentDate)
        .add(amount, 'M')
        .format(),
    );
  };
  return (
    <Container responsive={responsive} maxResponsive={maxResponsive}>
      <Header>
        <IconContainer onClick={handleChangeMonth(-1)}>
          <ArrowLeftIcon style={iconStyle} />
        </IconContainer>
        <span>{currentMonthFormated}</span>
        <IconContainer onClick={handleChangeMonth(1)}>
          <ArrowRightIcon style={iconStyle} />
        </IconContainer>
      </Header>
      <DaysName>
        <span>D</span>
        <span>L</span>
        <span>M</span>
        <span>M</span>
        <span>J</span>
        <span>V</span>
        <span>S</span>
      </DaysName>
      <DaysContainer>
        {times(startOfMonth, () => (
          <DayItem />
        ))}
        {times(daysInMonth, i => (
          <DayItem>
            <span>{i + 1}</span>
          </DayItem>
        ))}
      </DaysContainer>
    </Container>
  );
}

SelectableCalendar.propTypes = {
  responsive: PropTypes.bool,
  maxResponsive: PropTypes.number,
};

SelectableCalendar.defaultProps = {
  responsive: false,
  maxResponsive: 768,
};

export default memo(SelectableCalendar);
