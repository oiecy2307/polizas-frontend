/*
 * Users Messages
 *
 * This contains all the text for the Users container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.Users';

export default language => {
  const values = {
    name: {
      es: 'Nombre',
      en: 'Name',
    },
    email: {
      es: 'Correo electrónico',
      en: 'Email',
    },
    username: {
      es: 'Username',
      en: 'Username',
    },
    date: {
      es: 'Fecha registro',
      en: 'Register date',
    },
    admins: {
      es: 'Administradores',
      en: 'Administrators',
    },
    technicalSupport: {
      es: 'Soporte',
      en: 'Technicals',
    },
    clients: {
      es: 'Clientes',
      en: 'Clients',
    },
  };
  return defineMessages({
    header: {
      id: `${scope}.header`,
      defaultMessage: 'This is the Users container!',
    },
    table: {
      name: values.name[language],
      email: values.email[language],
      username: values.username[language],
      date: values.date[language],
    },
    tabs: {
      admins: values.admins[language],
      technicalSupport: values.technicalSupport[language],
      clients: values.clients[language],
    },
  });
};
