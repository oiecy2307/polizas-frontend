/**
 *
 * ChangePasswordDialogForm
 *
 */

import React, { memo, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { GlobalValuesContext } from 'contexts/global-values';
import { Field } from 'formik';

import Input from 'components/InputText';

import { Form } from './styledComponents';
import getMessages from './messages';

function ChangePasswordDialogForm(props) {
  const { language } = useContext(GlobalValuesContext);
  const [messages] = useState(getMessages(language));
  const { values, touched, errors } = props;
  return (
    <Form>
      <Field
        name="oldPassword"
        defaultValues={values.oldPassword}
        render={({ field }) => (
          <Input
            {...field}
            type="password"
            label={messages.fields.oldPassword}
            helperText={touched.oldPassword ? errors.oldPassword : ''}
            error={touched.oldPassword && Boolean(errors.oldPassword)}
          />
        )}
      />
      <Field
        name="password"
        defaultValues={values.password}
        render={({ field }) => (
          <Input
            {...field}
            type="password"
            label={messages.fields.password}
            helperText={touched.password ? errors.password : ''}
            error={touched.password && Boolean(errors.password)}
          />
        )}
      />
      <Field
        name="passwordConfirmation"
        defaultValues={values.passwordConfirmation}
        render={({ field }) => (
          <Input
            {...field}
            type="password"
            label={messages.fields.passwordConfirmation}
            helperText={
              touched.passwordConfirmation ? errors.passwordConfirmation : ''
            }
            error={
              touched.passwordConfirmation &&
              Boolean(errors.passwordConfirmation)
            }
          />
        )}
      />
    </Form>
  );
}

ChangePasswordDialogForm.propTypes = {
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
  values: PropTypes.object,
  touched: PropTypes.object,
  errors: PropTypes.object,
  isEditing: PropTypes.bool,
  fromProfile: PropTypes.bool,
};

export default memo(ChangePasswordDialogForm);
