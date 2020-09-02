/**
 *
 * TicketExpandableItem
 *
 */

import React, { memo, useContext } from 'react';
import PropTypes from 'prop-types';
import { LoggedUser } from 'contexts/logged-user';
import { minutesToHours, getFullName } from 'utils/helper';
import moment from 'moment/min/moment-with-locales';
import { get } from 'lodash';
import Numeral from 'numeral';
import { Link } from 'react-router-dom';

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

import Button from 'components/Button';
import Avatar from 'components/Avatar';
import Label from 'components/Label';
import ExpandableItem from 'components/ExpandableItem';
import TimeTracker from 'components/TimeTracker';
import { SpaceBetween } from 'utils/globalStyledComponents';

import {
  IconGreen,
  ItemMessage,
  ItemCompany,
  LabelPurple,
  ItemMainInfo,
  TicketInformation,
} from './styledComponents';

const getButtonText = (status, paid) => {
  switch (status) {
    case 'new':
      return 'Asignar ticket';
    case 'assigned':
      return 'Cerrar ticket';
    case 'closed':
      return paid ? 'Modificar pago' : 'Pagar ticket';
    default:
      return 'Asignar ticket';
  }
};

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

function TicketExpandableItem({
  ticket,
  onButtonClicked,
  dispatch,
  onTicketTimeChanged,
}) {
  const currentUser = useContext(LoggedUser);

  const isClient = get(currentUser, 'role', '') === 'client';

  const showButton =
    !isClient &&
    ticket.status !== 'cancelled' &&
    !(currentUser.role === 'technical' && ticket.status === 'closed');

  return (
    <ExpandableItem
      key={ticket.id}
      header={
        <React.Fragment>
          <IconGreen isRed={ticket.status === 'closed' && !ticket.paid}>
            {getIcon(ticket)}
          </IconGreen>
          <ItemMainInfo>
            <Link to={`/tickets/${ticket.id}`}>
              <ItemMessage>{ticket.shortName}</ItemMessage>
            </Link>
            <ItemCompany>{get(ticket, 'client.company.name', '-')}</ItemCompany>
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
              <div>{`El costo de la solución es ${Numeral(ticket.cost).format(
                '$0,0.00',
              )}`}</div>
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
          {get(ticket, 'status', '') === 'assigned' && (
            <div className="row">
              <ClockIcon />
              <TimeTracker
                ticket={ticket}
                dispatch={dispatch}
                onTimeChanged={onTicketTimeChanged}
              />
            </div>
          )}
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
              <Avatar
                name={get(ticket, 'technical.name', '')}
                src={get(ticket, 'technical.image', '')}
              />
              <div>{getFullName(ticket.technical)} (técnico)</div>
            </div>
          )}
          {ticket.client && (
            <div className="row row-technical">
              <Avatar
                name={get(ticket, 'client.name', '')}
                src={get(ticket, 'client.image', '')}
              />
              <div>
                {getFullName(ticket.client)} (
                {get(ticket, 'client.company.name', '')})
              </div>
            </div>
          )}
          <SpaceBetween>
            <div className="row">
              {get(ticket, 'client.phoneNumber', '') && (
                <React.Fragment>
                  <PhoneIcon />
                  <div>{get(ticket, 'client.phoneNumber', '')} (cliente)</div>
                </React.Fragment>
              )}
            </div>
            {showButton && (
              <Button onClick={() => onButtonClicked(ticket)}>
                {getButtonText(ticket.status, ticket.paid)}
              </Button>
            )}
          </SpaceBetween>
        </TicketInformation>
      }
    />
  );
}

TicketExpandableItem.propTypes = {
  ticket: PropTypes.object,
  onButtonClicked: PropTypes.func,
  dispatch: PropTypes.func,
  onTicketTimeChanged: PropTypes.func,
};

TicketExpandableItem.defaultProps = {
  ticket: {},
  onButtonClicked: () => {},
  dispatch: () => {},
  onTicketTimeChanged: () => {},
};

export default memo(TicketExpandableItem);
