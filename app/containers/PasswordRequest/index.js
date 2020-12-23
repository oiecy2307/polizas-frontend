/*
 * PasswordRequest
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { compose } from 'redux';
import { wsRequestRecovery } from 'services/auth';
import { aOpenSnackbar } from 'containers/App/actions';
import { getToken } from 'utils/helper';
import { GlobalValuesContext } from 'contexts/global-values';
import { isEmail } from 'validator';

import Input from 'components/InputText';
import LayersIcon from '@material-ui/icons/Layers';
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

function PasswordRequest({ history, dispatch }) {
  const { language } = useContext(GlobalValuesContext);
  const [messages] = useState(getMessages(language));
  const [username, setUsername] = useState('');

  useEffect(() => {
    evaluateToken();
  }, []);

  async function evaluateToken() {
    const token = await getToken();
    if (token) history.push('/');
  }

  async function handleRequestPasswordChange() {
    try {
      if (username.trim()) {
        const response = await wsRequestRecovery({ email: username.trim() });
        if (response.error) {
          dispatch(aOpenSnackbar('No se pudo enviar la solicitud', 'error'));
        } else {
          dispatch(aOpenSnackbar('Solicitud enviada a tu correo', 'success'));
        }
      }
    } catch (e) {
      dispatch(aOpenSnackbar('No se pudo enviar la solicitud', 'error'));
    }
  }

  const disabled = !isEmail(username);

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
            maxLength="150"
          />
          <SpaceBetween>
            <span />
            <Button disabled={disabled} onClick={handleRequestPasswordChange}>
              {messages.login}
            </Button>
          </SpaceBetween>
        </Form>
      </FormSection>
    </MainContainer>
  );
}

PasswordRequest.propTypes = {
  history: PropTypes.object.isRequired,
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(mapDispatchToProps);

export default compose(withConnect)(PasswordRequest);
