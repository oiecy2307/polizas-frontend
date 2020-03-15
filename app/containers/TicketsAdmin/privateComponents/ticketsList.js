/**
 *
 * TicketsList
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/min/moment-with-locales';
import { get } from 'lodash';

import ExpandableItem from 'components/ExpandableItem';
import CloseTicketDialog from 'components/CloseTicketDialog';
import AssignTicketDialog from 'components/AssignTicketDialog';
import Button from 'components/Button';
import { SpaceBetween } from 'utils/globalStyledComponents';
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

export function TicketsList({ tickets, date, onRefresh, dispatch }) {
  const [ticketSelected, setTicketSelected] = useState(null);
  const [isCloseTicketDialogOpen, setIsCloseTicketDialogOpen] = useState(false);
  const [isAssignTicketDialogOpen, setIsAssignTicketDialogOpen] = useState(
    false,
  );
  const isToday = moment(date).isSame(new Date(), 'day');
  const formatedDate = moment(date).format('LL');
  const displayDate = isToday
    ? `Hoy (${moment(date).format('LL')})`
    : formatedDate;

  const getButtonText = status => {
    switch (status) {
      case 'new':
        return 'Asignar ticket';
      case 'assigned':
        return 'Cerrar ticket';
      default:
        return 'Asignar ticket';
    }
  };

  const handleButtonClicked = ticket => {
    setTicketSelected(ticket);
    switch (ticket.status) {
      case 'assigned': {
        setIsCloseTicketDialogOpen(true);
        break;
      }
      case 'new': {
        setIsAssignTicketDialogOpen(true);
        break;
      }
      default:
        break;
    }
  };

  const handleClose = success => {
    setIsCloseTicketDialogOpen(false);
    setIsAssignTicketDialogOpen(false);
    if (success) {
      onRefresh();
    }
    setTicketSelected(null);
  };

  return (
    <div>
      <DateDetailContainer>
        <DateText>{displayDate}</DateText>
        {tickets.map(ticket => (
          <ExpandableItem
            key={ticket.id}
            header={
              <React.Fragment>
                <IconPurple />
                <ItemMainInfo>
                  <ItemMessage>{ticket.shortName}</ItemMessage>
                  <ItemCompany>
                    {get(ticket, 'client.company.name', '-')}
                  </ItemCompany>
                </ItemMainInfo>
                {false && <LabelPurple>{ticket.status}</LabelPurple>}
              </React.Fragment>
            }
            content={
              <SpaceBetween>
                <div>{ticket.description}</div>
                {ticket.status !== 'closed' && (
                  <Button onClick={() => handleButtonClicked(ticket)}>
                    {getButtonText(ticket.status)}
                  </Button>
                )}
              </SpaceBetween>
            }
          />
        ))}
      </DateDetailContainer>
      <CloseTicketDialog
        open={isCloseTicketDialogOpen}
        onClose={handleClose}
        id={get(ticketSelected, 'id', '')}
        dispatch={dispatch}
      />
      <AssignTicketDialog
        open={isAssignTicketDialogOpen}
        onClose={handleClose}
        dispatch={dispatch}
        id={get(ticketSelected, 'id', '')}
      />
    </div>
  );
}

TicketsList.propTypes = {
  tickets: PropTypes.array,
  date: PropTypes.string,
  dispatch: PropTypes.func,
  onRefresh: PropTypes.func,
};

export default TicketsList;
