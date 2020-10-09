/**
 *
 * CloseTicketDialogForm
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

import { Field } from 'formik';
import Input from 'components/InputText';

import { Form } from './styledComponents';

function CreateEditTicketForm(props) {
  const { values, touched, errors } = props;
  return (
    <Form>
      <Field
        name="timeNeeded"
        defaultValues={values.timeNeeded}
        render={({ field }) => (
          <Input
            {...field}
            label="Tiempo empleado en solución (minutos)"
            helperText={touched.timeNeeded ? errors.timeNeeded : ''}
            error={touched.timeNeeded && Boolean(errors.timeNeeded)}
            type="number"
            maxLength="4"
          />
        )}
      />
      <Field
        name="cost"
        defaultValues={values.cost}
        render={({ field }) => (
          <Input
            {...field}
            label="Costo de la solución"
            helperText={touched.cost ? errors.cost : ''}
            error={touched.cost && Boolean(errors.cost)}
            type="number"
            maxLength="12"
          />
        )}
      />
    </Form>
  );
}

CreateEditTicketForm.propTypes = {
  values: PropTypes.object,
  touched: PropTypes.object,
  errors: PropTypes.object,
};

export default memo(CreateEditTicketForm);
