/*
 * HomePage
 *
 * This is the first thing users see of our App, at the '/' route
 *
 */

import React from 'react';
import PropTypes from 'prop-types';
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

export default function HomePage({ history }) {
  const handleLogin = () => {
    history.push('/');
  };
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
            error={false}
            helperText={false && 'Ingrese un correo válido'}
          />
          <Input
            label="Contraseña"
            error={false}
            helperText={false && 'Ingrese una contraseña'}
          />
          <SpaceBetween>
            <LabelButton>Crear cuenta</LabelButton>
            <Button onClick={handleLogin}>Ingresar</Button>
          </SpaceBetween>
        </Form>
      </FormSection>
    </MainContainer>
  );
}

HomePage.propTypes = {
  history: PropTypes.object.isRequired,
};
