/**
 *
 * CloseTicketDialog
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment/min/moment-with-locales';
import { wsCloseTicket } from 'services/tickets';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';

import Dialog from 'components/Dialog';
import Form from './form';

import messages from './messages';

function CloseTicketDialog({ open, onClose, dispatch, id }) {
  async function handleCloseTicket(body, resetValues) {
    try {
      dispatch(aSetLoadingState(true));
      const response = await wsCloseTicket(id, body);
      if (response.error) {
        dispatch(aOpenSnackbar('No se pudo cerrar el ticket', 'error'));
      } else {
        dispatch(aOpenSnackbar('Ticket cerrado', 'success'));
      }
      resetValues();
      onClose(!response.error);
    } catch (e) {
      dispatch(aOpenSnackbar('', 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  }

  const defaultValues = {
    finishedDate: moment(new Date(), 'DD-MM-YYYY').format(),
    timeNeeded: '',
    cost: '',
    solution: '',
    status: 'finished',
  };

  const validationSchema = Yup.object({
    finishedDate: Yup.date()
      .required(messages.required)
      .min(
        moment(new Date(), 'DD-MM-YYYY')
          .add(-1, 'days')
          .format(),
        messages.errorDate,
      ),
    timeNeeded: Yup.number()
      .typeError('Solo se permiten números')
      .required(messages.required)
      .integer('Solo se permiten números enteros')
      .positive('El tiempo debe ser positivo'),
    cost: Yup.number()
      .typeError('Solo se permiten números')
      .required(messages.required)
      .positive('El costo debe ser positivo'),
    solution: Yup.string(),
    status: Yup.string(),
  });

  return (
    <Formik
      onSubmit={(values, actions) => {
        handleCloseTicket(values, actions.resetForm);
      }}
      validationSchema={validationSchema}
      initialValues={defaultValues}
      render={p => (
        <Dialog
          open={open}
          onClose={() => {
            onClose(false);
            p.handleReset();
          }}
          title="Finalizar ticket"
          withActions
          positiveAction="Cerrar"
          onNegativeAction={() => {
            onClose(false);
            p.handleReset();
          }}
          onPositiveAction={() => p.handleSubmit(p.values)}
          disabled={!p.isValid || p.isSubmitting}
        >
          <Form {...p} />
        </Dialog>
      )}
    />
  );
}

CloseTicketDialog.propTypes = {
  open: PropTypes.bool,
  dispatch: PropTypes.func,
  id: PropTypes.string,
  onClose: PropTypes.func,
};

export default memo(CloseTicketDialog);
