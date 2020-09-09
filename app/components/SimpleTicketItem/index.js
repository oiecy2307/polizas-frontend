/**
 *
 * SimpleTicketItem
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import { get } from 'lodash';

import { formatToFolio } from 'utils/helper';

import LayersIcon from '@material-ui/icons/Layers';
import DoneIcon from '@material-ui/icons/Done';
import ContactIcon from '@material-ui/icons/Build';
import WarningIcon from '@material-ui/icons/ErrorOutlined';
import CloseIcon from '@material-ui/icons/Close';
import Money from '@material-ui/icons/AttachMoney';

import {
  IconGreen,
  ItemMainInfo,
  ItemMessage,
  Container,
} from './styledComponents';

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
    case 'cancelled':
      return <CloseIcon />;
    default:
      return <LayersIcon />;
  }
};

function SimpleTicketItem({ ticket }) {
  return (
    <Container key={ticket.id}>
      <IconGreen
        isRed={
          (ticket.status === 'closed' && !ticket.paid) ||
          ticket.status === 'cancelled'
        }
      >
        {getIcon(ticket)}
      </IconGreen>
      <ItemMainInfo>
        <Link to={`/tickets/${ticket.id}`}>
          <ItemMessage>{ticket.shortName}</ItemMessage>
          <div className="formal-name">
            Folio #{formatToFolio(get(ticket, 'number', ''))}
          </div>
        </Link>
      </ItemMainInfo>
    </Container>
  );
}

SimpleTicketItem.propTypes = {
  ticket: PropTypes.object,
};

export default memo(SimpleTicketItem);
