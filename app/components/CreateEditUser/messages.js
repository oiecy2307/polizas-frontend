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
    role: {
      es: 'Rol',
      en: 'Role',
    },
    required: {
      es: 'Campo requerido',
      en: 'Field required',
    },
    invalidCharacters: {
      es: 'Solo texto',
      en: 'Only text',
    },
    tooLong: {
      es: 'Texto demasiado extenso',
      en: 'Text too long',
    },
    emailError: {
      es: 'Correo no válido',
      en: 'Not valid email',
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
      role: values.role[language],
    },
    required: values.required[language],
    invalidCharacters: values.invalidCharacters[language],
    tooLong: values.tooLong[language],
    emailError: values.emailError[language],
  });
};
