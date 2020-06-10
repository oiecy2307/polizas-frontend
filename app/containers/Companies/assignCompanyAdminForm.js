/**
 *
 * AssignCompanyAdminForm
 *
 */

import React, { memo, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { GlobalValuesContext } from 'contexts/global-values';
import { get } from 'lodash';
import { isEmail } from 'validator';

import { wsAssignOrSendInvitation } from 'services/companies';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import { trimObject } from 'utils/helper';

import Dialog from 'components/Dialog';
import Input from 'components/InputText';
import getMessages from './messages';

function AssignCompanyAdminForm({
  open,
  onClose,
  callback,
  dispatch,
  company,
}) {
  const { language } = useContext(GlobalValuesContext);
  const [messages] = useState(getMessages(language));
  const [email, setEmail] = useState('');

  async function handleAssignCompanyAdmin() {
    try {
      dispatch(aSetLoadingState(true));
      const body = {
        companyId: company.id,
        email,
      };

      const response = await wsAssignOrSendInvitation(trimObject(body));
      const alreadyAssigned = get(response, 'data.userAlreadyExists', false);
      if (alreadyAssigned) {
        dispatch(aOpenSnackbar('Se ha asignado al responsable', 'success'));
      } else {
        dispatch(
          aOpenSnackbar('Se envió una invitación por correo', 'success'),
        );
      }
      callback();
      onClose();
    } catch (e) {
      const errorMessage = get(
        e,
        'data.message',
        'Error al asignar responsable',
      );
      dispatch(aOpenSnackbar(errorMessage, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  }

  const dialogTitle = 'Asignar responsable de empresa';
  const showError = email && !isEmail(email);

  return (
    <Dialog
      onClose={() => {
        onClose();
        setEmail('');
      }}
      title={dialogTitle}
      open={open}
      withActions
      negativeAction={messages.actions.cancel}
      positiveAction={messages.actions.save}
      onNegativeAction={() => {
        onClose();
        setEmail('');
      }}
      onPositiveAction={handleAssignCompanyAdmin}
      disabled={!isEmail(email)}
    >
      <div style={{ width: 560, maxWidth: '100%' }}>
        <Input
          type="email"
          label="Correo del responsable"
          helperText={showError && 'Ingrese un correo válido'}
          error={showError}
          onChange={e => setEmail(e.target.value)}
        />
      </div>
    </Dialog>
  );
}

AssignCompanyAdminForm.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  callback: PropTypes.func,
  dispatch: PropTypes.func,
  company: PropTypes.object,
};

export default memo(AssignCompanyAdminForm);
