/**
 *
 * AssignTicketDialog
 *
 */

import React, { memo, useEffect, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { getFullName } from 'utils/helper';
import { get } from 'lodash';
import { GlobalValuesContext } from 'contexts/global-values';

import Avatar from 'components/Avatar';
import Dialog from 'components/Dialog';
import LabelComponent from 'components/Label';
import Radio from '@material-ui/core/Radio';

import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import { wsGetTechnicalsActivity } from 'services/users';
import { wsAssignTicket } from 'services/tickets';

import {
  Note,
  TechnicalCheckbox,
  PersonalInfo,
  Label,
  PriorityOptions,
} from './styledComponents';

function AssignTicketDialog({ onClose, dispatch, open, id, defaultPriority }) {
  const [technicals, setTechnicals] = useState([]);
  const [technicalSelected, setTechnicalSelected] = useState(null);
  const [prioritySelected, setPrioritySelected] = useState(defaultPriority);
  const [buttonClicked, setButtonClicked] = useState(false);
  const { isResponsiveXs } = useContext(GlobalValuesContext);

  useEffect(() => {
    if (open) {
      fetchTechnicals();
      setPrioritySelected(defaultPriority);
    } else {
      setPrioritySelected(null);
    }
  }, [open]);

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

  const handleAssignTicket = async () => {
    if (!technicalSelected) return;
    try {
      setButtonClicked(true);
      dispatch(aSetLoadingState(true));
      const body = {
        technicalId: technicalSelected,
        priority: prioritySelected,
      };
      const response = await wsAssignTicket(id, body);
      if (response.error) {
        dispatch(
          aOpenSnackbar('Ocurrió un error al asignar el ticket', 'error'),
        );
      } else {
        dispatch(aOpenSnackbar('Ticket asignado', 'success'));
        onClose(true);
      }
    } catch (e) {
      dispatch(aOpenSnackbar('Ocurrió un error al asignar el ticket', 'error'));
      onClose(false);
    } finally {
      dispatch(aSetLoadingState(false));
      setTechnicalSelected(null);
      setButtonClicked(false);
    }
  };
  const handleClose = () => {
    onClose(false);
    setTechnicalSelected(null);
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
      disabled={!technicalSelected || !prioritySelected || buttonClicked}
    >
      <Note>Selecciona al técnico de soporte para asignar el ticket.</Note>
      {technicals.map(technical => (
        <TechnicalCheckbox
          key={technical.id}
          onClick={() => setTechnicalSelected(technical.id)}
        >
          {!isResponsiveXs && (
            <Avatar src={technical.image} name={technical.name} />
          )}
          <PersonalInfo>
            <div className="name text-ellipsis">{getFullName(technical)}</div>
            <div className="email text-ellipsis">{technical.email}</div>
          </PersonalInfo>
          {get(technical, 'technicalTickets', []).length > 0 ? (
            <Label background="#FBEAE5" color="#DE3618">{`${
              get(technical, 'technicalTickets', []).length
            } ${
              get(technical, 'technicalTickets', []).length === 1
                ? 'ticket'
                : 'tickets'
            }`}</Label>
          ) : (
            <Label>Libre</Label>
          )}
          <Radio color="primary" checked={technicalSelected === technical.id} />
        </TechnicalCheckbox>
      ))}
      <Note style={{ marginTop: 32 }}>
        Selecciona el nivel de prioridad del ticket
      </Note>
      <PriorityOptions>
        <LabelComponent
          option={prioritySelected === 'low' ? 'low' : 'unselected'}
          defaultText="Nivel bajo"
          onClick={() => setPrioritySelected('low')}
        />
        <LabelComponent
          option={prioritySelected === 'medium' ? 'medium' : 'unselected'}
          defaultText="Nivel medio"
          onClick={() => setPrioritySelected('medium')}
        />
        <LabelComponent
          option={prioritySelected === 'high' ? 'high' : 'unselected'}
          defaultText="Nivel alto"
          onClick={() => setPrioritySelected('high')}
        />
      </PriorityOptions>
    </Dialog>
  );
}

AssignTicketDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  dispatch: PropTypes.func,
  id: PropTypes.string,
  defaultPriority: PropTypes.string,
};

AssignTicketDialog.defaultProps = {
  defaultPriority: null,
};

export default memo(AssignTicketDialog);
