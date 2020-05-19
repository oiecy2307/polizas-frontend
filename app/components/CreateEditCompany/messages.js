/*
 * CreateEditCompany Messages
 *
 * This contains all the text for the CreateEditCompany component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.CreateEditCompany';

export default language => {
  const values = {
    required: {
      es: 'Campo requerido',
      en: 'Field required',
    },
    oldPassword: {
      es: 'Contraseña actual',
      en: 'Current password',
    },
    password: {
      es: 'Contraseña',
      en: 'Password',
    },
    passwordConfirmation: {
      es: 'Confirme contraseña',
      en: 'Confirm password',
    },
    tooLong: {
      es: 'Texto demasiado extenso',
      en: 'Text too long',
    },
    tooShort: {
      es: 'Contraseña muy corta',
      en: 'Password too short',
    },
    passwordDontMatch: {
      es: 'Las contraseñas no coinciden',
      en: 'Passwords must match',
    },
    save: {
      es: 'Guardar',
      en: 'Save',
    },
    cancel: {
      es: 'Cancelar',
      en: 'Cancel',
    },
  };

  return defineMessages({
    header: {
      id: `${scope}.header`,
      defaultMessage: 'This is the CreateEditCompany component!',
    },
    fields: {
      oldPassword: values.oldPassword[language],
      password: values.password[language],
      passwordConfirmation: values.passwordConfirmation[language],
    },
    required: values.required[language],
    tooLong: values.tooLong[language],
    tooShort: values.tooShort[language],
    passwordDontMatch: values.passwordDontMatch[language],
    actions: {
      save: values.save[language],
      cancel: values.cancel[language],
    },
  });
};
