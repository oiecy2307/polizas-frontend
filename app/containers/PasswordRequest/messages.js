/*
 * PasswordRequest Messages
 *
 * This contains all the text for the PasswordRequest container.
 */
import { defineMessages } from 'react-intl';

export const scope = 'app.containers.PasswordRequest';

export default language => {
  const values = {
    welcome: {
      es: 'Bienvenido a Suppdesk',
      en: 'Welcome to Suppdesk',
    },
    welcomeMessage: {
      es:
        'Ingresa tu dirección de correo y te enviaremos un correo con el link para recuperar tu contraseña.',
      en:
        "Write your email account and we'll send you an email with a link to recover your password",
    },
    email: {
      es: 'Correo',
      en: 'Email',
    },
    password: {
      es: 'Contraseña',
      en: 'Password',
    },
    login: {
      es: 'Enviar correo',
      en: 'Send email',
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
