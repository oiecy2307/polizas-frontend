/*
 * CreateEditTicket Messages
 *
 * This contains all the text for the CreateEditTicket component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.CreateEditTicket';

export default language => {
  const values = {
    titleNew: {
      es: 'Crear nuevo ticket',
      en: 'Create new ticket',
    },
    titleEdit: {
      es: 'Editar ticket',
      en: 'Edit ticket',
    },
    save: {
      es: 'Guardar',
      en: 'Save',
    },
    cancel: {
      es: 'Cancelar',
      en: 'Cancel',
    },
    ticketTitle: {
      es: 'Título del problema',
      en: 'Problem title',
    },
    ticketDescription: {
      es: 'Descripción problema',
      en: 'Problem description',
    },
    ticketPriority: {
      es: 'Nivel de urgencia',
      en: 'Priority level',
    },
    required: {
      es: 'Campo requerido',
      en: 'Field required',
    },
    invalidCharacters: {
      es: 'Caracteres no válidos',
      en: 'Text invalid',
    },
    tooLong: {
      es: 'Texto demasiado extenso',
      en: 'Text too long',
    },
    selectPriorityLevel: {
      es: 'Selecciona el nivel de urgencia',
      en: 'Select the priority level',
    },
    highLevel: {
      es: 'Nivel alto',
      en: 'High level',
    },
    mediumLevel: {
      es: 'Nivel medio',
      en: 'Medium level',
    },
    lowLevel: {
      es: 'Nivel bajo',
      en: 'Low level',
    },
  };

  return defineMessages({
    header: {
      id: `${scope}.header`,
      defaultMessage: 'This is the CreateEditTicket component!',
    },
    title: {
      create: values.titleNew[language],
      edit: values.titleEdit[language],
    },
    actions: {
      save: values.save[language],
      cancel: values.cancel[language],
    },
    fields: {
      ticketTitle: values.ticketTitle[language],
      ticketDescription: values.ticketDescription[language],
      ticketPriority: values.ticketPriority[language],
    },
    required: values.required[language],
    invalidCharacters: values.invalidCharacters[language],
    tooLong: values.tooLong[language],
    selectPriorityLevel: values.selectPriorityLevel[language],
    levels: {
      highLevel: values.highLevel[language],
      mediumLevel: values.mediumLevel[language],
      lowLevel: values.lowLevel[language],
    },
  });
};
