/*
 * CreateEditPoliza Messages
 *
 * This contains all the text for the CreateEditPoliza component.
 */

import { defineMessages } from 'react-intl';

export const scope = 'app.components.CreateEditPoliza';

export default language => {
  const values = {
    titleNew: {
      es: 'Nueva Poliza',
      en: 'New Invoice',
    },
    titleEdit: {
      es: 'Editar poliza',
      en: 'Editing invoice',
    },
    save: {
      es: 'Guardar',
      en: 'Save',
    },
    cancel: {
      es: 'Cancelar',
      en: 'Cancel',
    },
    empleadoGenero: {
      es: 'Genero',
      en: 'Gender',
    },
    productoSku: {
      es: 'sku',
      en: 'sku',
    },
    cantidad: {
      es: 'cantidad',
      en: 'quantity',
    },
    fecha: {
      es: 'Fecha',
      en: 'date',
    },
    nombre: {
      es: 'Nombre',
      en: 'name',
    },
    inventoryId: {
      es: 'Producto asignado',
      en: 'Assigned product',
    },
    userId: {
      es: 'Usuario',
      en: 'user',
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
    isNotNumber: {
      es: 'Número no válido',
      en: 'Not valid number',
    },
    emailError: {
      es: 'Correo no válido',
      en: 'Not valid email',
    },
    passwordDontMatch: {
      es: 'Las contraseñas no coinciden',
      en: 'Passwords must match',
    },
    admin: {
      es: 'Administrador',
      en: 'Administrator',
    },
    salesman: {
      es: 'vendedor',
      en: 'Sales',
    },
  };

  return defineMessages({
    header: {
      id: `${scope}.header`,
      defaultMessage: 'This is the CreateEditPoliza component!',
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
      empleadoGenero: values.empleadoGenero[language],
      productoSku: values.productoSku[language],
      cantidad: values.cantidad[language],
      fecha: values.fecha[language],
      nombre: values.nombre[language],
      inventoryId: values.inventoryId[language],
      userId: values.userId[language],
      // password: values.password[language],
      // passwordConfirmation: values.passwordConfirmation[language],
      // role: values.role[language],
      // phoneNumber: values.phoneNumber[language],
      // company: values.company[language],
    },
    required: values.required[language],
    invalidCharacters: values.invalidCharacters[language],
    tooLong: values.tooLong[language],
    tooShort: values.tooShort[language],
    isNotNumber: values.isNotNumber[language],
    emailError: values.emailError[language],
    passwordDontMatch: values.passwordDontMatch[language],
    roles: {
      admin: values.admin[language],
      salesman: values.salesman[language],
    },
  });
};
