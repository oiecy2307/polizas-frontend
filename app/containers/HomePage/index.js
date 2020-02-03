/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { wLogin } from 'services/auth';
import { aOpenSnackbar } from 'containers/App/actions';
import { getToken } from 'utils/helper';

import Input from 'components/InputText';
import LayersIcon from '@material-ui/icons/Layers';
import {
  SpaceBetween,
  LabelButton,
  Button,
} from 'utils/globalStyledComponents';
import {
  MainContainer,
  FormSection,
  Logo,
  H1,
  P,
  Form,
} from './styledComponents';

function HomePage({ history, dispatch }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    const token = getToken();
    if (token) history.push('/');
  }, []);

  async function handleLogin() {
    try {
      if (username && password) {
        const response = await wLogin({ username, password });
        if (response.error) {
          dispatch(
            aOpenSnackbar('Usuario y/o contraseña incorrectos', 'error'),
          );
        } else {
          localStorage.setItem('user', JSON.stringify(response.user));
          localStorage.setItem('token', response.token);
          history.push('/');
        }
      }
    } catch (e) {
      dispatch(aOpenSnackbar('Usuario y/o contraseña incorrectos', 'error'));
    }
  }

  const disabled = !username || !password;

  return (
    <MainContainer>
      <FormSection>
        <Logo>
          <LayersIcon style={{ color: '#108043', fontSize: 32 }} />
        </Logo>
        <H1>Bienvenido a Suppdesk</H1>
        <P>
          Por favor ingresa los siguientes datos para poder acceder a nuestro
          sistema de soporte.
        </P>
        <Form>
          <Input
            label="Correo"
            type="email"
            error={false}
            helperText={false && 'Ingrese un correo válido'}
            onChange={e => setUsername(e.target.value)}
          />
          <Input
            label="Contraseña"
            type="password"
            error={false}
            helperText={false && 'Ingrese una contraseña'}
            onChange={e => setPassword(e.target.value)}
          />
          <SpaceBetween>
            {false && <LabelButton>Crear cuenta</LabelButton>}
            <Button disabled={disabled} onClick={() => handleLogin()}>
              Ingresar
            </Button>
          </SpaceBetween>
        </Form>
      </FormSection>
    </MainContainer>
  );
}

HomePage.propTypes = {
  history: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapDispatchToProps);

export default compose(withConnect)(HomePage);
