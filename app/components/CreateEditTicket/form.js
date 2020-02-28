/**
 *
 * CreateEditTicketForm
 *
 */

import React, { memo, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { GlobalValuesContext } from 'contexts/global-values';
import { Field } from 'formik';
import { find } from 'lodash';
import moment from 'moment/min/moment-with-locales';

import Input from 'components/InputText';
import Select from 'components/Select';
import Datepicker from 'components/Datepicker';

import { Form } from './styledComponents';
import getMessages from './messages';

function CreateEditTicketForm(props) {
  const { technicals, isClient } = props;
  const { language } = useContext(GlobalValuesContext);
  moment.locale(language);
  const [messages] = useState(getMessages(language));
  const [options] = useState([
    {
      value: 'low',
      label: messages.levels.lowLevel,
    },
    {
      value: 'medium',
      label: messages.levels.mediumLevel,
    },
    {
      value: 'high',
      label: messages.levels.highLevel,
    },
  ]);

  const { setFieldValue, setFieldTouched, values, touched, errors } = props;
  return (
    <Form>
      <Field
        name="ticketTitle"
        defaultValues={values.ticketTitle}
        render={({ field }) => (
          <Input
            {...field}
            label={messages.fields.ticketTitle}
            helperText={touched.ticketTitle ? errors.ticketTitle : ''}
            error={touched.ticketTitle && Boolean(errors.ticketTitle)}
          />
        )}
      />
      <Field
        name="ticketDescription"
        defaultValues={values.ticketDescription}
        render={({ field }) => (
          <Input
            {...field}
            label={messages.fields.ticketDescription}
            helperText={
              touched.ticketDescription ? errors.ticketDescription : ''
            }
            error={
              touched.ticketDescription && Boolean(errors.ticketDescription)
            }
            multiline
            rows="4"
          />
        )}
      />
      {!isClient && (
        <React.Fragment>
          <Field
            defaultValue={values.ticketPriority}
            name="ticketPriority"
            render={({ field }) => {
              const { label } = find(options, { value: field.value }) || {};
              const value = field.value ? { value: field.value, label } : null;
              return (
                <Select
                  {...field}
                  value={value}
                  onChange={newValue => {
                    setFieldValue(field.name, newValue.value);
                  }}
                  options={options}
                  placeholder={messages.fields.ticketPriority}
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
            defaultValue={values.technicalId}
            name="technicalId"
            render={({ field }) => {
              const { label } = find(technicals, { value: field.value }) || {};
              const value = field.value ? { value: field.value, label } : null;
              return (
                <Select
                  {...field}
                  value={value}
                  onChange={newValue => {
                    setFieldValue(field.name, newValue.value);
                  }}
                  options={technicals}
                  placeholder={messages.fields.technicalId}
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
            name="dueDate"
            defaultValues={values.dueDate}
            render={({ field }) => (
              <Datepicker
                {...field}
                value={values.dueDate}
                id={messages.fields.dueDate}
                label={messages.fields.dueDate}
                language={language}
                onChange={newValue => {
                  setFieldValue(
                    field.name,
                    moment(newValue, 'DD-MM-YYYY').format(),
                  );
                }}
                helperText={touched.dueDate ? errors.dueDate : ''}
                error={touched.dueDate && Boolean(errors.dueDate)}
              />
            )}
          />
        </React.Fragment>
      )}
    </Form>
  );
}

CreateEditTicketForm.propTypes = {
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
  values: PropTypes.object,
  touched: PropTypes.object,
  errors: PropTypes.object,
  technicals: PropTypes.array,
  isClient: PropTypes.bool,
};

export default memo(CreateEditTicketForm);
