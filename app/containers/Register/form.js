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
  const { values, touched, errors, email, disabled } = props;
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
              label="Nombre"
              helperText={touched.name ? errors.name : ''}
              error={touched.name && Boolean(errors.name)}
            />
          )}
        />
        <Field
          name="lastname"
          defaultValues={values.lastname}
          render={({ field }) => (
            <Input
              {...field}
              label="Apellido paterno"
              helperText={touched.lastname ? errors.lastname : ''}
              error={touched.lastname && Boolean(errors.lastname)}
            />
          )}
        />
        <Field
          name="secondLastName"
          defaultValues={values.secondLastName}
          render={({ field }) => (
            <Input
              {...field}
              label="Apellido materno"
              helperText={touched.secondLastName ? errors.secondLastName : ''}
              error={touched.secondLastName && Boolean(errors.secondLastName)}
            />
          )}
        />
        <Field
          name="username"
          defaultValues={values.username}
          render={({ field }) => (
            <Input
              {...field}
              label="Username"
              helperText={touched.username ? errors.username : ''}
              error={touched.username && Boolean(errors.username)}
            />
          )}
        />
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
            />
          )}
        />
        <Field
          name="phoneNumber"
          defaultValues={values.phoneNumber}
          render={({ field }) => (
            <Input
              {...field}
              label="Número de teléfono"
              helperText={touched.phoneNumber ? errors.phoneNumber : ''}
              error={touched.phoneNumber && Boolean(errors.phoneNumber)}
            />
          )}
        />
        <SpaceBetween>
          <span />
          <Button disabled={disabled} type="submit">
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
};

export default memo(RegisterForm);
