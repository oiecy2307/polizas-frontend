/**
 *
 * NewInvitationDialog
 *
 */

import React, { memo, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { isEmail } from 'validator';
import { get } from 'lodash';

import { LoggedUser } from 'contexts/logged-user';
import { wsSendInvitation } from 'services/users';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';

import Dialog from 'components/Dialog';
import Input from 'components/InputText';
import Select from 'components/Select';

const options = [
  {
    value: 'admin',
    label: 'Administrador',
  },
  {
    value: 'technical',
    label: 'Soporte',
  },
  {
    value: 'salesman',
    label: 'Ventas',
  },
];

function NewInvitationDialog({
  open,
  onClose,
  callback,
  dispatch,
  defaultEmail,
}) {
  const [email, setEmail] = useState('');
  const [emailTouched, setEmailTouched] = useState(false);
  const [role, setRole] = useState(null);
  const [busy, setBusy] = useState(false);

  const currentUser = useContext(LoggedUser);
  const isClientAdmin =
    currentUser.role === 'client' && currentUser.isCompanyAdmin;

  useEffect(() => {
    setEmail(defaultEmail);
  }, [defaultEmail]);

  const handleSendInvitation = async () => {
    try {
      dispatch(aSetLoadingState(true));
      setBusy(true);
      const response = await wsSendInvitation({
        email,
        role: isClientAdmin ? 'client' : get(role, 'value', 'technical'),
        companyId: isClientAdmin ? currentUser.companyId : null,
      });
      if (response.error) {
        dispatch(
          aOpenSnackbar('Ocurrió un error al enviar invitación', 'error'),
        );
      } else {
        dispatch(aOpenSnackbar('Invitación enviada', 'success'));
        callback();
        setEmail('');
        setRole(null);
        setEmailTouched(false);
      }
    } catch (e) {
      const error =
        get(e, 'data.message', '') || 'Ocurrió un error al enviar invitación';
      dispatch(aOpenSnackbar(error, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
      setBusy(false);
    }
  };
  const handleClose = () => {
    setEmail('');
    setRole(null);
    setEmailTouched(false);
    onClose();
  };
  const showError = !!email && !isEmail(email) && emailTouched;
  const disabled = !isEmail(email) || (!role && !isClientAdmin) || busy;

  return (
    <Dialog
      open={open}
      onClose={handleClose}
      title="Enviar invitación"
      withActions
      positiveAction="Enviar"
      onNegativeAction={handleClose}
      onPositiveAction={handleSendInvitation}
      disabled={disabled}
    >
      <Input
        label="Correo"
        value={email}
        onChange={e => setEmail(e.target.value)}
        helperText={showError ? 'Ingrese un correo válido' : ''}
        error={showError}
        style={{ width: '360px', maxWidth: '100%' }}
        onBlur={() => setEmailTouched(true)}
        disabled={Boolean(defaultEmail)}
      />
      {!isClientAdmin && (
        <Select
          value={role}
          onChange={value => setRole(value)}
          options={options}
          placeholder="Rol"
          error=""
          menuPlacement="bottom"
          menuPosition="fixed"
        />
      )}
    </Dialog>
  );
}

NewInvitationDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  callback: PropTypes.func,
  dispatch: PropTypes.func,
  defaultEmail: PropTypes.string,
};

export default memo(NewInvitationDialog);
