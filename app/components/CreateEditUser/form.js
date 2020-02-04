/**
 *
 * CreateEditUserForm
 *
 */

import React, { memo, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { GlobalValuesContext } from 'contexts/global-values';
import { Field } from 'formik';

import Input from 'components/InputText';

import getMessages from './messages';

function CreateEditUserForm(props) {
  const { language } = useContext(GlobalValuesContext);
  const [messages] = useState(getMessages(language));
  const {
    handleSubmit,
    setFieldValue,
    setFieldTouched,
    values,
    touched,
    errors,
    isValid,
    isSubmitting,
  } = props;
  return (
    <form onSubmit={handleSubmit} autoComplete="off">
      <Field
        name="name"
        defaultValues={values.name}
        render={({ field }) => (
          <Input
            {...field}
            label={messages.fields.name}
            helperText={touched.name ? errors.name : ''}
            error={touched.name && Boolean(errors.name)}
            disabled={false}
          />
        )}
      />
    </form>
  );
}

CreateEditUserForm.propTypes = {};

export default memo(CreateEditUserForm);
