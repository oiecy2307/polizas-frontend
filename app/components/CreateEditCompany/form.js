/**
 *
 * CreateEditCompanyForm
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';

import Input from 'components/InputText';
// import FormikDebugger from 'components/FormikDebugger';

import { Form } from './styledComponents';

function CreateEditCompanyForm(props) {
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
            label="Nombre comercial"
            helperText={touched.name ? errors.name : ''}
            error={touched.name && Boolean(errors.name)}
          />
        )}
      />
      <Field
        name="address"
        defaultValues={values.address}
        render={({ field }) => (
          <Input
            {...field}
            type="text"
            label="Dirección"
            helperText={touched.address ? errors.address : ''}
            error={touched.address && Boolean(errors.address)}
          />
        )}
      />
      <Field
        name="formalName"
        defaultValues={values.formalName}
        render={({ field }) => (
          <Input
            {...field}
            type="text"
            label="Razón social"
            helperText={touched.formalName ? errors.formalName : ''}
            error={touched.formalName && Boolean(errors.formalName)}
          />
        )}
      />
      <Field
        name="rfc"
        defaultValues={values.rfc}
        render={({ field }) => (
          <Input
            {...field}
            type="text"
            label="RFC"
            helperText={touched.rfc ? errors.rfc : ''}
            error={touched.rfc && Boolean(errors.rfc)}
          />
        )}
      />
      {/* <FormikDebugger /> */}
    </Form>
  );
}

CreateEditCompanyForm.propTypes = {
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
  values: PropTypes.object,
  touched: PropTypes.object,
  errors: PropTypes.object,
  isEditing: PropTypes.bool,
  fromProfile: PropTypes.bool,
};

export default memo(CreateEditCompanyForm);
