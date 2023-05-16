/**
 *
 * CreateEditPolizaForm
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

function CreateEditPolizaForm(props) {
  const { language } = useContext(GlobalValuesContext);
  const [messages] = useState(getMessages(language));
  const {
    setFieldValue,
    setFieldTouched,
    values,
    touched,
    errors,
    isEditing,
    users,
    inventory,
  } = props;

  return (
    <Form>
      <Field
        name="cantidad"
        defaultValues={values.cantidad}
        render={({ field }) => (
          <Input
            {...field}
            type="number"
            label={messages.fields.cantidad}
            helperText={touched.cantidad ? errors.cantidad : 'cantidad'}
            error={touched.cantidad && Boolean(errors.cantidad)}
            maxLength="100"
          />
        )}
      />
      <Field
        defaultValue={values.inventarioId}
        name="inventarioId"
        render={({ field }) => {
          const { label } = find(inventory, { value: field.value }) || {};
          const value = field.value ? { value: field.value, label } : null;
          return (
            <Select
              {...field}
              value={value}
              onChange={newValue => {
                setFieldValue(field.name, get(newValue, 'value', ''));
              }}
              options={inventory}
              placeholder={messages.fields.inventoryId}
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
      <Field
        defaultValue={values.userId}
        name="userId"
        render={({ field }) => {
          const { label } = find(users, { value: field.value }) || {};
          const value = field.value ? { value: field.value, label } : null;
          return (
            <Select
              {...field}
              value={value}
              onChange={newValue => {
                setFieldValue(field.name, get(newValue, 'value', ''));
              }}
              options={users}
              placeholder={messages.fields.userId}
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
      {!isEditing && (
        <React.Fragment>
          <Field
            name="empleadoGenero"
            defaultValues={values.empleadoGenero}
            render={({ field }) => (
              <Input
                {...field}
                type="text"
                label={messages.fields.empleadoGenero}
                helperText={touched.empleadoGenero ? errors.empleadoGenero : ''}
                error={touched.empleadoGenero && Boolean(errors.empleadoGenero)}
                maxLength="100"
              />
            )}
          />
        </React.Fragment>
      )}
      {/* {!fromProfile && (
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
      )} */}
    </Form>
  );
}

CreateEditPolizaForm.propTypes = {
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
  values: PropTypes.object,
  touched: PropTypes.object,
  errors: PropTypes.object,
  isEditing: PropTypes.bool,
  fromProfile: PropTypes.bool,
  users: PropTypes.array,
  inventory: PropTypes.array,
};

export default memo(CreateEditPolizaForm);
