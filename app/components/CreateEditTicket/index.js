/**
 *
 * CreateEditTicket
 *
 */

import React, { memo, useState, useContext, useEffect } from 'react';
import PropTypes from 'prop-types';
import { GlobalValuesContext } from 'contexts/global-values';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { get } from 'lodash';
import moment from 'moment/min/moment-with-locales';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import { wsCreateTicket } from 'services/tickets';
import { wsGetUsersByType } from 'services/users';
import { getCurrentUser, textRegex } from 'utils/helper';

import Dialog from 'components/Dialog';
import Form from './form';

import getMessages from './messages';

function CreateEditTicket({ open, onClose, callback, dispatch }) {
  const { language } = useContext(GlobalValuesContext);
  const [messages] = useState(getMessages(language));
  const [sTechnicals, setTechnicals] = useState([]);

  useEffect(() => {
    fetchUsers();
    moment.locale(language);
  }, []);

  async function fetchUsers() {
    try {
      dispatch(aSetLoadingState(true));
      const responseTechnicals = await wsGetUsersByType('technical');
      setTechnicals(
        get(responseTechnicals, 'data.rows', []).map(t => ({
          ...t,
          value: t.id,
          label: `${t.name} ${t.lastname} (${t.email})`,
        })),
      );
    } catch (e) {
      dispatch(aOpenSnackbar('Error al obtener usuarios', 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  }

  async function handleCreateTicket(body, resetValues) {
    try {
      dispatch(aSetLoadingState(true));
      const user = await getCurrentUser();
      const response = await wsCreateTicket({
        ...body,
        reporterId: user.id,
        description: body.ticketDescription,
        status: body.technicalId ? 'assigned' : 'new',
        reportedDate: moment(new Date(), 'DD-MM-YYYY').format(),
        shortName: body.ticketTitle,
        priority: body.ticketPriority,
      });
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
    // reporterId: '',
    technicalId: '',
    clientId: '',
    dueDate: '',
  };

  const validationSchema = Yup.object({
    ticketTitle: Yup.string(messages.fields.ticketTitle)
      .required(messages.required)
      .max(150, messages.tooLong),
    ticketDescription: Yup.string(messages.fields.ticketDescription)
      .required(messages.required)
      .max(150, messages.tooLong),
    ticketPriority: Yup.string(messages.fields.ticketPriority)
      .required(messages.required)
      .max(150, messages.tooLong)
      .matches(textRegex, messages.invalidCharacters),
    // reporterId: Yup.number().required(messages.required),
    technicalId: Yup.number(),
    clientId: Yup.number(),
    dueDate: Yup.date()
      .required(messages.required)
      .min(moment(new Date(), 'DD-MM-YYYY').format(), messages.errorDate),
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
          <Form
            {...p}
            disabled={false}
            isEditing={isEditing}
            technicals={sTechnicals}
          />
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
