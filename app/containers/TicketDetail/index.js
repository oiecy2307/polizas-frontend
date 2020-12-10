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
import { Link } from 'react-router-dom';
import { get, times } from 'lodash';
import moment from 'moment/min/moment-with-locales';
import { ImmortalDB } from 'immortal-db';

import {
  getFullName,
  getIsImage,
  minutesToHours,
  toMoneyFormat,
  formatToFolio,
} from 'utils/helper';
import { LoggedUser } from 'contexts/logged-user';

import {
  wsGetTicketById,
  wsUpdateStatusTicket,
  wsGetTicketComments,
  wsCreateComment,
  wsDeleteComment,
  wsUndoTicketCancelled,
} from 'services/tickets';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import CreateEditTicket from 'components/CreateEditTicket';
import AssignTicketDialog from 'components/AssignTicketDialog';
import Fab from 'components/Fab';
import CloseTicketDialog from 'components/CloseTicketDialog';
import PayTicketDialog from 'components/PayTicketDialog';
import Input from 'components/InputText';
import CommentItem from 'components/CommentItem';
import EmptyState from 'components/EmptyState';
import Dialog from 'components/Dialog';

import Button from 'components/Button';
import Label from 'components/Label';
import Avatar from 'components/Avatar';
import TimeTracker from 'components/TimeTracker';
import Skeleton from '@material-ui/lab/Skeleton';
import Menu from '@material-ui/core/Menu';
import MenuItem from '@material-ui/core/MenuItem';
import EditIcon from '@material-ui/icons/Edit';
import SendIcon from '@material-ui/icons/Send';
import IconButton from '@material-ui/core/IconButton';

import { Divider, FloatRight } from 'utils/globalStyledComponents';
import {
  Container,
  TopSection,
  Header,
  Body,
  Div,
  Canceled,
  MainContainer,
  LoaderContainer,
} from './styledComponents';

moment.locale('es');

