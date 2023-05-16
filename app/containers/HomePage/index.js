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
import InputAdornment from '@material-ui/core/InputAdornment';
import Visibility from '@material-ui/icons/Visibility';
import VisibilityOff from '@material-ui/icons/VisibilityOff';
import IconButton from '@material-ui/core/IconButton';
import FilledInput from '@material-ui/core/FilledInput';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';

import { SpaceBetween, Button } from 'utils/globalStyledComponents';
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
  const [showPassword, setShowPassword] = useState(false);

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
          history.push('/polizas');
        }
      }
    } catch (e) {
      dispatch(aOpenSnackbar('Usuario y/o contraseña incorrectos', 'error'));
    }
  }

  const handleKeyPressPassword = e => {
    if (e.key === 'Enter') {
      handleLogin();
    }
  };

  const handleMouseDownPassword = event => {
    event.preventDefault();
  };

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
          <FormControl variant="filled">
            <InputLabel htmlFor="filled-adornment-password">
              Contraseña
            </InputLabel>
            <FilledInput
              id="filled-adornment-password"
              label={messages.password}
              type={showPassword ? 'text' : 'password'}
              error={false}
              onChange={e => setPassword(e.target.value)}
              onKeyPress={handleKeyPressPassword}
              fullWidth
              endAdornment={
                <InputAdornment position="end">
                  <IconButton
                    aria-label="toggle password visibility"
                    onClick={() =>
                      setShowPassword(_showPassword => !_showPassword)
                    }
                    onMouseDown={handleMouseDownPassword}
                    edge="end"
                  >
                    {showPassword ? <Visibility /> : <VisibilityOff />}
                  </IconButton>
                </InputAdornment>
              }
            />
          </FormControl>
          <SpaceBetween>
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
