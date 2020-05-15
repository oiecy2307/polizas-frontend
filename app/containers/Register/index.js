/**
 *
 * Register
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import * as Yup from 'yup';
import { get } from 'lodash';
import { textRegex, getToken } from 'utils/helper';

import { Formik } from 'formik';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import { wsDecodeInvitation } from 'services/auth';

import Form from './form';

export function Register({ dispatch, match, history }) {
  const [email, setEmail] = useState('');

  useEffect(() => {
    handleValidateToken();
    evaluateToken();
  }, []);

  async function evaluateToken() {
    const token = await getToken();
    if (token) history.push('/');
  }

  const handleValidateToken = async () => {
    try {
      const token = get(match, 'params.token', '');
      dispatch(aSetLoadingState(true));
      const response = await wsDecodeInvitation({ token });
      setEmail(response.email);
    } catch (e) {
      const error =
        get(e, 'data.message', 'Ocurrió un error, intente de nuevo') || '';
      dispatch(aOpenSnackbar(error, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  };

  const handleRegister = async (body, resetValues) => {
    try {
      dispatch(aSetLoadingState(true));
      // const response = await wsPayTicket(id, body);
      dispatch(aOpenSnackbar('Cambios guardados', 'success'));
      resetValues();
    } catch (e) {
      const error =
        get(e, 'data.message', '') || 'No fue posible completar el registro';
      dispatch(aOpenSnackbar(error, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  };

  const defaultValues = {
    name: '',
    lastname: '',
    secondLastName: '',
    username: '',
    password: '',
    phoneNumber: '',
  };

  const validationSchema = Yup.object({
    name: Yup.string('Nombre')
      .required('Campo requerido')
      .max(150, 'El texto es muy largo')
      .matches(textRegex, 'Texto no válido'),
    lastname: Yup.string('Apellido paterno')
      .required('Campo requerido')
      .max(150, 'El texto es muy largo')
      .matches(textRegex, 'Texto no válido'),
    secondLastName: Yup.string('Apellido materno')
      .max(150, 'El texto es muy largo')
      .matches(textRegex, 'Texto no válido'),
    username: Yup.string('Username')
      .required('Campo requerido')
      .max(150, 'El texto es muy largo'),
    password: Yup.string('Contraseña')
      .required('Campo requerido')
      .min(8, 'Deben ser al menos 8 caracteres')
      .max(150, 'El texto es muy largo'),
    passwordConfirmation: Yup.string()
      .required('Campo requerido')
      .oneOf([Yup.ref('password'), null], 'Confirmar contraseña'),
    phoneNumber: Yup.number('Role')
      .typeError('Solo números')
      .max(9999999999999999, 'El texto es muy largo'),
  });

  return (
    <div>
      <Helmet>
        <title>Registro</title>
      </Helmet>
      <Formik
        onSubmit={(values, actions) => {
          handleRegister(values, actions.resetForm);
        }}
        validationSchema={validationSchema}
        initialValues={defaultValues}
        render={p => (
          <Form {...p} email={email} disabled={!p.isValid || p.isSubmitting} />
        )}
      />
    </div>
  );
}

Register.propTypes = {
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.object,
  history: PropTypes.object,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(Register);
