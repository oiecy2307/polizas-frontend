import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { trimObject } from 'utils/helper';

import { wsUpdateInstanceSettings } from 'services/instances';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';

import { Paper } from 'utils/globalStyledComponents';
import Input from 'components/InputText';
import Button from 'components/Button';

import { ConfigSection, SaveSection } from '../styledComponents';

const ButtonRight = ({ disabled, onClick }) => (
  <SaveSection>
    <Button disabled={disabled} onClick={onClick}>
      Guardar
    </Button>
  </SaveSection>
);

ButtonRight.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

function CostConfig({ dispatch, instance }) {
  const handleSaveChanges = async (body, actions) => {
    try {
      dispatch(aSetLoadingState(true));
      await wsUpdateInstanceSettings({
        type: 'cost-config',
        data: trimObject(body),
      });
      dispatch(aOpenSnackbar('Cambios guardados', 'success'));
    } catch (e) {
      const errorMessage =
        get(e, 'data.message', '') || 'Ocurrió un error desconocido';
      dispatch(aOpenSnackbar(errorMessage, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
      actions.setSubmitting(false);
      actions.resetForm(body);
    }
  };

  const defaultValues = {
    hour: get(instance, 'costsConfig.hour', '') || '0',
    halfHour: get(instance, 'costsConfig.halfHour', '') || '0',
    fraction: get(instance, 'costsConfig.fraction', '') || '0',
  };

  const validationSchema = Yup.object({
    hour: Yup.number('1 hora')
      .required('Campo requerido')
      .typeError('Ingrese un valor válido')
      .min(0, 'Ingrese un valor positivo')
      .max(9999999999999999, 'Valor demasiado grande'),
    halfHour: Yup.number('1 hora')
      .required('Campo requerido')
      .typeError('Ingrese un valor válido')
      .min(0, 'Ingrese un valor positivo')
      .max(9999999999999999, 'Valor demasiado grande'),
    fraction: Yup.number('1 hora')
      .required('Campo requerido')
      .typeError('Ingrese un valor válido')
      .min(0, 'Ingrese un valor positivo')
      .max(9999999999999999, 'Valor demasiado grande'),
  });

  return (
    <Formik
      onSubmit={(values, actions) => {
        handleSaveChanges(values, actions);
      }}
      validationSchema={validationSchema}
      initialValues={defaultValues}
      render={({ values, touched, errors, ...p }) => (
        <Paper>
          <ConfigSection>
            <h3>Precio por servicio</h3>
            <div className="description">
              Define los precios correspondientes a cada fracción de tiempo
            </div>
            <Field
              name="hour"
              defaultValue={values.hour}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  label="1 hora"
                  helperText={touched[field.name] ? errors[field.name] : ''}
                  error={touched[field.name] && Boolean(errors[field.name])}
                  maxLength="20"
                />
              )}
            />
            <Field
              name="halfHour"
              defaultValue={values.halfHour}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  label="1/2 hora"
                  helperText={touched[field.name] ? errors[field.name] : ''}
                  error={touched[field.name] && Boolean(errors[field.name])}
                  maxLength="20"
                />
              )}
            />
            <Field
              name="fraction"
              defaultValue={values.fraction}
              render={({ field }) => (
                <Input
                  {...field}
                  type="number"
                  label="< 1/2 hora"
                  helperText={touched[field.name] ? errors[field.name] : ''}
                  error={touched[field.name] && Boolean(errors[field.name])}
                  maxLength="20"
                />
              )}
            />
            <ButtonRight
              disabled={!p.isValid || p.isSubmitting}
              onClick={() => p.handleSubmit(p.values, p)}
            />
          </ConfigSection>
        </Paper>
      )}
    />
  );
}

CostConfig.propTypes = {
  dispatch: PropTypes.func,
  instance: PropTypes.object,
};

export default CostConfig;
