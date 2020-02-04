/*
 * CreateEditUser Messages
 *
 * This contains all the text for the CreateEditUser component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.CreateEditUser';

export default language => {
  const values = {
    titleNew: {
      es: 'Nuevo usuario',
      en: 'New user',
    },
    titleEdit: {
      es: 'Editar usuario',
      en: 'Editing user',
    },
    save: {
      es: 'Guardar',
      en: 'Save',
    },
    cancel: {
      es: 'Cancelar',
      en: 'Cancel',
    },
    name: {
      es: 'Nombre',
      en: 'Name',
    },
    lastname: {
      es: 'Apellido paterno',
      en: 'First lastname',
    },
    secondLastName: {
      es: 'Apellido materno',
      en: 'Second lastname',
    },
    email: {
      es: 'Correo electrónico',
      en: 'Email',
    },
    username: {
      es: 'Nombre de usuario',
      en: 'Username',
    },
    password: {
      es: 'Contraseña',
      en: 'Password',
    },
    passwordConfirmation: {
      es: 'Confirme contraseña',
      en: 'Confirm password',
    },
    role: {
      es: 'Rol',
      en: 'Role',
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
    tooShort: {
      es: 'Contraseña muy corta',
      en: 'Password too short',
    },
    emailError: {
      es: 'Correo no válido',
      en: 'Not valid email',
    },
    passwordDontMatch: {
      es: 'Las contraseñas no coinciden',
      en: 'Passwords must match',
    },
  };

  return defineMessages({
    header: {
      id: `${scope}.header`,
      defaultMessage: 'This is the CreateEditUser component!',
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
      name: values.name[language],
      lastname: values.lastname[language],
      secondLastName: values.secondLastName[language],
      email: values.email[language],
      username: values.username[language],
      password: values.password[language],
      passwordConfirmation: values.passwordConfirmation[language],
      role: values.role[language],
    },
    required: values.required[language],
    invalidCharacters: values.invalidCharacters[language],
    tooLong: values.tooLong[language],
    tooShort: values.tooShort[language],
    emailError: values.emailError[language],
    passwordDontMatch: values.passwordDontMatch[language],
  });
};
