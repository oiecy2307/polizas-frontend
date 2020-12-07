import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { trimObject } from 'utils/helper';
import { isURL, isIP } from 'validator';

import { wsUpdateInstanceSettings } from 'services/instances';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';

import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import { Paper } from 'utils/globalStyledComponents';
import Button from 'components/Button';
import Dialog from 'components/Dialog';
import Input from 'components/InputText';

import { ConfigSection, DomainItem } from '../styledComponents';

function ValidOrigins({ dispatch, instance }) {
  const [domains, setDomains] = useState([]);
  const [newDomainOpen, setNewDomainOpen] = useState(false);
  const [domainTxt, setDomainTxt] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [updatingDomain, setUpdatingDomain] = useState('');
  const [deleteDomain, setDeleteDomain] = useState(null);

  useEffect(() => {
    setDomains(get(instance, 'validOrigins.origins', false) || []);
  }, [get(instance, 'validOrigins.origins', false) || []]);

  const handleCreateDomain = async () => {
    try {
      const nDomains = [...domains];
      if (updatingDomain) {
        const index = nDomains.findIndex(i => i === updatingDomain);
        nDomains[index] = domainTxt;
      } else {
        nDomains.push(domainTxt);
      }
      setIsSubmitting(true);
      dispatch(aSetLoadingState(true));
      await wsUpdateInstanceSettings({
        type: 'valid-origins',
        data: trimObject(nDomains),
      });
      dispatch(aOpenSnackbar('Dominio guardado', 'success'));
      setDomains(nDomains);
    } catch (e) {
      const errorMessage =
        get(e, 'data.message', '') || 'Ocurrió un error, intente de nuevo';
      dispatch(aOpenSnackbar(errorMessage, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
      setIsSubmitting(false);
      setNewDomainOpen(false);
    }
  };

  const handleDeleteDomain = async () => {
    try {
      const nDomains = [...domains];

      const index = nDomains.findIndex(i => i === deleteDomain);
      nDomains.splice(index, 1);

      setIsSubmitting(true);
      dispatch(aSetLoadingState(true));
      await wsUpdateInstanceSettings({
        type: 'valid-origins',
        data: trimObject(nDomains),
      });
      dispatch(aOpenSnackbar('Dominio eliminado', 'success'));
      setDomains(nDomains);
    } catch (e) {
      const errorMessage =
        get(e, 'data.message', '') || 'Ocurrió un error, intente de nuevo';
      dispatch(aOpenSnackbar(errorMessage, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
      setIsSubmitting(false);
      setDeleteDomain(null);
    }
  };

  const handleCloseDomainDialog = () => {
    setUpdatingDomain('');
    setNewDomainOpen(false);
  };

  const handleCloseDeleteDomainDialog = () => {
    setDeleteDomain(null);
  };

  const disabled =
    !domainTxt ||
    (!isURL(domainTxt) && !isIP(domainTxt) && !domainTxt.includes('localhost'));

  return (
    <Paper>
      <ConfigSection>
        <h3>Dominios</h3>
        <div className="description">
          Ingresa los dominios habilitados para usar el Popup de tickets
        </div>
        <div>
          {domains.map(domain => (
            <DomainItem>
              <div className="name">{domain}</div>
              <div className="actions">
                <DeleteOutlinedIcon
                  className="action-icon"
                  onClick={() => setDeleteDomain(domain)}
                />
                <CreateOutlinedIcon
                  className="action-icon"
                  onClick={() => {
                    setNewDomainOpen(true);
                    setUpdatingDomain(domain);
                    setDomainTxt(domain);
                  }}
                />
              </div>
            </DomainItem>
          ))}
          <Button
            variant="contained"
            fullWidth
            color="primary"
            onClick={() => setNewDomainOpen(true)}
          >
            Agregar dominio
          </Button>
        </div>
      </ConfigSection>
      <Dialog
        open={newDomainOpen}
        onClose={handleCloseDomainDialog}
        title={updatingDomain ? 'Editar dominio' : 'Nuevo dominio'}
        withActions
        negativeAction="Cancelar"
        onNegativeAction={handleCloseDomainDialog}
        positiveAction={updatingDomain ? 'Guardar' : 'Crear'}
        onPositiveAction={handleCreateDomain}
        disabled={disabled || isSubmitting}
      >
        <div style={{ width: 360, maxWidth: '100%' }}>
          <Input
            value={domainTxt}
            onChange={e => setDomainTxt(e.target.value)}
            label="Dominio (URL)"
          />
        </div>
      </Dialog>
      <Dialog
        open={Boolean(deleteDomain)}
        onClose={handleCloseDeleteDomainDialog}
        title="¿Eliminar dominio?"
        withActions
        negativeAction="Cancelar"
        onNegativeAction={handleCloseDeleteDomainDialog}
        positiveAction="Eliminar"
        onPositiveAction={handleDeleteDomain}
        disabled={isSubmitting}
      >
        <div style={{ minWidth: 300 }}>
          Se eliminará el dominio <b>{deleteDomain}</b>
        </div>
      </Dialog>
    </Paper>
  );
}

ValidOrigins.propTypes = {
  dispatch: PropTypes.func,
  instance: PropTypes.object,
};

export default ValidOrigins;
