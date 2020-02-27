/**
 *
 * TicketsList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/min/moment-with-locales';

import ExpandableItem from 'components/ExpandableItem';
import {
  DateDetailContainer,
  DateText,
  IconPurple,
  ItemMessage,
  ItemCompany,
  LabelPurple,
  ItemMainInfo,
} from '../styledComponents';

moment.locale('es');

export function TicketsList({ tickets, date }) {
  const isToday = moment(date).isSame(new Date(), 'day');
  const formatedDate = moment(date).format('LL');
  const displayDate = isToday
    ? `Hoy (${moment(date).format('LL')})`
    : formatedDate;
  return (
    <div>
      <DateDetailContainer>
        <DateText>{displayDate}</DateText>
        {tickets.map(ticket => (
          <ExpandableItem
            header={
              <React.Fragment>
                <IconPurple />
                <ItemMainInfo>
                  <ItemMessage>{ticket.shortName}</ItemMessage>
                  <ItemCompany>Company</ItemCompany>
                </ItemMainInfo>
                <LabelPurple>{ticket.status}</LabelPurple>
              </React.Fragment>
            }
            content={<div>{ticket.description}</div>}
          />
        ))}
      </DateDetailContainer>
    </div>
  );
}

TicketsList.propTypes = {
  tickets: PropTypes.array,
  date: PropTypes.string,
};

export default TicketsList;
