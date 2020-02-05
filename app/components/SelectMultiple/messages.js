/*
 * Dialog Messages
 *
 * This contains all the text for the Dialog component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.containers.Agenda.DisableDayDialog.Dialog';

export default defineMessages({
  empty: 'Primero necesitas seleccionar el o los barrios a filtrar',
  casasClub: 'Primero necesitas seleccionar el o los barrios a filtrar',
  areas:
    'Primero necesitas seleccionar el(los) barrios y la(s) casas club a filtrar',
});
