/**
 *
 * CreateEditUser
 *
 */

import React, { memo, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { GlobalValuesContext } from 'contexts/global-values';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { get } from 'lodash';

import { textRegex, trimObject } from 'utils/helper';
// eslint-disable-next-line import/named
import { wsUpdateUser, wCreateUser } from 'services/users';
import { wsUpdateProfileInfo } from 'services/profile';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';

import Dialog from 'components/Dialog';
import Form from './form';

import getMessages from './messages';

function CreateEditUser({
  open,
  onClose,
  callback,
  dispatch,
  userToEdit,
  fromProfile,
}) {
  const { language } = useContext(GlobalValuesContext);
  const [messages] = useState(getMessages(language));

  const isEditing = Boolean(userToEdit);

  async function handleCreateUser(values, resetValues) {
    try {
      const body = values;
      dispatch(aSetLoadingState(true));
      let response = null;
      if (fromProfile) {
        response = await wsUpdateProfileInfo(trimObject(body));
      } else if (isEditing) {
        response = await wsUpdateUser(userToEdit.id, trimObject(body));
      } else {
        response = await wCreateUser(trimObject(body));
      }
      if (response.error) {
        dispatch(aOpenSnackbar('Error al guardar el usuario', 'error'));
      } else {
        dispatch(aOpenSnackbar('Usuario guardado', 'success'));
        callback();
        onClose();
        resetValues();
      }
    } catch (e) {
      dispatch(aOpenSnackbar('Error al guardar el usuario', 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  }

  const defaultValues = {
    nombre: get(userToEdit, 'nombre', ''),
    apellidoPaterno: get(userToEdit, 'apellidoPaterno', ''),
    apellidoMaterno: get(userToEdit, 'apellidoMaterno', ''),
    email: get(userToEdit, 'email', ''),
    username: get(userToEdit, 'username', ''),
    password: '',
    role: get(userToEdit, 'role', ''),
  };

  const validationSchema = Yup.object({
    nombre: Yup.string(messages.fields.name)
      .trim()
      .required(messages.required)
      .max(100, messages.tooLong)
      .matches(textRegex, messages.invalidCharacters),
    apellidoPaterno: Yup.string(messages.fields.lastname)
      .trim()
      .required(messages.required)
      .max(100, messages.tooLong)
      .matches(textRegex, messages.invalidCharacters),
    apellidoMaterno: Yup.string(messages.fields.secondLastName)
      .trim()
      .max(100, messages.tooLong)
      .matches(textRegex, messages.invalidCharacters),
    email: Yup.string(messages.fields.email)
      .trim()
      .email(messages.emailError)
      .max(200, messages.tooLong)
      .required(messages.required),
    username: Yup.string(messages.fields.username)
      .required(messages.required)
      .max(150, messages.tooLong),
    password: Yup.string(messages.fields.password)
      .trim()
      [isEditing ? 'notRequired' : 'required'](messages.required)
      .min(8, messages.tooShort)
      .max(150, messages.tooLong),
    passwordConfirmation: Yup.string()
      .trim()
      [isEditing ? 'notRequired' : 'required'](messages.required)
      .oneOf([Yup.ref('password'), null], messages.passwordDontMatch),
    role: Yup.string(messages.fields.role)
      .trim()
      .required(messages.required)
      .max(150, messages.tooLong)
      .matches(textRegex, messages.invalidCharacters),
  });

  const dialogTitle = isEditing ? messages.title.edit : messages.title.create;

  if (!open) return <div style={{ display: 'none ' }} />;

  return (
    <Formik
      onSubmit={(values, actions) => {
        handleCreateUser(values, actions.resetForm);
      }}
      validationSchema={validationSchema}
      initialValues={defaultValues}
      render={p => (
        <Dialog
          onClose={() => {
            onClose();
            p.handleReset();
          }}
          title={dialogTitle}
          open={open}
          withActions
          negativeAction={messages.actions.cancel}
          positiveAction={messages.actions.save}
          onNegativeAction={() => {
            onClose();
            p.handleReset();
          }}
          onPositiveAction={() => p.handleSubmit(p.values)}
          disabled={!p.isValid || p.isSubmitting}
        >
          <Form
            {...p}
            disabled={false}
            isEditing={isEditing}
            fromProfile={fromProfile}
          />
        </Dialog>
      )}
    />
  );
}

CreateEditUser.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  callback: PropTypes.func,
  dispatch: PropTypes.func,
  userToEdit: PropTypes.object,
  fromProfile: PropTypes.bool,
};

export default memo(CreateEditUser);
