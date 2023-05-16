/**
 *
 * CreateEditPoliza
 *
 */

import React, { memo, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GlobalValuesContext } from 'contexts/global-values';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { get } from 'lodash';

import { trimObject } from 'utils/helper';
// eslint-disable-next-line import/named
import { wsGetUsers } from 'services/users';
import { wsGetInventario } from 'services/inventario';
import { wsUpdatePoliza, wsCreatePoliza } from 'services/polizas';
import { wsUpdateProfileInfo } from 'services/profile';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';

import Dialog from 'components/Dialog';
import Form from './form';

import getMessages from './messages';

function CreateEditPoliza({
  open,
  onClose,
  callback,
  dispatch,
  polizaToEdit,
  fromProfile,
}) {
  const { language } = useContext(GlobalValuesContext);
  const [messages] = useState(getMessages(language));
  const [inventory, setInventory] = useState([]);
  const [users, setUsers] = useState([]);

  console.log('polizaToEdit', polizaToEdit);
  const isEditing = Boolean(polizaToEdit);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      dispatch(aSetLoadingState(true));
      const responseInventory = await wsGetInventario();
      setInventory(
        get(responseInventory, 'data', []).map(t => ({
          ...t,
          value: t.id,
          label: `${t.nombre} ${t.sku}`,
        })),
      );
      const responseUsers = await wsGetUsers();
      setUsers(
        get(responseUsers, 'data', []).map(t => ({
          ...t,
          value: t.id,
          label: `${t.nombre} ${t.apellidoPaterno} ${t.apellidoMaterno}`,
        })),
      );
    } catch (e) {
      dispatch(aOpenSnackbar('Error al obtener datos', 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  }

  async function handleCreatePoliza(values, resetValues) {
    try {
      const body = values;
      dispatch(aSetLoadingState(true));
      let response = null;
      if (fromProfile) {
        response = await wsUpdateProfileInfo(trimObject(body));
      } else if (isEditing) {
        response = await wsUpdatePoliza(polizaToEdit.id, trimObject(body));
      } else {
        response = await wsCreatePoliza(trimObject(body));
      }
      if (response.error) {
        dispatch(aOpenSnackbar('Error al guardar la poliza', 'error'));
      } else {
        dispatch(aOpenSnackbar('Poliza guardada', 'success'));
        callback();
        onClose();
        resetValues();
      }
    } catch (e) {
      dispatch(aOpenSnackbar('Error al guardar la poliza', 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  }

  const defaultValues = {
    empleadoGenero: get(polizaToEdit, 'empleadoGenero', ''),
    cantidad: get(polizaToEdit, 'cantidad', ''),
  };

  const validationSchema = Yup.object({
    cantidad: Yup.number()
      .typeError('Solo se permiten números')
      .integer('Solo se permiten números enteros')
      .positive('El tiempo debe ser positivo'),
    usuarioId: Yup.number(),
    inventarioId: Yup.number(),
  });

  const dialogTitle = isEditing ? messages.title.edit : messages.title.create;

  if (!open) return <div style={{ display: 'none ' }} />;

  return (
    <Formik
      onSubmit={(values, actions) => {
        handleCreatePoliza(values, actions.resetForm);
      }}
      validationSchema={validationSchema}
      initialValues={defaultValues}
      render={p => (
        <Dialog
          onClose={() => {
            onClose();
            p.handleReset();
          }}
          title={dialogTitle}
          open={open}
          withActions
          negativeAction={messages.actions.cancel}
          positiveAction={messages.actions.save}
          onNegativeAction={() => {
            onClose();
            p.handleReset();
          }}
          onPositiveAction={() => p.handleSubmit(p.values)}
          disabled={!p.isValid || p.isSubmitting}
        >
          <Form
            {...p}
            disabled={false}
            isEditing={isEditing}
            fromProfile={fromProfile}
            inventory={inventory}
            users={users}
          />
        </Dialog>
      )}
    />
  );
}

CreateEditPoliza.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  callback: PropTypes.func,
  dispatch: PropTypes.func,
  polizaToEdit: PropTypes.object,
  fromProfile: PropTypes.bool,
};

export default memo(CreateEditPoliza);
