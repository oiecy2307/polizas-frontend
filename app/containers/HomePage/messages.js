/*
 * HomePage Messages
 *
 * This contains all the text for the HomePage container.
 */
import { defineMessages } from 'react-intl';

export const scope = 'app.containers.HomePage';

export default language => {
  const values = {
    welcome: {
      es: 'Bienvenido a Suppdesk',
      en: 'Welcome to Suppdesk',
    },
    welcomeMessage: {
      es:
        'Por favor ingresa los siguientes datos para poder acceder a nuestro sistema de soporte.',
      en: 'Please, fill the next fields to access our support system',
    },
    email: {
      es: 'Correo / nombre de usuario',
      en: 'Email / username',
    },
    password: {
      es: 'Contraseña',
      en: 'Password',
    },
    login: {
      es: 'Ingresar',
      en: 'Log in',
    },
  };
  return defineMessages({
    header: {
      id: `${scope}.header`,
      defaultMessage: 'This is the Users container!',
    },
    welcome: values.welcome[language],
    welcomeMessage: values.welcomeMessage[language],
    email: values.email[language],
    password: values.password[language],
    login: values.login[language],
  });
};
