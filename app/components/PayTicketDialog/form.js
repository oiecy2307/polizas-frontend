/**
 *
 * PayTicketForm
 *
 */

import React, { memo, useContext } from 'react';
import PropTypes from 'prop-types';
import { GlobalValuesContext } from 'contexts/global-values';
import moment from 'moment/min/moment-with-locales';
import { Field } from 'formik';

import Input from 'components/InputText';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import Datepicker from 'components/Datepicker';
import { Divider } from 'utils/globalStyledComponents';

import { Form } from './styledComponents';

function PayTicketForm(props) {
  const {
    values,
    touched,
    errors,
    setFieldValue,
    setFieldTouched,
    cost,
  } = props;
  const { language } = useContext(GlobalValuesContext);
  moment.locale(language);
  const costLabel = cost ? ` ($${cost} costo registrado)` : '';
  return (
    <Form>
      <Field
        name="paid"
        defaultValues={values.paid}
        render={({ field }) => (
          <FormControlLabel
            control={
              <Checkbox
                checked={field.value}
                onChange={() => {
                  setFieldTouched(field.name, true);
                  setFieldValue(field.name, !values.paid);
                }}
                name="paid"
                color="primary"
              />
            }
            label="Pagado"
          />
        )}
      />
      <Divider size="24" />
      <Field
        name="totalPaid"
        defaultValues={values.totalPaid}
        render={({ field }) => (
          <Input
            {...field}
            type="number"
            label={`Monto pagado${costLabel}`}
            helperText={touched.totalPaid ? errors.totalPaid : ''}
            error={touched.totalPaid && Boolean(errors.totalPaid)}
            disabled={!values.paid}
            maxLength="12"
          />
        )}
      />
      <Divider size="24" />
      <Field
        name="paidDate"
        defaultValues={values.paidDate}
        render={({ field }) => (
          <Datepicker
            {...field}
            value={values.paidDate}
            id={field.name}
            label="Fecha de pago"
            language={language}
            onChange={newValue => {
              if (!newValue) {
                setFieldValue(field.name, null);
              } else {
                setFieldValue(
                  field.name,
                  moment(newValue, 'DD-MM-YYYY').format(),
                );
              }
            }}
            helperText={touched.paidDate ? errors.paidDate : ''}
            error={touched.paidDate && Boolean(errors.paidDate)}
            disabled={!values.paid}
          />
        )}
      />
      <Divider size="32" />
      <Field
        name="invoice"
        defaultValues={values.invoice}
        render={({ field }) => (
          <Input
            {...field}
            type="text"
            label="Número de factura"
            helperText={touched.invoice ? errors.invoice : ''}
            error={touched.invoice && Boolean(errors.invoice)}
            disabled={!values.paid}
            maxLength="255"
          />
        )}
      />
    </Form>
  );
}

PayTicketForm.propTypes = {
  values: PropTypes.object,
  touched: PropTypes.object,
  errors: PropTypes.object,
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
  cost: PropTypes.string,
};

export default memo(PayTicketForm);
