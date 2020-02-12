/**
 *
 * CreateEditTicket
 *
 */

import React, { memo, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { GlobalValuesContext } from 'contexts/global-values';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { textRegex } from 'utils/helper';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import { wsCreateTicket } from 'services/tickets';

import Dialog from 'components/Dialog';
import Form from './form';

import getMessages from './messages';

function CreateEditTicket({ open, onClose, callback, dispatch }) {
  const { language } = useContext(GlobalValuesContext);
  const [messages] = useState(getMessages(language));

  async function handleCreateTicket(body, resetValues) {
    try {
      dispatch(aSetLoadingState(true));
      const response = await wsCreateTicket(body);
      if (response.error) {
        dispatch(aOpenSnackbar('Error al guardar ticket', 'error'));
      } else {
        dispatch(aOpenSnackbar('Ticket guardado', 'success'));
        callback();
        onClose();
        resetValues();
      }
    } catch (e) {
      dispatch(aOpenSnackbar('Error al guardar ticket', 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  }

  const defaultValues = {
    ticketTitle: '',
    ticketDescription: '',
    ticketPriority: '',
    reporterId: '',
    technicalId: '',
    clientId: '',
    dueDate: '',
  };

  const validationSchema = Yup.object({
    ticketTitle: Yup.string(messages.fields.ticketTitle)
      .required(messages.required)
      .max(150, messages.tooLong)
      .matches(textRegex, messages.invalidCharacters),
    ticketDescription: Yup.string(messages.fields.ticketDescription)
      .required(messages.required)
      .max(150, messages.tooLong)
      .matches(textRegex, messages.invalidCharacters),
    ticketPriority: Yup.string(messages.fields.ticketPriority)
      .required(messages.required)
      .max(150, messages.tooLong)
      .matches(textRegex, messages.invalidCharacters),
    reporterId: Yup.number().required(messages.required),
    technicalId: Yup.number().required(messages.required),
    clientId: Yup.number(),
    dueDate: Yup.date()
      .required(messages.required)
      .min(new Date()),
  });

  const isEditing = false;
  const dialogTitle = isEditing ? messages.title.edit : messages.title.create;

  return (
    <Formik
      onSubmit={(values, actions) => {
        handleCreateTicket(values, actions.resetForm);
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

CreateEditTicket.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  callback: PropTypes.func,
  dispatch: PropTypes.func,
};

export default memo(CreateEditTicket);
