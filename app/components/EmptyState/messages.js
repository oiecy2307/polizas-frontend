/*
 * EmptyState Messages
 *
 * This contains all the text for the EmptyState component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.EmptyState';

export default language => {
  const values = {
    state: {
      es: 'No hay información disponible',
      en: 'No data available',
    },
  };
  return defineMessages({
    header: {
      id: `${scope}.header`,
      defaultMessage: 'This is the EmptyState component!',
    },
    state: values.state[language],
  });
};
