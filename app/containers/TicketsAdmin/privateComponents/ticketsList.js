/**
 *
 * TicketsList
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/min/moment-with-locales';
import { get } from 'lodash';

import CloseTicketDialog from 'components/CloseTicketDialog';
import AssignTicketDialog from 'components/AssignTicketDialog';
import PayTicketDialog from 'components/PayTicketDialog';
import TicketExpandableItem from 'components/TicketExpandableItem';
import EmptyState from 'components/EmptyState';
import { DateDetailContainer, DateText } from '../styledComponents';

moment.locale('es');

export function TicketsList({ tickets, date, onRefresh, dispatch }) {
  const [ticketSelected, setTicketSelected] = useState(null);
  const [isCloseTicketDialogOpen, setIsCloseTicketDialogOpen] = useState(false);
  const [isPayTicketDialogOpen, setIsPayTicketDialogOpen] = useState(false);
  const [isAssignTicketDialogOpen, setIsAssignTicketDialogOpen] = useState(
    false,
  );

  const isToday = moment(date).isSame(new Date(), 'day');
  const formatedDate = moment(date).format('LL');
  const displayDate = isToday
    ? `Hoy (${moment(date).format('LL')})`
    : formatedDate;

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
      case 'closed': {
        setIsPayTicketDialogOpen(true);
        break;
      }
      default:
        break;
    }
  };

  const handleClose = success => {
    setIsCloseTicketDialogOpen(false);
    setIsAssignTicketDialogOpen(false);
    setIsPayTicketDialogOpen(false);
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
          <TicketExpandableItem
            ticket={ticket}
            onButtonClicked={handleButtonClicked}
            dispatch={dispatch}
            key={ticket.id}
          />
        ))}
      </DateDetailContainer>
      {!tickets.length && <EmptyState />}
      <CloseTicketDialog
        open={isCloseTicketDialogOpen}
        onClose={handleClose}
        id={get(ticketSelected, 'id', '').toString()}
        dispatch={dispatch}
      />
      <AssignTicketDialog
        open={isAssignTicketDialogOpen}
        onClose={handleClose}
        dispatch={dispatch}
        id={get(ticketSelected, 'id', '').toString()}
      />
      <PayTicketDialog
        open={isPayTicketDialogOpen}
        onClose={handleClose}
        dispatch={dispatch}
        id={get(ticketSelected, 'id', '').toString()}
        cost={get(ticketSelected, 'cost', '').toString()}
        defaultTicket={
          ticketSelected && ticketSelected.paid ? ticketSelected : null
        }
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
