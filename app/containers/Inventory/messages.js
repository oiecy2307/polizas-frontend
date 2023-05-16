/*
 * Inventory Messages
 *
 * This contains all the text for the Inventory container.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.Inventory';

export default language => {
  const values = {
    name: {
      es: 'nombre',
      en: 'Name',
    },
    sku: {
      es: 'sku',
      en: 'sku',
    },
    cantidad: {
      es: 'cantidad',
      en: 'quantity',
    },
  };
  return defineMessages({
    header: {
      id: `${scope}.header`,
      defaultMessage: 'This is the Inventory container!',
    },
    table: {
      name: values.name[language],
      sku: values.sku[language],
      cantidad: values.cantidad[language],
    },
  });
};
