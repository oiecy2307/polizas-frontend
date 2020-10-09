/**
 *
 * RecoverPasswordForm
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';

import Input from 'components/InputText';
import { SpaceBetween, Button } from 'utils/globalStyledComponents';
import LayersIcon from '@material-ui/icons/Layers';

import { Form, Logo, H1, P } from './styledComponents';

function RecoverPasswordForm(props) {
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
            <P>Haga una solicitud nueva</P>
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
          <P>Llena el siguiente formulario para cambiar tu contraseña</P>
        </div>
        <Input
          readOnly
          disabled
          type="email"
          value={email}
          label="Correo electrónico"
          maxLength="150"
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
        <SpaceBetween>
          <span />
          <Button disabled={disabled} onClick={() => handleSubmit(values)}>
            Cambiar contraseña
          </Button>
        </SpaceBetween>
      </div>
    </Form>
  );
}

RecoverPasswordForm.propTypes = {
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

export default memo(RecoverPasswordForm);
