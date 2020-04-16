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
import history from 'utils/history';

import DescriptionIcon from '@material-ui/icons/Description';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import PhoneIcon from '@material-ui/icons/Call';
import ClockIcon from '@material-ui/icons/Schedule';
import Money from '@material-ui/icons/AttachMoney';
import Invoice from '@material-ui/icons/ReceiptOutlined';
import LayersIcon from '@material-ui/icons/Layers';
import DoneIcon from '@material-ui/icons/Done';
import ContactIcon from '@material-ui/icons/ContactMail';
import WarningIcon from '@material-ui/icons/ErrorOutlined';

import ExpandableItem from 'components/ExpandableItem';
import CloseTicketDialog from 'components/CloseTicketDialog';
import AssignTicketDialog from 'components/AssignTicketDialog';
import PayTicketDialog from 'components/PayTicketDialog';
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
  if (ticket.status === 'closed' && !ticket.paid) {
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

export function TicketsList({ tickets, date, onRefresh, dispatch, isClient }) {
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
          <ExpandableItem
            key={ticket.id}
            header={
              <React.Fragment>
                <IconGreen isRed={ticket.status === 'closed' && !ticket.paid}>
                  {getIcon(ticket)}
                </IconGreen>
                <ItemMainInfo>
                  <ItemMessage
                    onClick={() => history.push(`/tickets/${ticket.id}`)}
                  >
                    {ticket.shortName}
                  </ItemMessage>
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
                {ticket.paid && (
                  <div className="row">
                    <Money />
                    <div>{`Se pagaron ${Numeral(ticket.totalPaid || 0).format(
                      '$0,0.00',
                    )} el ${moment(ticket.paidDate).format('LL')} `}</div>
                  </div>
                )}
                {!!ticket.invoice && (
                  <div className="row">
                    <Invoice />
                    <div>{`El número de factura es ${ticket.invoice}`}</div>
                  </div>
                )}
                {ticket.technical && (
                  <div className="row row-technical">
                    <Avatar name={get(ticket, 'technical.name', '')} />
                    <div>{getFullName(ticket.technical)} (asignado)</div>
                  </div>
                )}
                <SpaceBetween>
                  <div className="row">
                    <PhoneIcon />
                    <div>{get(ticket, 'client.phoneNumber', '')} (cliente)</div>
                  </div>
                  {!isClient && (
                    <Button onClick={() => handleButtonClicked(ticket)}>
                      {getButtonText(ticket.status)}
                    </Button>
                  )}
                </SpaceBetween>
              </TicketInformation>
            }
          />
        ))}
      </DateDetailContainer>
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
      />
    </div>
  );
}

TicketsList.propTypes = {
  tickets: PropTypes.array,
  date: PropTypes.string,
  dispatch: PropTypes.func,
  onRefresh: PropTypes.func,
  isClient: PropTypes.bool,
};

export default TicketsList;
