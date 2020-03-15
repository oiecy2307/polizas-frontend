/**
 *
 * AssignTicketDialog
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { getFullName } from 'utils/helper';

import Avatar from 'components/Avatar';
import Dialog from 'components/Dialog';
import Radio from '@material-ui/core/Radio';

import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import { wsGetTechnicalsActivity } from 'services/users';

import {
  Note,
  TechnicalCheckbox,
  PersonalInfo,
  Label,
} from './styledComponents';

function AssignTicketDialog({ onClose, dispatch, open }) {
  const [technicals, setTechnicals] = useState([]);
  const [technicalSelected, setTechnicalSelected] = useState(null);
  useEffect(() => {
    fetchTechnicals();
  }, []);
  const fetchTechnicals = async () => {
    try {
      dispatch(aSetLoadingState(true));
      const response = await wsGetTechnicalsActivity();
      if (response.error) {
        dispatch(aOpenSnackbar('Error al consultar técnicos', 'error'));
        onClose(false);
        return;
      }
      setTechnicals(response.data || []);
    } catch (e) {
      dispatch(aOpenSnackbar('Error al consultar técnicos', 'error'));
      onClose(false);
    } finally {
      dispatch(aSetLoadingState(false));
    }
  };

  const handleAssignTicket = () => {};
  const handleClose = () => {
    onClose(false);
  };
  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Asignar ticket a técnico"
      withActions
      onNegativeAction={handleClose}
      positiveAction="Asignar ticket"
      onPositiveAction={handleAssignTicket}
      disabled={!technicalSelected}
    >
      <Note>Selecciona al técnico de soporte para asignar el ticket.</Note>
      {technicals.map(technical => (
        <TechnicalCheckbox
          key={technical.id}
          onClick={() => setTechnicalSelected(technical.id)}
        >
          <Avatar src={null} name={technical.name} />
          <PersonalInfo>
            <div className="name">{getFullName(technical)}</div>
            <div className="email">{technical.email}</div>
          </PersonalInfo>
          {technical.ticketCount > 0 ? (
            <Label background="#FBEAE5" color="#DE3618">{`${
              technical.ticketCount
            } ${technical.ticketCount === 1 ? 'ticket' : 'tickets'}`}</Label>
          ) : (
            <Label>Libre</Label>
          )}
          <Radio checked={technicalSelected === technical.id} />
        </TechnicalCheckbox>
      ))}
    </Dialog>
  );
}

AssignTicketDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  dispatch: PropTypes.func,
};

export default memo(AssignTicketDialog);
