import React from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import { Formik, Field } from 'formik';
import * as Yup from 'yup';
import { trimObject } from 'utils/helper';

import { wsUpdateInstanceSettings } from 'services/instances';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';

import Checkbox from '@material-ui/core/Checkbox';
import FormControlLabel from '@material-ui/core/FormControlLabel';
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

function PopupConfig({ dispatch, instance }) {
  const handleSaveChanges = async (body, actions) => {
    try {
      dispatch(aSetLoadingState(true));
      await wsUpdateInstanceSettings({
        type: 'popup-config',
        data: trimObject({
          confirmation: body.confirmation,
          introduction: body.introduction,
          minimized: body.minimized,
          title: body.title,
          fields: {
            description: body.description,
            email: body.email,
            evidence: body.evidence,
            name: body.name,
            phone: body.phone,
            title: body.titleField,
          },
        }),
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
    confirmation: get(instance, 'popupConfig.confirmation', '') || '',
    introduction: get(instance, 'popupConfig.introduction', '') || '',
    minimized: get(instance, 'popupConfig.minimized', '') || '',
    title: get(instance, 'popupConfig.title', '') || '',
    description:
      get(instance, 'popupConfig.fields.description', false) || false,
    email: get(instance, 'popupConfig.fields.email', false) || false,
    evidence: get(instance, 'popupConfig.fields.evidence', false) || false,
    name: get(instance, 'popupConfig.fields.name', false) || false,
    phone: get(instance, 'popupConfig.fields.phone', false) || false,
    titleField: get(instance, 'popupConfig.fields.title', false) || false,
  };

  const validationSchema = Yup.object({
    confirmation: Yup.string('Texto de confirmación')
      .trim()
      .required('Campo requerido')
      .max(12, 'Texto demasiado largo'),
    introduction: Yup.string('Texto introductorio')
      .trim()
      .required('Campo requerido')
      .max(200, 'Texto demasiado largo'),
    minimized: Yup.string('Texto en modo minimizado')
      .trim()
      .required('Campo requerido')
      .max(16, 'Texto demasiado largo'),
    title: Yup.string('Título')
      .trim()
      .required('Campo requerido')
      .max(24, 'Texto demasiado largo'),
    description: Yup.boolean().required('Campo requerido'),
    email: Yup.boolean().required('Campo requerido'),
    evidence: Yup.boolean().required('Campo requerido'),
    name: Yup.boolean().required('Campo requerido'),
    phone: Yup.boolean().required('Campo requerido'),
    titleField: Yup.boolean().required('Campo requerido'),
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
            <h3>Popup</h3>
            <div className="description">
              Configura el contenido que mostraremos en tu Popup de tickets
            </div>
            <Field
              name="minimized"
              defaultValue={values.minimized}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  label="Texto en modo minimizado"
                  helperText={touched[field.name] ? errors[field.name] : ''}
                  error={touched[field.name] && Boolean(errors[field.name])}
                  maxLength="16"
                />
              )}
            />
            <Field
              name="title"
              defaultValue={values.title}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  label="Título"
                  helperText={touched[field.name] ? errors[field.name] : ''}
                  error={touched[field.name] && Boolean(errors[field.name])}
                  maxLength="24"
                />
              )}
            />
            <Field
              name="introduction"
              defaultValue={values.introduction}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  label="Texto introductorio"
                  helperText={touched[field.name] ? errors[field.name] : ''}
                  error={touched[field.name] && Boolean(errors[field.name])}
                  maxLength="200"
                />
              )}
            />
            <Field
              name="confirmation"
              defaultValue={values.confirmation}
              render={({ field }) => (
                <Input
                  {...field}
                  type="text"
                  label="Texto de confirmación"
                  helperText={touched[field.name] ? errors[field.name] : ''}
                  error={touched[field.name] && Boolean(errors[field.name])}
                  maxLength="12"
                />
              )}
            />
            <div>
              <Field
                name="name"
                defaultValue={values.name}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={e =>
                          p.setFieldValue('name', e.target.checked)
                        }
                        name="name-check"
                        color="primary"
                      />
                    }
                    label="Nombre"
                  />
                )}
              />
            </div>
            <div>
              <Field
                name="email"
                defaultValue={values.email}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={e =>
                          p.setFieldValue('email', e.target.checked)
                        }
                        name="email-check"
                        color="primary"
                      />
                    }
                    label="Correo electrónico"
                  />
                )}
              />
            </div>
            <div>
              <Field
                name="phone"
                defaultValue={values.phone}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={e =>
                          p.setFieldValue('phone', e.target.checked)
                        }
                        name="phone-check"
                        color="primary"
                      />
                    }
                    label="Número de teléfono"
                  />
                )}
              />
            </div>
            <div>
              <Field
                name="titleField"
                defaultValue={values.titleField}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={e =>
                          p.setFieldValue('titleField', e.target.checked)
                        }
                        name="titleField-check"
                        color="primary"
                      />
                    }
                    label="Título del problema"
                  />
                )}
              />
            </div>
            <div>
              <Field
                name="description"
                defaultValue={values.description}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={e =>
                          p.setFieldValue('description', e.target.checked)
                        }
                        name="description-check"
                        color="primary"
                      />
                    }
                    label="Descripción del problema"
                  />
                )}
              />
            </div>
            <div>
              <Field
                name="evidence"
                defaultValue={values.evidence}
                render={({ field }) => (
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={field.value}
                        onChange={e =>
                          p.setFieldValue('evidence', e.target.checked)
                        }
                        name="evidence-check"
                        color="primary"
                      />
                    }
                    label="Evidencia (archivos, imágenes, etc)"
                  />
                )}
              />
            </div>
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

PopupConfig.propTypes = {
  dispatch: PropTypes.func,
  instance: PropTypes.object,
};

export default PopupConfig;
