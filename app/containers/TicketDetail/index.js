/**
 *
 * TicketDetail
 *
 */

import React, { memo, useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import { get, times } from 'lodash';
import moment from 'moment/min/moment-with-locales';
import { getFullName, getIsImage } from 'utils/helper';
import { LoggedUser } from 'contexts/logged-user';

import { wsGetTicketById } from 'services/tickets';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import CreateEditTicket from 'components/CreateEditTicket';

import Button from 'components/Button';
import Label from 'components/Label';
import Avatar from 'components/Avatar';
import Skeleton from '@material-ui/lab/Skeleton';
import Tooltip from '@material-ui/core/Tooltip';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';

import { Container, TopSection, Header, Body } from './styledComponents';

moment.locale('es');

export function TicketDetail({ dispatch, match }) {
  const currentUser = useContext(LoggedUser);
  const [ticket, setTicket] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [editingOpen, setEditingOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isClient] = useState(get(currentUser, 'role', '') === 'client');

  useEffect(() => {
    fetchTicket();
  }, []);

  const fetchTicket = async () => {
    try {
      const id = get(match, 'params.id', null);
      if (!id) return;
      dispatch(aSetLoadingState(true));
      const response = await wsGetTicketById(id);
      if (!response || response.error) {
        dispatch(aOpenSnackbar('No fue posible obtener ticket', 'error'));
        setNotFound(true);
        return;
      }
      if (!response.data) setNotFound(true);
      else setTicket(response.data);
    } catch (e) {
      setNotFound(true);
      dispatch(aOpenSnackbar('No fue posible obtener ticket', 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
      setInitialLoading(false);
    }
  };

  const handleTicketSaved = () => {
    fetchTicket();
  };

  const handleOpen = () => {
    setEditingOpen(true);
  };

  const handleClose = () => {
    setEditingOpen(false);
  };

  const handleOpenMenu = event => {
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(false);
  };

  const handleChangeStatus = () => () => {
    handleCloseMenu();
  };

  const open = Boolean(anchorEl);
  const id = open ? 'popover-statuses' : undefined;

  if (notFound) {
    return (
      <div>
        <Helmet>
          <title>Detalle ticket</title>
          <meta name="description" content="Description of TicketDetail" />
        </Helmet>
        <h1>404</h1>
        <h1>No se encontró el ticket</h1>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div>
        <Helmet>
          <title>Detalle ticket</title>
          <meta name="description" content="Description of TicketDetail" />
        </Helmet>
        {times(10, i => (
          <React.Fragment key={i}>
            <Skeleton
              animation="wave"
              height="40px"
              width="100%"
              variant="text"
              key={i}
            />
          </React.Fragment>
        ))}
      </div>
    );
  }

  const shortName = get(ticket, 'shortName', '');
  const createdAt = get(ticket, 'createdAt', '');
  const description = get(ticket, 'description', '');
  const priority = get(ticket, 'priority', '');
  const status = get(ticket, 'paid', false)
    ? 'paid'
    : get(ticket, 'status', 'new');
  const technicalName = getFullName(get(ticket, 'technical', {}));
  const reporterName = getFullName(get(ticket, 'reporter', {}));
  const clientName = getFullName(get(ticket, 'client', {}));
  const evidence = get(ticket, 'evidence', []);

  const statusesAvailable = (() => {
    const { status: ticketStatus } = ticket;

    if (ticketStatus === 'closed') {
      return [
        <MenuItem onClick={handleChangeStatus('assigned')}>Asignado</MenuItem>,
        <MenuItem onClick={handleChangeStatus('new')}>Por asignar</MenuItem>,
        <MenuItem onClick={handleChangeStatus('cancelled')}>
          Cancelado
        </MenuItem>,
      ];
    }

    if (ticketStatus === 'assigned') {
      return [
        <MenuItem onClick={handleChangeStatus('new')}>Por asignar</MenuItem>,
        <MenuItem onClick={handleChangeStatus('closed')}>Cerrado</MenuItem>,
        <MenuItem onClick={handleChangeStatus('cancelled')}>
          Cancelado
        </MenuItem>,
      ];
    }

    if (ticketStatus === 'new') {
      return [
        <MenuItem onClick={handleChangeStatus('cancelled')}>
          Cancelado
        </MenuItem>,
      ];
    }

    return [];
  })();

  return (
    <Container>
      <Helmet>
        <title>{shortName || 'Detalle ticket'}</title>
        <meta name="description" content="Description of TicketDetail" />
      </Helmet>
      <TopSection>
        <div>
          <h4>{shortName}</h4>
          <Tooltip title={moment(createdAt).format('LL')}>
            <div style={{ width: 'fit-content' }}>
              {`Creado ${moment(createdAt).fromNow()}`}
            </div>
          </Tooltip>
        </div>
        {!isClient && <Button onClick={handleOpen}>Editar ticket</Button>}
      </TopSection>
      <Header>
        <div className="description">{description}</div>
        <div className="labels">
          <Label option={priority} />
          <Label onClick={handleOpenMenu} option={status} />
        </div>
      </Header>
      <Body>
        {reporterName && (
          <React.Fragment>
            <h5>Creado por</h5>
            <div className="user">
              <Avatar name={reporterName} />
              <span className="name">{reporterName}</span>
            </div>
          </React.Fragment>
        )}
        {clientName && (
          <React.Fragment>
            <h5>Cliente</h5>
            <div className="user">
              <Avatar name={clientName} />
              <span className="name">{clientName}</span>
            </div>
          </React.Fragment>
        )}
        <React.Fragment>
          <h5>Técnico asignado</h5>
          {technicalName ? (
            <div className="user">
              <Avatar name={technicalName} />
              <span className="name">{technicalName}</span>
            </div>
          ) : (
            !isClient && <Button>Asignar ticket</Button>
          )}
        </React.Fragment>
        {evidence.length > 0 && (
          <React.Fragment>
            <h5>Evidencia</h5>
            <div className="evidence">
              {evidence.map(e => (
                <a href={e.url} key={e.id} target="_blank">
                  {getIsImage(e.fileName) ? (
                    <img src={e.url} alt={e.fileName} />
                  ) : (
                    <div className="data-type">{e.fileName}</div>
                  )}
                </a>
              ))}
            </div>
          </React.Fragment>
        )}
      </Body>
      {!isClient && (
        <React.Fragment>
          <CreateEditTicket
            open={editingOpen}
            onClose={handleClose}
            callback={handleTicketSaved}
            dispatch={dispatch}
            isClient={false}
            ticketToEdit={ticket}
          />
          <Menu
            id={id}
            open={open}
            anchorEl={anchorEl}
            onClose={handleCloseMenu}
            keepMounted
          >
            {statusesAvailable}
          </Menu>
        </React.Fragment>
      )}
    </Container>
  );
}

TicketDetail.propTypes = {
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(TicketDetail);
