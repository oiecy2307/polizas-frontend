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

import { textRegex } from 'utils/helper';
import { wRegister } from 'services/auth';
import { wsUpdateUser } from 'services/users';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';

import Dialog from 'components/Dialog';
import Form from './form';

import getMessages from './messages';

function CreateEditUser({ open, onClose, callback, dispatch, userToEdit }) {
  const { language } = useContext(GlobalValuesContext);
  const [messages] = useState(getMessages(language));

  const isEditing = Boolean(userToEdit);

  async function handleCreateUser(values, resetValues) {
    try {
      const body = values;
      dispatch(aSetLoadingState(true));
      let response = null;
      if (isEditing) {
        response = await wsUpdateUser(userToEdit.id, body);
      } else {
        response = await wRegister(body);
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
    name: get(userToEdit, 'name', ''),
    lastname: get(userToEdit, 'lastname', ''),
    secondLastName: get(userToEdit, 'secondLastName', ''),
    email: get(userToEdit, 'email', ''),
    username: get(userToEdit, 'username', ''),
    password: '',
    role: get(userToEdit, 'role', ''),
    company: get(userToEdit, 'company', ''),
    phoneNumber: get(userToEdit, 'phoneNumber', ''),
  };

  const validationSchema = Yup.object({
    name: Yup.string(messages.fields.name)
      .required(messages.required)
      .max(150, messages.tooLong)
      .matches(textRegex, messages.invalidCharacters),
    lastname: Yup.string(messages.fields.lastname)
      .required(messages.required)
      .max(150, messages.tooLong)
      .matches(textRegex, messages.invalidCharacters),
    secondLastName: Yup.string(messages.fields.secondLastName)
      .max(150, messages.tooLong)
      .matches(textRegex, messages.invalidCharacters),
    email: Yup.string(messages.fields.email)
      .email(messages.emailError)
      .max(200, messages.tooLong)
      .required(messages.required),
    username: Yup.string(messages.fields.username)
      .required(messages.required)
      .max(150, messages.tooLong),
    password: Yup.string(messages.fields.password)
      [isEditing ? 'notRequired' : 'required'](messages.required)
      .min(8, messages.tooShort)
      .max(150, messages.tooLong),
    passwordConfirmation: Yup.string()
      [isEditing ? 'notRequired' : 'required'](messages.required)
      .oneOf([Yup.ref('password'), null], messages.passwordDontMatch),
    role: Yup.string(messages.fields.role)
      .required(messages.required)
      .max(150, messages.tooLong)
      .matches(textRegex, messages.invalidCharacters),
    company: Yup.string(messages.fields.role)
      .max(150, messages.tooLong)
      .matches(textRegex, messages.invalidCharacters),
    phoneNumber: Yup.number(messages.fields.role)
      .typeError(messages.isNotNumber)
      .max(9999999999999999, messages.tooLong),
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
          <Form {...p} disabled={false} isEditing={isEditing} />
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
};

export default memo(CreateEditUser);
