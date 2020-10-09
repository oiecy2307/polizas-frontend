/**
 *
 * RegisterForm
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';

import Input from 'components/InputText';
import { SpaceBetween, Button } from 'utils/globalStyledComponents';
import LayersIcon from '@material-ui/icons/Layers';

import { Form, Logo, H1, P } from './styledComponents';

function RegisterForm(props) {
  const {
    values,
    touched,
    errors,
    email,
    disabled,
    isExpired,
    handleSubmit,
  } = props;
  if (isExpired) {
    return (
      <Form>
        <div className="form">
          <div className="top">
            <Logo>
              <LayersIcon style={{ color: '#108043', fontSize: 32 }} />
            </Logo>
            <H1>Bienvenido a Suppdesk</H1>
            <P>Solicita una nueva invitación al administrador</P>
          </div>
        </div>
      </Form>
    );
  }
  return (
    <Form>
      <div className="form">
        <div className="top">
          <Logo>
            <LayersIcon style={{ color: '#108043', fontSize: 32 }} />
          </Logo>
          <H1>Bienvenido a Suppdesk</H1>
          <P>Completa el siguiente formulario para ser parte de Suppdesk</P>
        </div>
        <Input
          readOnly
          disabled
          type="email"
          value={email}
          label="Correo electrónico"
        />
        <Field
          name="name"
          defaultValues={values.name}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Nombre"
              helperText={touched.name ? errors.name : ''}
              error={touched.name && Boolean(errors.name)}
              maxLength="100"
            />
          )}
        />
        <Field
          name="lastname"
          defaultValues={values.lastname}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Apellido paterno"
              helperText={touched.lastname ? errors.lastname : ''}
              error={touched.lastname && Boolean(errors.lastname)}
              maxLength="100"
            />
          )}
        />
        <Field
          name="secondLastName"
          defaultValues={values.secondLastName}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label="Apellido materno"
              helperText={touched.secondLastName ? errors.secondLastName : ''}
              error={touched.secondLastName && Boolean(errors.secondLastName)}
              maxLength="100"
            />
          )}
        />
        {false && (
          <Field
            name="username"
            defaultValues={values.username}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                label="Username"
                helperText={touched.username ? errors.username : ''}
                error={touched.username && Boolean(errors.username)}
                maxLength="150"
              />
            )}
          />
        )}
        <Field
          name="password"
          defaultValues={values.password}
          render={({ field }) => (
            <Input
              {...field}
              type="password"
              label="Contraseña"
              helperText={touched.password ? errors.password : ''}
              error={touched.password && Boolean(errors.password)}
              maxLength="150"
            />
          )}
        />
        <Field
          name="passwordConfirmation"
          defaultValues={values.passwordConfirmation}
          render={({ field }) => (
            <Input
              {...field}
              type="password"
              label="Confirmar contraseña"
              helperText={
                touched.passwordConfirmation ? errors.passwordConfirmation : ''
              }
              error={
                touched.passwordConfirmation &&
                Boolean(errors.passwordConfirmation)
              }
              maxLength="150"
            />
          )}
        />
        <Field
          name="phoneNumber"
          defaultValues={values.phoneNumber}
          render={({ field }) => (
            <Input
              {...field}
              type="tel"
              label="Número de teléfono (opcional)"
              helperText={touched.phoneNumber ? errors.phoneNumber : ''}
              error={touched.phoneNumber && Boolean(errors.phoneNumber)}
              maxLength="16"
            />
          )}
        />
        <SpaceBetween>
          <span />
          <Button disabled={disabled} onClick={() => handleSubmit(values)}>
            Registrarme
          </Button>
        </SpaceBetween>
      </div>
    </Form>
  );
}

RegisterForm.propTypes = {
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
  values: PropTypes.object,
  touched: PropTypes.object,
  errors: PropTypes.object,
  isEditing: PropTypes.bool,
  fromProfile: PropTypes.bool,
  email: PropTypes.string,
  disabled: PropTypes.bool,
  isExpired: PropTypes.bool,
  handleSubmit: PropTypes.func,
};

export default memo(RegisterForm);
