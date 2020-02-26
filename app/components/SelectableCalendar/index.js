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

function SelectableCalendar({ responsive, maxResponsive, dates }) {
  const [currentDate, setCurrentDate] = useState(moment().format());
  const currentMonth = moment(currentDate).month();
  const currentDayOfMonth = moment(currentDate).date();
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
  const handleDateSelected = date => () => {
    setCurrentDate(
      moment(currentDate)
        .date(date + 1)
        .format(),
    );
  };

  const handleEvaluateVariant = i => {
    const date = moment(currentDate)
      .date(i + 1)
      .format();
    const foundDate = dates.find(d => moment(d.value).isSame(date, 'day'));
    if (!foundDate) return '';
    return foundDate.type;
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
          <DayItem
            onClick={handleDateSelected(i)}
            selected={i === currentDayOfMonth - 1}
            variant={handleEvaluateVariant(i)}
          >
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
  dates: PropTypes.array,
};

SelectableCalendar.defaultProps = {
  responsive: false,
  maxResponsive: 768,
};

export default memo(SelectableCalendar);
