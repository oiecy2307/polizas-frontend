/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { wLogin } from 'services/auth';
import { aOpenSnackbar } from 'containers/App/actions';
import { getToken } from 'utils/helper';
import { GlobalValuesContext } from 'contexts/global-values';
import { ImmortalDB } from 'immortal-db';

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
import getMessages from './messages';

function HomePage({ history, dispatch }) {
  const { language } = useContext(GlobalValuesContext);
  const [messages] = useState(getMessages(language));
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  useEffect(() => {
    evaluateToken();
  }, []);

  async function evaluateToken() {
    const token = await getToken();
    if (token) history.push('/');
  }

  async function handleLogin() {
    try {
      if (username && password) {
        const response = await wLogin({ username, password });
        if (response.error) {
          dispatch(
            aOpenSnackbar('Usuario y/o contraseña incorrectos', 'error'),
          );
        } else {
          await ImmortalDB.set('user', JSON.stringify(response.user));
          await ImmortalDB.set('token', response.token);
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
        <H1>{messages.welcome}</H1>
        <P>{messages.welcomeMessage}</P>
        <Form>
          <Input
            label={messages.email}
            type="email"
            error={false}
            onChange={e => setUsername(e.target.value)}
          />
          <Input
            label={messages.password}
            type="password"
            error={false}
            onChange={e => setPassword(e.target.value)}
          />
          <SpaceBetween>
            <span />
            {false && <LabelButton>Crear cuenta</LabelButton>}
            <Button disabled={disabled} onClick={() => handleLogin()}>
              {messages.login}
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
