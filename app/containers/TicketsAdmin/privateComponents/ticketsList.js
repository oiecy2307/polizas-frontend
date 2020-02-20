/**
 *
 * TicketsList
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
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

export function TicketsList({ tickets }) {
  console.log('tickets', tickets);
  return (
    <div>
      <DateDetailContainer>
        <DateText>Hoy (12 de junio 2019)</DateText>
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
};

export default TicketsList;
