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
import { wsCreateTicket, wsUpdateTicket } from 'services/tickets';
import { wsGetUsersByType } from 'services/users';
import { getCurrentUser, textRegex } from 'utils/helper';

import FormikDebugger from 'components/FormikDebugger';
import Dialog from 'components/Dialog';
import Form from './form';

import getMessages from './messages';

function CreateEditTicket({
  open,
  onClose,
  callback,
  dispatch,
  isClient,
  ticketToEdit,
}) {
  const { language } = useContext(GlobalValuesContext);
  const [messages] = useState(getMessages(language));
  const [sTechnicals, setTechnicals] = useState([]);
  const [sClients, setClients] = useState([]);

  const isEditing = Boolean(ticketToEdit);

  useEffect(() => {
    if (!isClient) fetchUsers();
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
      const responseClients = await wsGetUsersByType('client');
      setClients(
        get(responseClients, 'data.rows', []).map(t => ({
          ...t,
          value: t.id,
          label: `${t.name} ${t.lastname} (${get(t, 'company.name', '')})`,
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
      const bodyAdmin = {
        ...body,
        reporterId: user.id,
        description: body.ticketDescription,
        clientId: body.clientId,
        status: body.technicalId ? 'assigned' : 'new',
        reportedDate: moment(new Date(), 'DD-MM-YYYY').format(),
        shortName: body.ticketTitle,
        priority: body.ticketPriority,
        evidence: body.evidence,
      };
      const bodyClient = {
        reporterId: user.id,
        clientId: user.id,
        description: body.ticketDescription,
        status: 'new',
        priority: body.ticketPriority,
        reportedDate: moment(new Date(), 'DD-MM-YYYY').format(),
        dueDate: moment(new Date(), 'DD-MM-YYYY').format(),
        shortName: body.ticketTitle,
        evidence: body.evidence,
      };
      const finalBody = isClient ? bodyClient : bodyAdmin;
      let response = null;
      if (isEditing) {
        response = await wsUpdateTicket(ticketToEdit.id, finalBody);
      } else {
        response = await wsCreateTicket(finalBody);
      }
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
    ticketTitle: get(ticketToEdit, 'shortName', ''),
    ticketDescription: get(ticketToEdit, 'description', ''),
    ticketPriority: get(ticketToEdit, 'priority', ''),
    technicalId: get(ticketToEdit, 'technicalId', ''),
    clientId: get(ticketToEdit, 'clientId', ''),
    dueDate: null,
    evidence: [],
  };

  const schemaAdmin = Yup.object({
    ticketTitle: Yup.string(messages.fields.ticketTitle)
      .required(messages.required)
      .max(150, messages.tooLong),
    ticketDescription: Yup.string(messages.fields.ticketDescription)
      .required(messages.required)
      .max(5000, messages.tooLong),
    ticketPriority: Yup.string(messages.fields.ticketPriority)
      .required(messages.required)
      .max(150, messages.tooLong)
      .matches(textRegex, messages.invalidCharacters),
    technicalId: Yup.number(),
    clientId: Yup.number(),
    dueDate: Yup.date().when('clientId', {
      is: () => isEditing,
      then: Yup.date().required(messages.required),
      otherwise: Yup.date()
        .required(messages.required)
        .typeError(messages.required)
        .min(
          moment(new Date(), 'DD-MM-YYYY')
            .add(-1, 'days')
            .format(),
          messages.errorDate,
        ),
    }),
    evidence: Yup.array(),
  });

  const schemaClient = Yup.object({
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
  });

  const validationSchema = isClient ? schemaClient : schemaAdmin;

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
            clients={sClients}
            isClient={isClient}
            dispatch={dispatch}
            defaultEvidence={get(ticketToEdit, 'evidence', [])}
          />
          {false && <FormikDebugger />}
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
  isClient: PropTypes.bool,
  ticketToEdit: PropTypes.object,
};

CreateEditTicket.defaultProps = {
  isClient: true,
};

export default memo(CreateEditTicket);
