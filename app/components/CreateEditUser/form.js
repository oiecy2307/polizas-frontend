/**
 *
 * CreateEditUserForm
 *
 */

import React, { memo, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { GlobalValuesContext } from 'contexts/global-values';
import { Field } from 'formik';
import { find, get } from 'lodash';

import Input from 'components/InputText';
import Select from 'components/Select';

import { Form } from './styledComponents';
import getMessages from './messages';

function CreateEditUserForm(props) {
  const { language } = useContext(GlobalValuesContext);
  const [messages] = useState(getMessages(language));
  const [options] = useState([
    {
      value: 'admin',
      label: 'Administrador',
    },
    {
      value: 'technical',
      label: 'Soporte',
    },
    {
      value: 'salesman',
      label: 'Ventas',
    },
    {
      value: 'client',
      label: 'Cliente',
    },
  ]);
  const {
    setFieldValue,
    setFieldTouched,
    values,
    touched,
    errors,
    isEditing,
    fromProfile,
  } = props;
  return (
    <Form>
      <Field
        name="name"
        defaultValues={values.name}
        render={({ field }) => (
          <Input
            {...field}
            type="text"
            label={messages.fields.name}
            helperText={touched.name ? errors.name : ''}
            error={touched.name && Boolean(errors.name)}
            maxLength="100"
          />
        )}
      />
      <Field
        name="lastname"
        defaultValues={values.lastname}
        render={({ field }) => (
          <Input
            {...field}
            type="text"
            label={messages.fields.lastname}
            helperText={touched.lastname ? errors.lastname : ''}
            error={touched.lastname && Boolean(errors.lastname)}
            maxLength="100"
          />
        )}
      />
      <Field
        name="secondLastName"
        defaultValues={values.secondLastName}
        render={({ field }) => (
          <Input
            {...field}
            type="text"
            label={messages.fields.secondLastName}
            helperText={touched.secondLastName ? errors.secondLastName : ''}
            error={touched.secondLastName && Boolean(errors.secondLastName)}
            maxLength="100"
          />
        )}
      />
      {!fromProfile && !isEditing && (
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
              maxLength="150"
            />
          )}
        />
      )}
      {false && (
        <Field
          name="username"
          defaultValues={values.username}
          render={({ field }) => (
            <Input
              {...field}
              type="text"
              label={messages.fields.username}
              helperText={touched.username ? errors.username : ''}
              error={touched.username && Boolean(errors.username)}
            />
          )}
        />
      )}
      {!isEditing && (
        <React.Fragment>
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
                maxLength="150"
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
                  touched.passwordConfirmation
                    ? errors.passwordConfirmation
                    : ''
                }
                error={
                  touched.passwordConfirmation &&
                  Boolean(errors.passwordConfirmation)
                }
                maxLength="150"
              />
            )}
          />
        </React.Fragment>
      )}
      {!fromProfile && (
        <React.Fragment>
          <Field
            defaultValue={values.role}
            name="role"
            render={({ field }) => {
              const { label } = find(options, { value: field.value }) || {};
              const value = field.value ? { value: field.value, label } : null;
              return (
                <Select
                  {...field}
                  value={value}
                  onChange={newValue => {
                    setFieldValue(field.name, get(newValue, 'value', ''));
                  }}
                  options={options}
                  placeholder={messages.fields.role}
                  error={
                    touched[field.name] && Boolean(errors[field.name])
                      ? errors[field.name]
                      : ''
                  }
                  onBlur={() => setFieldTouched(field.name, true)}
                />
              );
            }}
          />
        </React.Fragment>
      )}
      <Field
        name="phoneNumber"
        defaultValues={values.phoneNumber}
        render={({ field }) => (
          <Input
            {...field}
            type="tel"
            label={messages.fields.phoneNumber}
            helperText={touched.phoneNumber ? errors.phoneNumber : ''}
            error={touched.phoneNumber && Boolean(errors.phoneNumber)}
            maxLength="16"
          />
        )}
      />
    </Form>
  );
}

CreateEditUserForm.propTypes = {
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
  values: PropTypes.object,
  touched: PropTypes.object,
  errors: PropTypes.object,
  isEditing: PropTypes.bool,
  fromProfile: PropTypes.bool,
};

export default memo(CreateEditUserForm);
