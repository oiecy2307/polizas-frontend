import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { trimObject } from 'utils/helper';

import { wsUpdateInstanceSettings } from 'services/instances';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';

import { Paper, Divider } from 'utils/globalStyledComponents';
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

function CompanyInfo({ dispatch, instance }) {
  const handleSaveChanges = async (body, actions) => {
    try {
      dispatch(aSetLoadingState(true));
      await wsUpdateInstanceSettings({
        type: 'personal-info',
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
    website: get(instance, 'website', '') || '',
    name: get(instance, 'name', '') || '',
    phone: get(instance, 'phone', '') || '',
    email: get(instance, 'email', '') || '',
    address: get(instance, 'address', '') || '',
    lat: get(instance, 'lat', '') || '',
    lng: get(instance, 'lng', '') || '',
    profile: get(instance, 'profile', '') || '',
  };

  const validationSchema = Yup.object({
    website: Yup.string('Link de página')
      .trim()
      .notRequired()
      .url('Ingrese un link válido')
      .max(1000, 'Texto demasiado largo'),
    name: Yup.string('Nombre de empresa')
      .trim()
      .required('Campo requerido')
      .max(255, 'Texto demasiado largo'),
    phone: Yup.number('Número de teléfono')
      .typeError('Ingrese solo números')
      .notRequired()
      .max(9999999999, 'Número demasiado largo'),
    email: Yup.string('Correo electrónico')
      .trim()
      .email('Ingrese un correo válido')
      .notRequired()
      .max(255, 'Texto demasiado largo'),
    address: Yup.string('Dirección')
      .trim()
      .notRequired()
      .max(255, 'Texto demasiado largo'),
    lat: Yup.number('Latitud')
      .notRequired()
      .typeError('Ingrese un valor válido')
      .max(999, 'Valor demasiado grande')
      .min(-999, 'Valor demasiado pequeño'),
    lng: Yup.number().when('lat', {
      is: lat => Boolean(lat),
      then: Yup.number('Longitud')
        .required('Ingrese la longitud correspondiente')
        .typeError('Ingrese un valor válido')
        .max(999, 'Valor demasiado grande')
        .min(-999, 'Valor demasiado pequeño'),
      otherwise: Yup.number('Longitud')
        .notRequired()
        .typeError('Ingrese un valor válido')
        .max(999, 'Valor demasiado grande')
        .min(-999, 'Valor demasiado pequeño'),
    }),
    profile: Yup.string('Imagen de perfil')
      .trim()
      .notRequired(),
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
            <h3>Información de empresa</h3>
            <div className="description">
              Mostraremos esta información en tu perfil
            </div>
            <Field
              name="website"
              defaultValue={values.website}
              render={({ field }) => (
                <Input
                  {...field}
                  type="url"
                  label="Link de página"
                  helperText={touched[field.name] ? errors[field.name] : ''}
                  error={touched[field.name] && Boolean(errors[field.name])}
                  maxLength="1000"
                />
              )}
            />
            <Field
              name="name"
              defaultValue={values.name}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  label="Nombre"
                  helperText={touched[field.name] ? errors[field.name] : ''}
                  error={touched[field.name] && Boolean(errors[field.name])}
                  maxLength="255"
                />
              )}
            />
            <Field
              name="phone"
              defaultValue={values.phone}
              render={({ field }) => (
                <Input
                  {...field}
                  type="tel"
                  label="Teléfono"
                  helperText={touched[field.name] ? errors[field.name] : ''}
                  error={touched[field.name] && Boolean(errors[field.name])}
                  maxLength="10"
                />
              )}
            />
            <Field
              name="email"
              defaultValue={values.email}
              render={({ field }) => (
                <Input
                  {...field}
                  type="email"
                  label="Correo electrónico"
                  helperText={touched[field.name] ? errors[field.name] : ''}
                  error={touched[field.name] && Boolean(errors[field.name])}
                  maxLength="255"
                />
              )}
            />
            <Field
              name="address"
              defaultValue={values.address}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  label="Dirección"
                  helperText={touched[field.name] ? errors[field.name] : ''}
                  error={touched[field.name] && Boolean(errors[field.name])}
                  maxLength="255"
                />
              )}
            />
            <h4>Coordenadas (ubicación de mapa)</h4>
            <div className="input-pair">
              <Field
                name="lat"
                defaultValue={values.lat}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    label="Latitud"
                    helperText={touched[field.name] ? errors[field.name] : ''}
                    error={touched[field.name] && Boolean(errors[field.name])}
                    maxLength="20"
                  />
                )}
              />
              <Field
                name="lng"
                defaultValue={values.lng}
                render={({ field }) => (
                  <Input
                    {...field}
                    type="number"
                    label="Longitud"
                    helperText={touched[field.name] ? errors[field.name] : ''}
                    error={touched[field.name] && Boolean(errors[field.name])}
                    maxLength="20"
                  />
                )}
              />
            </div>
            <Divider size="8" />
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

CompanyInfo.propTypes = {
  dispatch: PropTypes.func,
  instance: PropTypes.object,
};

export default CompanyInfo;
