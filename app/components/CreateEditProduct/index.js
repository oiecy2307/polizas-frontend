/**
 *
 * CreateEditProduct
 *
 */

import React, { memo, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { GlobalValuesContext } from 'contexts/global-values';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { get } from 'lodash';

import { wsCreateProduct, wsUpdateProduct } from 'services/products';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import { trimObject } from 'utils/helper';
import FormikDebugger from 'components/FormikDebugger';

import Dialog from 'components/Dialog';
import Form from './form';

import getMessages from './messages';

function CreateEditProduct({
  open,
  onClose,
  callback,
  dispatch,
  defaultProduct,
}) {
  const { language } = useContext(GlobalValuesContext);
  const [messages] = useState(getMessages(language));
  const isEditing = Boolean(defaultProduct);

  async function handleCreateProduct(values, { resetForm, setSubmitting }) {
    try {
      dispatch(aSetLoadingState(true));

      if (isEditing) {
        const body = {
          id: defaultProduct.id,
          ...values,
        };
        await wsUpdateProduct(trimObject(body));
      } else {
        const body = {
          ...values,
        };
        await wsCreateProduct(trimObject(body));
      }

      dispatch(aOpenSnackbar('Producto guardado con éxito', 'success'));
      callback();
      onClose();
      resetForm();
      setSubmitting(false);
    } catch (e) {
      const errorMessage = get(e, 'data.message', 'Error al guardar producto');
      dispatch(aOpenSnackbar(errorMessage, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  }

  const defaultValues = {
    name: get(defaultProduct, 'name', ''),
    description: get(defaultProduct, 'description', ''),
    actualVersion: get(defaultProduct, 'actualVersion', ''),
  };

  const validationSchema = Yup.object({
    name: Yup.string('Nombre')
      .trim()
      .required('Campo requerido')
      .max(100, 'Texto demasiado largo'),
    description: Yup.string('Dirección')
      .trim()
      .notRequired('')
      .max(255, 'Texto demasiado largo'),
    actualVersion: Yup.string('Versión')
      .trim()
      .required('Campo requerido')
      .max(50, 'Texto demasiado largo'),
  });

  const dialogTitle = isEditing ? 'Editar producto' : 'Nuevo producto';

  if (!open) return <div style={{ display: 'none ' }} />;

  return (
    <Formik
      onSubmit={(values, actions) => {
        handleCreateProduct(values, actions);
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
          <Form {...p} disabled={false} />
          {false && <FormikDebugger />}
        </Dialog>
      )}
    />
  );
}

CreateEditProduct.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  callback: PropTypes.func,
  dispatch: PropTypes.func,
  defaultProduct: PropTypes.object,
};

export default memo(CreateEditProduct);