export function TicketDetail({ dispatch, match, history }) {
  const currentUser = useContext(LoggedUser);
  const [ticket, setTicket] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [editingOpen, setEditingOpen] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [isClient] = useState(get(currentUser, 'role', '') === 'client');
  const [isCloseTicketDialogOpen, setIsCloseTicketDialogOpen] = useState(false);
  const [isPayTicketDialogOpen, setIsPayTicketDialogOpen] = useState(false);
  const [isAssignTicketDialogOpen, setIsAssignTicketDialogOpen] = useState(
    false,
  );
  const [comments, setComments] = useState([]);
  const [comment, setComment] = useState('');
  const [withOutSession, setWithOutSession] = useState(false);
  const [undoCancelledTicketOpen, setUndoCancelledTicketOpen] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    validateIsLogged();
  }, []);

  useEffect(() => {
    fetchTicket();
    fetchComments();
  }, [get(match, 'params.id', null)]);

  const validateIsLogged = async () => {
    const token = await ImmortalDB.get('token');
    if (token && !get(match, 'path', '').includes('/tickets/')) {
      history.push(`/tickets/${get(match, 'params.id', null)}`);
    } else {
      setWithOutSession(true);
    }
  };

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

  const fetchComments = async () => {
    try {
      const id = get(match, 'params.id', null);
      const response = await wsGetTicketComments(id);
      setComments(get(response, 'data', []) || []);
    } catch (e) {
      // ERROR HANDLER
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
    if (isClient) return;
    if (isCancelled) {
      setUndoCancelledTicketOpen(true);
      return;
    }
    setAnchorEl(event.currentTarget);
  };

  const handleCloseMenu = () => {
    setAnchorEl(null);
  };

  const handleChangeStatus = async status => {
    try {
      handleCloseMenu();
      dispatch(aSetLoadingState(true));
      const response = await wsUpdateStatusTicket(ticket.id, { status });
      if (!response || response.error) {
        dispatch(aOpenSnackbar('No se pudo actualizar estatus', 'error'));
      } else {
        dispatch(aOpenSnackbar('Estatus cambiado con éxito', 'success'));
        fetchTicket();
      }
    } catch (e) {
      dispatch(aOpenSnackbar('No se pudo actualizar estatus', 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  };

  const handleSaveComment = async () => {
    try {
      if (!comment.trim()) return;
      const id = get(match, 'params.id', null);
      dispatch(aSetLoadingState(true));
      const body = {
        text: comment.trim(),
      };
      if (anonymousClient && !get(currentUser, 'id', '')) {
        body.unregisteredName = anonymousName;
      }
      const response = await wsCreateComment(id, body);
      if (response.error) {
        dispatch(aOpenSnackbar('No fue posible comentar', 'error'));
      } else {
        dispatch(aOpenSnackbar('Comentario guardado', 'success'));
        setComment('');
        fetchComments();
      }
    } catch (e) {
      dispatch(aOpenSnackbar('No fue posible comentar', 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  };

  const handleDeleteComment = async commentId => {
    try {
      dispatch(aSetLoadingState(true));
      const response = await wsDeleteComment(commentId);
      if (response.error) {
        dispatch(aOpenSnackbar('No fue posible eliminar comentario', 'error'));
      } else {
        dispatch(aOpenSnackbar('Comentario eliminado', 'success'));
        setComment('');
        fetchComments();
      }
    } catch (e) {
      dispatch(aOpenSnackbar('No fue posible eliminar comentario', 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  };

  const handleUndoCancel = async () => {
    try {
      setIsSubmitting(true);
      const id = get(match, 'params.id', null);
      dispatch(aSetLoadingState(true));
      await wsUndoTicketCancelled(id);
      fetchTicket();
      setUndoCancelledTicketOpen(false);
    } catch (e) {
      const errorMessage =
        get(e, 'data.message', '') || 'Ocurrió un error, intente de nuevo';
      dispatch(aOpenSnackbar(errorMessage, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
      setIsSubmitting(false);
    }
  };

  const handleCloseUndoCancel = () => {
    setUndoCancelledTicketOpen(false);
  };

  if (notFound) {
    return (
      <div>
        <Helmet>
          <title>Detalle ticket</title>
        </Helmet>
        <EmptyState message="No se encontró el ticket" />
      </div>
    );
  }

  if (initialLoading) {
    return (
      <LoaderContainer>
        <Helmet>
          <title>Detalle ticket</title>
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
      </LoaderContainer>
    );
  }

  const shortName = get(ticket, 'shortName', '');
  const reportedDate = get(ticket, 'reportedDate', '');
  const description = get(ticket, 'description', '');
  const priority = get(ticket, 'priority', '');
  const status = get(ticket, 'paid', false)
    ? 'paid'
    : get(ticket, 'status', 'new');
  const technicalName = getFullName(get(ticket, 'technical', {}));
  const technicalImg = get(ticket, 'technical.image', {});
  const reporterName = getFullName(get(ticket, 'reporter', {}));
  const reporterImg = get(ticket, 'reporter.image', {});
  const reporterId = get(ticket, 'reporter.id', '');
  const clientName = getFullName(get(ticket, 'client', {}));
  const clientId = get(ticket, 'client.id', '');
  const technicalId = get(ticket, 'technical.id', '');
  const isFakeUser = get(ticket, 'client.isFakeUser', {});
  const companyName = get(ticket, 'client.company.name', {});
  const clientImg = get(ticket, 'client.image', {});
  const evidence = get(ticket, 'evidence', []);
  const isCancelled = get(ticket, 'status', '') === 'cancelled';
  const finishedDate = get(ticket, 'finishedDate', '');
  const timeNeeded = get(ticket, 'timeNeeded', '');
  const cost = get(ticket, 'cost', '');
  const paid = get(ticket, 'paid', null);
  const totalPaid = get(ticket, 'totalPaid', '');
  const paidDate = get(ticket, 'paidDate', '');
  const invoice = get(ticket, 'invoice', '');
  const showPaidInfo = paid !== null;
  const formalName = get(ticket, 'client.company.formalName', '');
  const folio = get(ticket, 'number', '');
  const clientData = get(ticket, 'clientData', '') || '';
  const anonymousClient = clientData ? JSON.parse(clientData) : null;
  const anonymousName = get(anonymousClient, 'name', '');
  const anonymousEmail = get(anonymousClient, 'email', '');
  const anonymousPhone = get(anonymousClient, 'phone', '');

  const buttonText = (() => {
    switch (status) {
      case 'new':
        return 'Asignar ticket';
      case 'assigned':
        return 'Cerrar ticket';
      case 'paid':
      case 'closed':
        return 'Modificar pago';
      default:
        return 'Asignar ticket';
    }
  })();

  const handleOpenAssignDialog = () => {
    if (isClient || isCancelled) return;
    setIsAssignTicketDialogOpen(true);
  };

  const open = Boolean(anchorEl);
  const idPopover = open ? 'popover-statuses' : undefined;

  const handleButtonClicked = () => {
    if (isClient || isCancelled) return;
    switch (ticket.status) {
      case 'assigned': {
        setIsCloseTicketDialogOpen(true);
        break;
      }
      case 'new': {
        setIsAssignTicketDialogOpen(true);
        break;
      }
      case 'paid':
      case 'closed': {
        setIsPayTicketDialogOpen(true);
        break;
      }
      default:
        break;
    }
  };

  const handleCloseModals = success => {
    setIsCloseTicketDialogOpen(false);
    setIsAssignTicketDialogOpen(false);
    setIsPayTicketDialogOpen(false);
    if (success) {
      fetchTicket();
    }
  };

  const statusesAvailable = (() => {
    const { status: ticketStatus } = ticket;

    if (ticketStatus === 'closed') {
      return [
        <MenuItem onClick={() => handleChangeStatus('assigned')} key="assigned">
          Asignado
        </MenuItem>,
        <MenuItem onClick={() => handleChangeStatus('new')} key="new">
          Por asignar
        </MenuItem>,
        <MenuItem
          onClick={() => handleChangeStatus('cancelled')}
          key="cancelled"
        >
          Cancelado
        </MenuItem>,
      ];
    }

    if (ticketStatus === 'assigned') {
      return [
        <MenuItem onClick={() => handleChangeStatus('new')} key="new">
          Por asignar
        </MenuItem>,
        <MenuItem
          onClick={() => handleChangeStatus('cancelled')}
          key="cancelled"
        >
          Cancelado
        </MenuItem>,
      ];
    }

    if (ticketStatus === 'new') {
      return [
        <MenuItem
          onClick={() => handleChangeStatus('cancelled')}
          key="cancelled"
        >
          Cancelado
        </MenuItem>,
      ];
    }

    return [];
  })();

  const handleTicketTimeChanged = time => {
    setTicket(_ticket => ({
      ..._ticket,
      time,
    }));
  };

  const showClosedInfo =
    ticket.status !== 'new' && ticket.status !== 'assigned';

  const showButton =
    !isClient &&
    !isCancelled &&
    !(currentUser.role === 'technical' && ticket.status === 'closed');

  return (
    <MainContainer>
      <Helmet>
        <title>{shortName || 'Detalle ticket'}</title>
      </Helmet>
      {isCancelled && <Canceled>Ticket cancelado</Canceled>}
      <Container>
        <TopSection>
          <div>
            <h4>{shortName}</h4>
            <div style={{ width: 'fit-content' }}>
              {`Reportado el ${moment(reportedDate).format('LL')}`}
            </div>
          </div>
          {showButton && (
            <Button onClick={handleButtonClicked}>{buttonText}</Button>
          )}
        </TopSection>
        <Header>
          <div className="description">{description}</div>
          <div className="labels">
            {priority && <Label option={priority} />}
            <Label onClick={handleOpenMenu} option={status} />
          </div>
        </Header>
        <Body>
          {Boolean(folio) && (
            <React.Fragment>
              <h5>Folio</h5>
              <div>#{formatToFolio(folio)}</div>
            </React.Fragment>
          )}
          {reporterName && (
            <React.Fragment>
              <h5>Creado por</h5>
              <Link to={`/perfil/${reporterId}`}>
                <div className="user">
                  <Avatar name={reporterName} src={reporterImg} />
                  <span className="name">{reporterName}</span>
                </div>
              </Link>
            </React.Fragment>
          )}
          {!reporterName && anonymousClient && (
            <React.Fragment>
              <h5>Cliente (vía suppdesk)</h5>
              <div className="user">
                <Avatar name={anonymousName} src={null} />
                <div>
                  <div className="name">{anonymousName}</div>
                  {anonymousEmail && !withOutSession && (
                    <div className="formal-name">{anonymousEmail}</div>
                  )}
                  {anonymousPhone && !withOutSession && (
                    <div className="formal-name">{anonymousPhone}</div>
                  )}
                </div>
              </div>
            </React.Fragment>
          )}
          {clientName && (
            <React.Fragment>
              <h5>Cliente</h5>
              <Link to={`/perfil/${clientId}`}>
                <div className="user">
                  <Avatar name={clientName} src={clientImg} />
                  <div>
                    <div className="name">{`${clientName} ${
                      isFakeUser ? '' : `(${companyName})`
                    }`}</div>
                    {formalName && (
                      <div className="formal-name">{formalName}</div>
                    )}
                  </div>
                </div>
              </Link>
            </React.Fragment>
          )}
          {!isClient && technicalName && (
            <React.Fragment>
              <h5>Técnico asignado</h5>
              <Div
                className="user"
                clickable={!isClient && !isCancelled}
                onClick={handleOpenAssignDialog}
              >
                <Avatar name={technicalName} src={technicalImg} />
                <span className="name">{technicalName}</span>
              </Div>
            </React.Fragment>
          )}
          {isClient && technicalName && (
            <React.Fragment>
              <h5>Técnico asignado</h5>
              <Link to={`/perfil/${technicalId}`}>
                <Div style={{ cursor: 'pointer' }} className="user">
                  <Avatar name={technicalName} src={technicalImg} />
                  <span className="name">{technicalName}</span>
                </Div>
              </Link>
            </React.Fragment>
          )}
          {!isClient && get(ticket, 'status', '') === 'assigned' && (
            <React.Fragment>
              <h5>Tiempo trabajado</h5>
              <div>
                <TimeTracker
                  ticket={ticket}
                  dispatch={dispatch}
                  onTimeChanged={handleTicketTimeChanged}
                />
              </div>
            </React.Fragment>
          )}
          {finishedDate && (
            <React.Fragment>
              <h5>Fecha de terminación</h5>
              <div>{moment(finishedDate).format('LL')}</div>
            </React.Fragment>
          )}
          {showClosedInfo && timeNeeded !== null && (
            <React.Fragment>
              <h5>Tiempo requerido</h5>
              <div>{minutesToHours(timeNeeded)} horas</div>
            </React.Fragment>
          )}
          {showClosedInfo && cost !== null && (
            <React.Fragment>
              <h5>Costo al terminar</h5>
              <div>{toMoneyFormat(cost)}</div>
            </React.Fragment>
          )}
          {invoice && (
            <React.Fragment>
              <h5>Número de factura</h5>
              <div>{invoice}</div>
            </React.Fragment>
          )}
          {showPaidInfo && showClosedInfo && (
            <React.Fragment>
              <h5>Está pagado</h5>
              <div>{paid ? 'Sí' : 'No'}</div>
              {paid && totalPaid && (
                <React.Fragment>
                  <h5>Total pagado</h5>
                  <div>{toMoneyFormat(totalPaid)}</div>
                </React.Fragment>
              )}
              {paid && paidDate && (
                <React.Fragment>
                  <h5>Fecha de pago</h5>
                  <div>{moment(paidDate).format('LL')}</div>
                </React.Fragment>
              )}
            </React.Fragment>
          )}
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
        {!isClient && !isCancelled && (
          <React.Fragment>
            {editingOpen && (
              <CreateEditTicket
                open={editingOpen}
                onClose={handleClose}
                callback={handleTicketSaved}
                dispatch={dispatch}
                isClient={false}
                ticketToEdit={ticket}
              />
            )}
            <Menu
              id={idPopover}
              open={open}
              anchorEl={anchorEl}
              onClose={handleCloseMenu}
              keepMounted
            >
              {statusesAvailable}
            </Menu>
            <Fab onClick={handleOpen} icon={<EditIcon />} />
            <CloseTicketDialog
              open={isCloseTicketDialogOpen}
              onClose={handleCloseModals}
              dispatch={dispatch}
              id={get(ticket, 'id', '').toString()}
              time={get(ticket, 'time', 0)}
            />
            <AssignTicketDialog
              open={isAssignTicketDialogOpen}
              onClose={handleCloseModals}
              dispatch={dispatch}
              id={get(ticket, 'id', '').toString()}
              defaultPriority={get(ticket, 'priority', null)}
            />
            {isPayTicketDialogOpen && (
              <PayTicketDialog
                open={isPayTicketDialogOpen}
                onClose={handleCloseModals}
                dispatch={dispatch}
                id={get(ticket, 'id', '').toString()}
                cost={get(ticket, 'cost', '').toString()}
                defaultTicket={ticket}
              />
            )}
          </React.Fragment>
        )}
      </Container>
      <Divider size="24" />
      <Container>
        <Body>
          <h4>Comentarios</h4>
          <Divider size="24" />
          {comments.map(c => (
            <CommentItem
              key={c.id}
              comment={c}
              onDelete={handleDeleteComment}
            />
          ))}
          <Divider size="24" />
          <div className="comment-input">
            <Input
              type="text"
              multiline
              rows={4}
              label="Escribe un comentario"
              value={comment}
              onChange={e => setComment(e.target.value)}
              maxLength="1000"
            />
            <IconButton onClick={handleSaveComment}>
              <SendIcon />
            </IconButton>
          </div>
          {false && (
            <FloatRight>
              <Button
                variant="text"
                onClick={handleSaveComment}
                disabled={!comment.trim()}
              >
                Comentar
              </Button>
            </FloatRight>
          )}
        </Body>
      </Container>
      <Dialog
        open={undoCancelledTicketOpen}
        onClose={handleCloseUndoCancel}
        title="Deshacer cancelación"
        withActions
        negativeAction="Cerrar"
        onNegativeAction={handleCloseUndoCancel}
        positiveAction="Deshacer cancelación"
        onPositiveAction={handleUndoCancel}
        disabled={isSubmitting}
      >
        <div style={{ minWidth: 300 }}>
          Se volverá a activar el ticket <b>{` "${shortName}"`}</b>
        </div>
      </Dialog>
    </MainContainer>
  );
}

TicketDetail.propTypes = {
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.object,
  history: PropTypes.object,
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
