/**
 *
 * PayTicketDialog
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment/min/moment-with-locales';
import { get } from 'lodash';

import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import { wsPayTicket } from 'services/tickets';

import Dialog from 'components/Dialog';
import Form from './form';

function PayTicketDialog({ open, onClose, dispatch, id, defaultTicket }) {
  const handlePayTicket = async (body, resetValues) => {
    try {
      dispatch(aSetLoadingState(true));
      const response = await wsPayTicket(id, body);
      if (response.error) {
        dispatch(aOpenSnackbar('No se pudo pagar el ticket', 'error'));
      } else {
        dispatch(aOpenSnackbar('Cambios guardados', 'success'));
      }
      resetValues();
      onClose(!response.error);
    } catch (e) {
      dispatch(aOpenSnackbar('No se pudo pagar el ticket', 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  };

  const defaultValues = {
    paid: get(defaultTicket, 'paid', false),
    paidDate: moment(
      get(defaultTicket, 'paidDate', new Date()) || new Date(),
      'DD-MM-YYYY',
    ).format(),
    totalPaid: get(defaultTicket, 'totalPaid', '') || '',
    invoice: get(defaultTicket, 'Invoice', '') || '',
  };

  const validationSchema = Yup.object({
    paid: Yup.boolean().required('Campo requerido'),
    paidDate: Yup.date().when('paid', {
      is: paid => paid,
      then: Yup.date().required('Campo requerido'),
      otherwise: Yup.date(),
    }),
    totalPaid: Yup.number().when('paid', {
      is: paid => paid,
      then: Yup.number()
        .typeError('Solo se permiten números')
        .required('Campo requerido')
        .positive('El tiempo debe ser positivo'),
      otherwise: Yup.number()
        .typeError('Solo se permiten números')
        .positive('El tiempo debe ser positivo'),
    }),
    invoice: Yup.string(),
  });

  return (
    <Formik
      onSubmit={(values, actions) => {
        handlePayTicket(values, actions.resetForm);
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
          title="Pagar ticket"
          withActions
          positiveAction="Pagar"
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

PayTicketDialog.propTypes = {
  open: PropTypes.bool,
  dispatch: PropTypes.func,
  id: PropTypes.string,
  onClose: PropTypes.func,
  defaultTicket: PropTypes.object,
};

export default memo(PayTicketDialog);
