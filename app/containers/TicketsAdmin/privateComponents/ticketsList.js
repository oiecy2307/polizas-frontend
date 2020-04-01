/**
 *
 * TicketsList
 *
 */

import React, { useState } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment/min/moment-with-locales';
import { get } from 'lodash';
import Numeral from 'numeral';
import { minutesToHours, getFullName } from 'utils/helper';

import DescriptionIcon from '@material-ui/icons/Description';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import PhoneIcon from '@material-ui/icons/Call';
import ClockIcon from '@material-ui/icons/Schedule';
import Money from '@material-ui/icons/AttachMoney';
import LayersIcon from '@material-ui/icons/Layers';
import DoneIcon from '@material-ui/icons/Done';
import ContactIcon from '@material-ui/icons/ContactMailOutlined';
import WarningIcon from '@material-ui/icons/ErrorOutlined';

import ExpandableItem from 'components/ExpandableItem';
import CloseTicketDialog from 'components/CloseTicketDialog';
import AssignTicketDialog from 'components/AssignTicketDialog';
import Label from 'components/Label';
import Avatar from 'components/Avatar';
import Button from 'components/Button';
import { SpaceBetween } from 'utils/globalStyledComponents';
import {
  DateDetailContainer,
  DateText,
  IconGreen,
  ItemMessage,
  ItemCompany,
  LabelPurple,
  ItemMainInfo,
  TicketInformation,
} from '../styledComponents';

moment.locale('es');

const getIcon = ticket => {
  console.log('getIcon ticket', ticket);
  if (ticket.status === 'closed' && !ticket.closed) {
    return <Money />;
  }
  switch (ticket.status) {
    case 'new':
      return <WarningIcon />;
    case 'assigned':
      return <ContactIcon />;
    case 'closed':
      return <DoneIcon />;
    default:
      return <LayersIcon />;
  }
};

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

  const getButtonText = status => {
    switch (status) {
      case 'new':
        return 'Asignar ticket';
      case 'assigned':
        return 'Cerrar ticket';
      case 'closed':
        return 'Pagar ticket';
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
    if (success) {
      onRefresh();
    }
    setTicketSelected(null);
  };

  console.log('isPayTicketDialogOpen', isPayTicketDialogOpen);

  return (
    <div>
      <DateDetailContainer>
        <DateText>{displayDate}</DateText>
        {tickets.map(ticket => (
          <ExpandableItem
            key={ticket.id}
            header={
              <React.Fragment>
                <IconGreen isRed={ticket.status === 'closed' && !ticket.closed}>
                  {getIcon(ticket)}
                </IconGreen>
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
              <TicketInformation>
                <SpaceBetween>
                  <div className="row">
                    <DescriptionIcon />
                    <div>{ticket.description}</div>
                  </div>
                  <Label option={ticket.priority} />
                </SpaceBetween>
                {!!ticket.timeNeeded && (
                  <div className="row">
                    <ClockIcon />
                    <div>{`${minutesToHours(
                      ticket.timeNeeded || 0,
                    )} horas empleadas`}</div>
                  </div>
                )}
                {!!ticket.cost && (
                  <div className="row">
                    <Money />
                    <div>{`El costo de la solución es ${Numeral(
                      ticket.cost,
                    ).format('$0,0.00')}`}</div>
                  </div>
                )}
                <div className="row">
                  <CalendarIcon />
                  <div>
                    {`Creado el ${moment(ticket.createdAt).format(
                      'LL',
                    )} a las ${moment(ticket.createdAt).format('hh:mm a')}`}
                  </div>
                </div>
                {ticket.technical && (
                  <div className="row row-technical">
                    <Avatar name={get(ticket, 'technical.name', '')} />
                    <div>{getFullName(ticket.technical)}</div>
                  </div>
                )}
                <SpaceBetween>
                  <div className="row">
                    <PhoneIcon />
                    <div>{get(ticket, 'client.phone', '')}</div>
                  </div>
                  <Button onClick={() => handleButtonClicked(ticket)}>
                    {getButtonText(ticket.status)}
                  </Button>
                </SpaceBetween>
              </TicketInformation>
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
