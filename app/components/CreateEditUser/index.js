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
import { textRegex } from 'utils/helper';

import Dialog from 'components/Dialog';
import Form from './form';

import getMessages from './messages';

function CreateEditUser({ open, onClose }) {
  const { language } = useContext(GlobalValuesContext);
  const [messages] = useState(getMessages(language));

  const handleCreateUser = () => {
    console.log('CREATING');
  };

  const defaultValues = {
    name: '',
    lastname: '',
    secondLastName: '',
    email: '',
    username: '',
    password: '',
    role: '',
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
      .max(150, messages.tooLong)
      .matches(textRegex, messages.invalidCharacters),
    password: Yup.string(messages.fields.password)
      .required(messages.required)
      .max(150, messages.tooLong)
      .matches(textRegex, messages.invalidCharacters),
    role: Yup.string(messages.fields.role)
      .required(messages.required)
      .max(150, messages.tooLong)
      .matches(textRegex, messages.invalidCharacters),
  });

  const isEditing = false;
  const dialogTitle = isEditing ? messages.title.edit : messages.title.create;

  return (
    <Dialog
      onClose={onClose}
      title={dialogTitle}
      open={open}
      withActions
      negativeAction={messages.actions.cancel}
      positiveAction={messages.actions.save}
      onNegativeAction={onClose}
      onPositiveAction={handleCreateUser}
    >
      <Formik
        onSubmit={(values, actions) => {
          console.log('ONSUBMIT', values, actions);
        }}
        validationSchema={validationSchema}
        initialValues={defaultValues}
        render={p => <Form {...p} disabled={false} isEditing={isEditing} />}
      />
      Este es el juego de la oca que convoca...
    </Dialog>
  );
}

CreateEditUser.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
};

export default memo(CreateEditUser);
