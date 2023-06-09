/**
 *
 * CloseTicketDialog
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { Formik } from 'formik';
import * as Yup from 'yup';
import moment from 'moment/min/moment-with-locales';
import { get } from 'lodash';

import { wsCloseTicket } from 'services/tickets';
import { wsGetTicketCosts } from 'services/instances';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import { trimObject, dateFormatToServer } from 'utils/helper';

import Dialog from 'components/Dialog';
import Form from './form';

import messages from './messages';

function CloseTicketDialog({ open, onClose, dispatch, id, time }) {
  const [hourCost, setHourCost] = useState(0);
  const [halfHourCost, setHalfHourCost] = useState(0);
  const [quaterHourCost, setQuaterHourCost] = useState(0);

  useEffect(() => {
    fetchCosts();
  }, []);

  const fetchCosts = async () => {
    try {
      dispatch(aSetLoadingState(true));
      const response = await wsGetTicketCosts();
      if (response) {
        setHourCost(get(response, 'data.hour', 0));
        setHalfHourCost(get(response, 'data.halfHour', 0));
        setQuaterHourCost(get(response, 'data.fraction', 0));
      }
    } finally {
      dispatch(aSetLoadingState(false));
    }
  };

  async function handleCloseTicket(body, resetValues) {
    try {
      dispatch(aSetLoadingState(true));
      const finalBody = {
        ...body,
        finishedDate: moment(body.finishedDate).format(dateFormatToServer),
      };
      const response = await wsCloseTicket(id, trimObject(finalBody));
      if (response.error) {
        dispatch(aOpenSnackbar('No se pudo cerrar el ticket', 'error'));
      } else {
        dispatch(aOpenSnackbar('Ticket cerrado', 'success'));
      }
      resetValues();
      onClose(!response.error);
    } catch (e) {
      dispatch(aOpenSnackbar('No se pudo cerrar el ticket', 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  }

  let cost = 0;

  if (time) {
    cost += parseInt(time / 3600, 10) * hourCost;
    const minutes = parseInt((time % 3600) / 60, 10);
    if (minutes > 15) {
      cost += halfHourCost;
    }
    if (minutes > 45) {
      cost += quaterHourCost;
    }
  }

  const defaultValues = {
    finishedDate: moment(new Date(), 'DD-MM-YYYY').format(),
    timeNeeded: time ? parseInt(time / 60, 10) : '',
    cost: cost || '',
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
    status: Yup.string().trim(),
  });

  if (!open) return <div />;

  return (
    <Formik
      onSubmit={(values, actions) => {
        handleCloseTicket(values, actions.resetForm);
      }}
      validationSchema={validationSchema}
      initialValues={defaultValues}
      isInitialValid={Boolean(defaultValues.timeNeeded && defaultValues.cost)}
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
  time: PropTypes.number,
};

export default memo(CloseTicketDialog);
