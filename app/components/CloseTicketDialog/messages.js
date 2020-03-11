/*
 * CloseTicketDialog Messages
 *
 * This contains all the text for the CloseTicketDialog component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.CloseTicketDialog';

export default defineMessages({
  header: {
    id: `${scope}.header`,
    defaultMessage: 'This is the CloseTicketDialog component!',
  },
  required: 'Este campo es requerido',
});
