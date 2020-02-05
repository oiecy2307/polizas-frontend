/*
 * Users Messages
 *
 * This contains all the text for the Users container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.Users';

export default language => {
  const values = {
    dashboard: {
      es: 'Dashboard',
      en: 'Dashboard',
    },
    tickets: {
      es: 'Tickets',
      en: 'Tickets',
    },
    invoices: {
      es: 'Facturas',
      en: 'Invoices',
    },
    users: {
      es: 'Usuarios',
      en: 'Users',
    },
    logout: {
      es: 'Cerrar sesión',
      en: 'Log out',
    },
  };
  return defineMessages({
    header: {
      id: `${scope}.header`,
      defaultMessage: 'This is the Users container!',
    },
    menu: {
      dashboard: values.dashboard[language],
      tickets: values.tickets[language],
      invoices: values.invoices[language],
      users: values.users[language],
      logout: values.logout[language],
    },
  });
};