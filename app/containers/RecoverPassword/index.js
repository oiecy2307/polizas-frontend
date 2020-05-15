/**
 *
 * RecoverPassword
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import * as Yup from 'yup';
import { get } from 'lodash';
import { getToken } from 'utils/helper';

import { Formik } from 'formik';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import { wsValidateRequest, wsChangePassword } from 'services/auth';

import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import Form from './form';

export function RecoverPassword({ dispatch, match, history }) {
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
      const response = await wsValidateRequest({ token });
      setEmail(response.email);
    } catch (e) {
      const error =
        get(e, 'data.message', 'Ocurrió un error, intente de nuevo') || '';
      if (error === 'jwt expired' || error === 'Token expirado') {
        setTokenExpired('La solicitud caducó, solicite una nueva');
        return;
      }
      setTokenExpired(error);
    } finally {
      dispatch(aSetLoadingState(false));
    }
  };

  const handleChangePassword = async (body, resetValues, setSubmitting) => {
    try {
      const token = get(match, 'params.token', '');
      dispatch(aSetLoadingState(true));
      const response = await wsChangePassword({
        ...body,
        token,
      });
      if (response) {
        dispatch(aOpenSnackbar('Contraseña cambiada con éxito', 'success'));
        resetValues();
        setTimeout(() => {
          history.push('/');
        }, 3000);
      }
    } catch (e) {
      const error =
        get(e, 'data.message', '') || 'No fue posible cambiar la contraseña';
      dispatch(aOpenSnackbar(error, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
      setSubmitting(false);
    }
  };

  const defaultValues = {
    password: '',
    passwordConfirmation: '',
  };

  const validationSchema = Yup.object({
    password: Yup.string('Contraseña')
      .required('Campo requerido')
      .min(8, 'Deben ser al menos 8 caracteres')
      .max(150, 'El texto es muy largo'),
    passwordConfirmation: Yup.string()
      .required('Campo requerido')
      .oneOf([Yup.ref('password'), null], 'Confirmar contraseña'),
  });

  function Alert(props) {
    return <MuiAlert elevation={6} variant="filled" {...props} />;
  }

  return (
    <div>
      <Helmet>
        <title>Cambiar contraseña</title>
      </Helmet>
      <Formik
        onSubmit={(values, actions) => {
          handleChangePassword(
            values,
            actions.resetForm,
            actions.setSubmitting,
          );
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

RecoverPassword.propTypes = {
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
)(RecoverPassword);
