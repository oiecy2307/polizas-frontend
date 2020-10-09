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
import { wsGetUsersByType, wsGetAllClients } from 'services/users';
import {
  getCurrentUser,
  textRegex,
  trimObject,
  dateFormatToServer,
  formatToFolio,
} from 'utils/helper';

import FormikDebugger from 'components/FormikDebugger';
import CreateEditCompany from 'components/CreateEditCompany';
import Dialog from 'components/Dialog';
import Form from './form';

import getMessages from './messages';

const getEditTitle = (text, folio) => {
  try {
    return `${text} (#${formatToFolio(folio)})`;
  } catch (e) {
    return text;
  }
};

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
  const [sFormCompanyOpen, setFormCompanyOpen] = useState(false);
  const [sAnchorEl, setAnchorEl] = useState(null);

  const isEditing = Boolean(ticketToEdit);

  const isClosed = get(ticketToEdit, 'status', '') === 'closed';

  useEffect(() => {
    if (!isClient) fetchUsers();
    moment.locale(language);
  }, []);

  async function fetchUsers() {
    try {
      dispatch(aSetLoadingState(true));
      const responseTechnicals = await wsGetUsersByType(
        'technical-admin',
        0,
        9999,
        '',
      );
      setTechnicals(
        get(responseTechnicals, 'data.rows', []).map(t => ({
          ...t,
          value: t.id,
          label: `${t.name} ${t.lastname} (${t.email})`,
        })),
      );
      const responseClients = await wsGetAllClients();
      setClients(
        get(responseClients, 'data', []).map(t => ({
          ...t,
          value: t.id,
          label: t.isFakeUser
            ? t.name
            : `${t.name} ${t.lastname} (${get(t, 'company.name', '')})`,
        })),
      );
    } catch (e) {
      dispatch(aOpenSnackbar('Error al obtener usuarios', 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  }

  async function handleCreateTicket(body, { resetForm, setSubmitting }) {
    try {
      dispatch(aSetLoadingState(true));
      const user = await getCurrentUser();
      const bodyAdmin = {
        ...body,
        reporterId: user.id,
        description: body.ticketDescription,
        clientId: body.clientId,
        status: body.technicalId ? 'assigned' : 'new',
        reportedDate: moment(body.reportedDate).format(dateFormatToServer),
        shortName: body.ticketTitle,
        priority: body.ticketPriority,
        evidence: body.evidence,
      };
      const bodyClient = {
        reporterId: user.id,
        clientId: user.id,
        description: body.ticketDescription,
        status: 'new',
        priority: null,
        reportedDate: moment().format(dateFormatToServer),
        shortName: body.ticketTitle,
        evidence: body.evidence,
      };
      const finalBody = isClient ? bodyClient : bodyAdmin;
      let response = null;
      if (isEditing) {
        response = await wsUpdateTicket(ticketToEdit.id, trimObject(finalBody));
      } else {
        response = await wsCreateTicket(trimObject(finalBody));
      }
      if (response.error) {
        dispatch(aOpenSnackbar('Error al guardar ticket', 'error'));
      } else {
        dispatch(aOpenSnackbar('Ticket guardado', 'success'));
        callback();
        onClose();
        resetForm();
      }
    } catch (e) {
      dispatch(aOpenSnackbar('Error al guardar ticket', 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
      setSubmitting(false);
    }
  }

  const paidDate = get(ticketToEdit, 'paidDate', null);

  const defaultValues = {
    ticketTitle: get(ticketToEdit, 'shortName', ''),
    ticketDescription: get(ticketToEdit, 'description', ''),
    ticketPriority: get(ticketToEdit, 'priority', '') || 'new',
    technicalId: get(ticketToEdit, 'technicalId', '') || '',
    clientId: get(ticketToEdit, 'clientId', ''),
    reportedDate: get(ticketToEdit, 'reportedDate', null),
    evidence: [],
    timeNeeded: get(ticketToEdit, 'timeNeeded', '') || '',
    cost: get(ticketToEdit, 'cost', '') || '',
    invoice: get(ticketToEdit, 'invoice', '') || '',
    paid: get(ticketToEdit, 'paid', false),
    totalPaid: get(ticketToEdit, 'totalPaid', '') || '',
    paidDate: paidDate ? moment(paidDate, 'DD-MM-YYYY').format() : null,
  };

  const schemaAdmin = Yup.object({
    ticketTitle: Yup.string(messages.fields.ticketTitle)
      .trim()
      .required(messages.required)
      .max(255, messages.tooLong),
    ticketDescription: Yup.string(messages.fields.ticketDescription)
      .trim()
      .required(messages.required)
      .max(10000, messages.tooLong),
    ticketPriority: Yup.string(messages.fields.ticketPriority)
      .trim()
      .required(messages.required)
      .max(150, messages.tooLong)
      .matches(textRegex, messages.invalidCharacters),
    technicalId: Yup.number(),
    clientId: Yup.number().required(messages.required),
    reportedDate: Yup.date().when('clientId', {
      is: () => isEditing,
      then: Yup.date()
        .required(messages.required)
        .typeError(messages.required),
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
    timeNeeded: Yup.number()
      .typeError('Solo se permiten números')
      [isClosed ? 'required' : 'notRequired'](messages.required)
      .integer('Solo se permiten números enteros')
      .positive('El tiempo debe ser positivo'),
    cost: Yup.number()
      .typeError('Solo se permiten números')
      [isClosed ? 'required' : 'notRequired'](messages.required)
      .positive('El costo debe ser positivo'),
    invoice: Yup.string()
      .trim()
      .max(255, messages.tooLong),
    paid: Yup.boolean().notRequired(),
    paidDate: Yup.date().when('paid', {
      is: paid => paid,
      then: Yup.date()
        .required('Campo requerido')
        .typeError('Campo requerido'),
      otherwise: Yup.string()
        .notRequired()
        .typeError('Fecha no válida'),
    }),
    totalPaid: Yup.number().when('paid', {
      is: paid => paid,
      then: Yup.number()
        .typeError('Solo se permiten números')
        .required('Campo requerido')
        .positive('El tiempo debe ser positivo'),
      otherwise: Yup.number()
        .typeError('Solo se permiten números')
        .notRequired()
        .positive('El tiempo debe ser positivo'),
    }),
  });

  const schemaClient = Yup.object({
    ticketTitle: Yup.string(messages.fields.ticketTitle)
      .trim()
      .required(messages.required)
      .max(150, messages.tooLong),
    ticketDescription: Yup.string(messages.fields.ticketDescription)
      .trim()
      .required(messages.required)
      .max(150, messages.tooLong),
    ticketPriority: Yup.string(messages.fields.ticketPriority)
      .trim()
      .required(messages.required)
      .max(150, messages.tooLong)
      .matches(textRegex, messages.invalidCharacters),
  });

  const validationSchema = isClient ? schemaClient : schemaAdmin;

  const dialogTitle = isEditing
    ? getEditTitle(messages.title.edit, ticketToEdit.number)
    : messages.title.create;

  return (
    <React.Fragment>
      <Formik
        onSubmit={(values, actions) => {
          handleCreateTicket(values, actions);
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
              isClosed={isClosed}
              onCreateCompany={ref => {
                setAnchorEl(ref);
                setFormCompanyOpen(true);
              }}
            />
            {false && <FormikDebugger />}
          </Dialog>
        )}
      />
      <CreateEditCompany
        open={sFormCompanyOpen}
        onClose={() => setFormCompanyOpen(false)}
        callback={fetchUsers}
        dispatch={dispatch}
        usePopover
        anchorEl={sAnchorEl}
      />
    </React.Fragment>
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
