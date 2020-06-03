/**
 *
 * CreateEditSolution
 *
 */

import React, { memo, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { GlobalValuesContext } from 'contexts/global-values';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { get } from 'lodash';

import { wsCreateSolution, wsUpdateSolution } from 'services/solutions';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';

import Dialog from 'components/Dialog';
import Form from './form';

import getMessages from './messages';

function CreateEditSolution({
  open,
  onClose,
  callback,
  dispatch,
  defaultSolution,
  products,
}) {
  const { language } = useContext(GlobalValuesContext);
  const [messages] = useState(getMessages(language));
  const isEditing = Boolean(defaultSolution);

  async function handleCreateSolution(values, { resetForm, setSubmitting }) {
    try {
      dispatch(aSetLoadingState(true));

      if (isEditing) {
        const body = {
          id: defaultSolution.id,
          ...values,
        };
        await wsUpdateSolution(body);
      } else {
        const body = {
          ...values,
        };
        await wsCreateSolution(body);
      }

      dispatch(aOpenSnackbar('Solución creada con éxito', 'success'));
      callback();
      onClose();
      resetForm();
      setSubmitting(false);
    } catch (e) {
      const errorMessage = get(e, 'data.message', 'Error al crear solución');
      dispatch(aOpenSnackbar(errorMessage, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  }

  const defaultValues = {
    shortName: get(defaultSolution, 'shortName', ''),
    products: get(defaultSolution, 'products', []).map(p => ({
      value: p.id,
      label: p.name,
      version: p.solutionProduct.version,
    })),
  };

  const validationSchema = Yup.object({
    shortName: Yup.string('Nombre corto')
      .required('Campo requerido')
      .max(250, 'Texto demasiado largo'),
    products: Yup.array(),
  });

  const dialogTitle = isEditing ? 'Editar solución' : 'Nueva solución';

  if (!open) return <div style={{ display: 'none ' }} />;

  return (
    <Formik
      onSubmit={(values, actions) => {
        handleCreateSolution(values, actions);
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
          <Form {...p} disabled={false} products={products} />
        </Dialog>
      )}
    />
  );
}

CreateEditSolution.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  callback: PropTypes.func,
  dispatch: PropTypes.func,
  defaultSolution: PropTypes.object,
  products: PropTypes.array,
};

CreateEditSolution.defaultProps = {
  products: [],
};

export default memo(CreateEditSolution);
