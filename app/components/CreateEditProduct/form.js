/**
 *
 * CreateEditProductForm
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';

import Input from 'components/InputText';

import { Form } from './styledComponents';

function CreateEditProductForm(props) {
  const { values, touched, errors } = props;
  return (
    <Form>
      <Field
        name="name"
        defaultValues={values.name}
        render={({ field }) => (
          <Input
            {...field}
            type="text"
            label="Nombre"
            helperText={touched.name ? errors.name : ''}
            error={touched.name && Boolean(errors.name)}
            maxLength="100"
          />
        )}
      />
      <Field
        name="description"
        defaultValues={values.description}
        render={({ field }) => (
          <Input
            {...field}
            type="text"
            label="Descripción"
            helperText={touched.description ? errors.description : ''}
            error={touched.description && Boolean(errors.description)}
            maxLength="255"
          />
        )}
      />
      <Field
        name="actualVersion"
        defaultValues={values.actualVersion}
        render={({ field }) => (
          <Input
            {...field}
            type="text"
            label="Versión actual"
            helperText={touched.actualVersion ? errors.actualVersion : ''}
            error={touched.actualVersion && Boolean(errors.actualVersion)}
            maxLength="50"
          />
        )}
      />
    </Form>
  );
}

CreateEditProductForm.propTypes = {
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
  values: PropTypes.object,
  touched: PropTypes.object,
  errors: PropTypes.object,
  isEditing: PropTypes.bool,
  fromProfile: PropTypes.bool,
};

export default memo(CreateEditProductForm);
