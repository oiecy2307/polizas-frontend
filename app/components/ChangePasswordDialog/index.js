/**
 *
 * ChangePasswordDialog
 *
 */

import React, { memo, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { GlobalValuesContext } from 'contexts/global-values';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { get } from 'lodash';
import { ImmortalDB } from 'immortal-db';

import { wsGetUserInfo } from 'services/auth';
import { wsChangePassword } from 'services/profile';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';

import Dialog from 'components/Dialog';
import Form from './form';

import getMessages from './messages';

function ChangePasswordDialog({ open, onClose, callback, dispatch }) {
  const { language } = useContext(GlobalValuesContext);
  const [messages] = useState(getMessages(language));

  async function handleChangePassword(values, resetValues) {
    try {
      const body = {
        previusPassword: values.oldPassword,
        newPassword: values.password,
      };
      dispatch(aSetLoadingState(true));
      const response = await wsChangePassword(body);
      if (response.error) {
        dispatch(aOpenSnackbar('Error al cambiar contraseña', 'error'));
      } else {
        const responseUserInfo = await wsGetUserInfo();

        const newData = responseUserInfo.data;
        if (responseUserInfo) {
          await ImmortalDB.set('user', JSON.stringify(newData));
        }
        dispatch(aOpenSnackbar('Contraseña cambiada con éxito', 'success'));
        callback();
        onClose();
        resetValues();
      }
    } catch (e) {
      const errorMessage = get(
        e,
        'data.message',
        'Error al cambiar contraseña',
      );
      dispatch(aOpenSnackbar(errorMessage, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  }

  const defaultValues = {
    oldPassword: '',
    password: '',
  };

  const validationSchema = Yup.object({
    oldPassword: Yup.string(messages.fields.oldPassword)
      .required(messages.required)
      .min(8, messages.tooShort)
      .max(150, messages.tooLong),
    password: Yup.string(messages.fields.password)
      .required(messages.required)
      .min(8, messages.tooShort)
      .max(150, messages.tooLong),
    passwordConfirmation: Yup.string()
      .required(messages.required)
      .oneOf([Yup.ref('password'), null], messages.passwordDontMatch),
  });

  const dialogTitle = 'Cambiar contraseña';

  if (!open) return <div style={{ display: 'none ' }} />;

  return (
    <Formik
      onSubmit={(values, actions) => {
        handleChangePassword(values, actions.resetForm);
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
          <Form {...p} disabled={false} />
        </Dialog>
      )}
    />
  );
}

ChangePasswordDialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  callback: PropTypes.func,
  dispatch: PropTypes.func,
};

export default memo(ChangePasswordDialog);
