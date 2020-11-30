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
    ticketsReporter: {
      es: 'Reporteador tickets',
      en: 'Tickets reporter',
    },
    invoices: {
      es: 'Facturas',
      en: 'Invoices',
    },
    users: {
      es: 'Usuarios',
      en: 'Users',
    },
    invitations: {
      es: 'Invitaciones',
      en: 'Invitations',
    },
    companies: {
      es: 'Empresas',
      en: 'Companies',
    },
    products: {
      es: 'Productos',
      en: 'Products',
    },
    solutions: {
      es: 'Soluciones',
      en: 'Solutions',
    },
    profile: {
      es: 'Mi perfil',
      en: 'My profile',
    },
    config: {
      es: 'Configuración',
      en: 'Settings',
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
      ticketsReporter: values.ticketsReporter[language],
      invoices: values.invoices[language],
      users: values.users[language],
      invitations: values.invitations[language],
      companies: values.companies[language],
      products: values.products[language],
      solutions: values.solutions[language],
      profile: values.profile[language],
      config: values.config[language],
      logout: values.logout[language],
    },
  });
};
