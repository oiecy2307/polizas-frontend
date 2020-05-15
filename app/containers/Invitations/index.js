/**
 *
 * Invitations
 *
 */

import React, { memo, useState, useEffect, useRef } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import { get } from 'lodash';
import moment from 'moment/min/moment-with-locales';
import config from 'config';

import {
  wsGetInvitations,
  wsGetInvitationToken,
  wsCancelInvitation,
} from 'services/users';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import Fab from 'components/Fab';
import NewInvitationDialog from 'components/NewInvitationDialog';
import Dialog from 'components/Dialog';

import { TabButton } from 'utils/globalStyledComponents';
import Table from 'components/Table';

import { Input } from './styledComponents';

const columns = [
  {
    key: 'email',
    label: 'Correo',
  },
  {
    key: 'expiresOn',
    label: 'Expira',
  },
  {
    key: 'createdAt',
    label: 'Creada',
  },
];

export function Invitations({ dispatch }) {
  const [optionSelected, setOptionSelected] = useState('all');
  const [invitations, setInvitations] = useState([]);
  const [newInvitationOpen, setNewInvitationOpen] = useState(false);
  const [urlInvitation, setUrlInvitation] = useState('');
  const [defaultEmail, setDefaultEmail] = useState('');
  const urlRef = useRef(null);

  useEffect(() => {
    fetchInvitations();
  }, []);

  const fetchInvitations = async () => {
    try {
      dispatch(aSetLoadingState(true));
      const response = await wsGetInvitations();
      if (response.error) {
        dispatch(aOpenSnackbar('Error al obtener invitaciones', 'error'));
      } else {
        setInvitations(get(response, 'data.invitations', []) || []);
      }
    } catch (e) {
      dispatch(aOpenSnackbar('Error al obtener invitaciones', 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  };

  const handleGetInvitationLink = async invitation => {
    try {
      dispatch(aSetLoadingState(true));
      const response = await wsGetInvitationToken(invitation.id);
      if (response.error) {
        dispatch(aOpenSnackbar('No se pudo obtener link', 'error'));
      } else {
        const lToken = get(response, 'data.token.token', '');
        setUrlInvitation(`${config.FRONTEND_URL}/registro/${lToken}`);
      }
    } catch (e) {
      const error = get(e, 'data.message', '') || 'No se pudo obtener link';
      dispatch(aOpenSnackbar(error, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  };

  const handleSendInvitation = invitation => {
    setDefaultEmail(invitation.email);
    setNewInvitationOpen(true);
  };

  const handleCancelInvitation = async invitation => {
    try {
      dispatch(aSetLoadingState(true));
      const response = await wsCancelInvitation(invitation.id);
      if (response.error) {
        dispatch(
          aOpenSnackbar('Ocurrió un error al cancelar invitación', 'error'),
        );
      } else {
        dispatch(aOpenSnackbar('Invitación cancelada', 'success'));
        fetchInvitations();
      }
    } catch (e) {
      const error =
        get(e, 'data.message', '') || 'Ocurrió un error al cancelar invitación';
      dispatch(aOpenSnackbar(error, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  };

  const handleNewInvitationSent = () => {
    fetchInvitations();
    setNewInvitationOpen(false);
    setDefaultEmail('');
  };

  const handleCloseNewInvitation = () => {
    setNewInvitationOpen(false);
    setDefaultEmail('');
  };

  const handleCopyUrlToClipboard = () => {
    const div = urlRef.current;
    div.select();
    document.execCommand('copy');
  };

  const optionsMenu = [
    {
      option: 'Link invitación',
      action: handleGetInvitationLink,
    },
    {
      option: 'Reenviar invitación',
      action: handleSendInvitation,
    },
    {
      option: 'Cancelar invitación',
      action: handleCancelInvitation,
    },
  ];

  const items = invitations
    .filter(i => {
      if (optionSelected === 'all') return true;
      if (optionSelected === 'actives' && !i.expired) return true;
      if (optionSelected === 'expired' && i.expired) return true;
      return false;
    })
    .map(i => ({
      id: i.id,
      email: i.email,
      expiresOn: i.expired ? 'Expirado' : moment(i.expiresOn).fromNow(),
      createdAt: moment(i.updatedAt).format('LLL'),
    }));

  const urlDialogOpen = Boolean(urlInvitation);

  return (
    <div>
      <Helmet>
        <title>Invitaciones</title>
      </Helmet>
      <div>
        <TabButton
          selected={optionSelected === 'all'}
          onClick={() => setOptionSelected('all')}
        >
          Todas
        </TabButton>
        <TabButton
          selected={optionSelected === 'actives'}
          onClick={() => setOptionSelected('actives')}
        >
          Activas
        </TabButton>
        <TabButton
          selected={optionSelected === 'expired'}
          onClick={() => setOptionSelected('expired')}
        >
          Expiradas
        </TabButton>
      </div>
      <Table
        columns={columns}
        items={items}
        withMenu
        optionsMenu={optionsMenu}
        isClickable={false}
        showPagination={false}
      />
      <NewInvitationDialog
        open={newInvitationOpen}
        onClose={handleCloseNewInvitation}
        callback={handleNewInvitationSent}
        dispatch={dispatch}
        defaultEmail={defaultEmail}
      />
      <Fab onClick={() => setNewInvitationOpen(true)} />
      <Dialog
        open={urlDialogOpen}
        onClose={() => setUrlInvitation('')}
        title="Link invitación"
        withActions
        positiveAction="Copiar en portapapeles"
        negativeAction="Cerrar"
        onNegativeAction={() => setUrlInvitation('')}
        onPositiveAction={handleCopyUrlToClipboard}
      >
        <Input rows="8" ref={urlRef} value={urlInvitation} readOnly />
      </Dialog>
    </div>
  );
}

Invitations.propTypes = {
  dispatch: PropTypes.func.isRequired,
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
)(Invitations);
