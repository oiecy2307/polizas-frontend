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
import { textRegex, getToken, trimObject } from 'utils/helper';
import { ImmortalDB } from 'immortal-db';

import { Formik } from 'formik';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import { wsDecodeInvitation, wsRegisterWInvitation } from 'services/auth';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import Form from './form';

export function Register({ dispatch, match, history }) {
  const [email, setEmail] = useState('');
  const [tokenExpired, setTokenExpired] = useState('');

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
      if (error === 'jwt expired' || error === 'Token expirado') {
        setTokenExpired('La invitación caducó, solicite una nueva');
        return;
      }
      setTokenExpired(error);
    } finally {
      dispatch(aSetLoadingState(false));
    }
  };

  const handleRegister = async (body, resetValues, setSubmitting) => {
    try {
      const token = get(match, 'params.token', '');
      dispatch(aSetLoadingState(true));
      const response = await wsRegisterWInvitation(
        trimObject({
          ...body,
          phone: body.phoneNumber,
          token,
        }),
      );
      if (response) {
        dispatch(aOpenSnackbar('Registro con éxito', 'success'));
        resetValues();
        await ImmortalDB.set('user', JSON.stringify(response.user));
        await ImmortalDB.set('token', response.token);
        history.push('/');
      }
    } catch (e) {
      const error =
        get(e, 'data.message', '') || 'No fue posible completar el registro';
      dispatch(aOpenSnackbar(error, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
      setSubmitting(false);
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
      .trim()
      .required('Campo requerido')
      .max(100, 'El texto es muy largo')
      .matches(textRegex, 'Texto no válido'),
    lastname: Yup.string('Apellido paterno')
      .trim()
      .required('Campo requerido')
      .max(100, 'El texto es muy largo')
      .matches(textRegex, 'Texto no válido'),
    secondLastName: Yup.string('Apellido materno')
      .trim()
      .max(100, 'El texto es muy largo')
      .matches(textRegex, 'Texto no válido'),
    username: Yup.string('Username')
      .trim()
      .max(150, 'El texto es muy largo'),
    password: Yup.string('Contraseña')
      .trim()
      .required('Campo requerido')
      .min(8, 'Deben ser al menos 8 caracteres')
      .max(150, 'El texto es muy largo'),
    passwordConfirmation: Yup.string()
      .trim()
      .required('Campo requerido')
      .oneOf([Yup.ref('password'), null], 'Las contraseñas no coinciden'),
    phoneNumber: Yup.number('Role')
      .typeError('Solo números')
      .max(9999999999999999, 'El texto es muy largo'),
  });

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  return (
    <div>
      <Helmet>
        <title>Registro</title>
      </Helmet>
      <Formik
        onSubmit={(values, actions) => {
          handleRegister(values, actions.resetForm, actions.setSubmitting);
        }}
        validationSchema={validationSchema}
        initialValues={defaultValues}
        render={p => (
          <Form
            {...p}
            email={email}
            disabled={!p.isValid || p.isSubmitting}
            isExpired={tokenExpired}
          />
        )}
      />
      <Snackbar open={tokenExpired} onClose={() => {}}>
        <Alert onClose={() => {}} severity="error">
          {tokenExpired}
        </Alert>
      </Snackbar>
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
