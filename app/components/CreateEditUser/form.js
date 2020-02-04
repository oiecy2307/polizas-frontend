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

import { Form } from './styledComponents';
import getMessages from './messages';

function CreateEditUserForm(props) {
  const { language } = useContext(GlobalValuesContext);
  const [messages] = useState(getMessages(language));
  const {
    // setFieldValue,
    // setFieldTouched,
    values,
    touched,
    errors,
  } = props;
  return (
    <Form>
      <Field
        name="name"
        defaultValues={values.name}
        render={({ field }) => (
          <Input
            {...field}
            label={messages.fields.name}
            helperText={touched.name ? errors.name : ''}
            error={touched.name && Boolean(errors.name)}
          />
        )}
      />
      <Field
        name="lastname"
        defaultValues={values.lastname}
        render={({ field }) => (
          <Input
            {...field}
            label={messages.fields.lastname}
            helperText={touched.lastname ? errors.lastname : ''}
            error={touched.lastname && Boolean(errors.lastname)}
          />
        )}
      />
      <Field
        name="secondLastName"
        defaultValues={values.secondLastName}
        render={({ field }) => (
          <Input
            {...field}
            label={messages.fields.secondLastName}
            helperText={touched.secondLastName ? errors.secondLastName : ''}
            error={touched.secondLastName && Boolean(errors.secondLastName)}
          />
        )}
      />
      <Field
        name="email"
        defaultValues={values.email}
        render={({ field }) => (
          <Input
            {...field}
            type="email"
            label={messages.fields.email}
            helperText={touched.email ? errors.email : ''}
            error={touched.email && Boolean(errors.email)}
          />
        )}
      />
      <Field
        name="username"
        defaultValues={values.username}
        render={({ field }) => (
          <Input
            {...field}
            label={messages.fields.username}
            helperText={touched.username ? errors.username : ''}
            error={touched.username && Boolean(errors.username)}
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
      <Field
        name="role"
        defaultValues={values.role}
        render={({ field }) => (
          <Input
            {...field}
            label={messages.fields.role}
            helperText={touched.role ? errors.role : ''}
            error={touched.role && Boolean(errors.role)}
          />
        )}
      />
    </Form>
  );
}

CreateEditUserForm.propTypes = {
  // setFieldValue: PropTypes.func,
  // setFieldTouched: PropTypes.func,
  values: PropTypes.object,
  touched: PropTypes.object,
  errors: PropTypes.object,
};

export default memo(CreateEditUserForm);
