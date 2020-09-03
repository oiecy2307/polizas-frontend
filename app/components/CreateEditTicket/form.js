/**
 *
 * CreateEditTicketForm
 *
 */

import React, { memo, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { GlobalValuesContext } from 'contexts/global-values';
import { Field } from 'formik';
import { find, get } from 'lodash';
import moment from 'moment/min/moment-with-locales';

// import FormikDebugger from 'components/FormikDebugger';
import Input from 'components/InputText';
import Select from 'components/Select';
import Datepicker from 'components/Datepicker';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';
import UploadEvidence from 'components/UploadEvidence';
import Label from 'components/Label';
import { Divider } from 'utils/globalStyledComponents';

import { Form, PriorityOptions } from './styledComponents';
import getMessages from './messages';

function CreateEditTicketForm(props) {
  const {
    technicals,
    isClient,
    clients,
    dispatch,
    defaultEvidence,
    isClosed,
  } = props;
  const { language } = useContext(GlobalValuesContext);
  moment.locale(language);
  const [messages] = useState(getMessages(language));

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
      <h4>{messages.fields.evidence}</h4>
      <UploadEvidence
        onFilesUploaded={files => setFieldValue('evidence', files)}
        dispatch={dispatch}
        defaultEvidence={defaultEvidence}
      />
      <h4>{messages.fields.ticketPriority}</h4>
      <Field
        defaultValue={values.ticketPriority}
        name="ticketPriority"
        render={({ field }) => (
          <PriorityOptions>
            <Label
              option={field.value === 'low' ? 'low' : 'unselected'}
              defaultText={messages.levels.lowLevel}
              onClick={() => setFieldValue(field.name, 'low')}
            />
            <Label
              option={field.value === 'medium' ? 'medium' : 'unselected'}
              defaultText={messages.levels.mediumLevel}
              onClick={() => setFieldValue(field.name, 'medium')}
            />
            <Label
              option={field.value === 'high' ? 'high' : 'unselected'}
              defaultText={messages.levels.highLevel}
              onClick={() => setFieldValue(field.name, 'high')}
            />
          </PriorityOptions>
        )}
      />
      {!isClient && (
        <React.Fragment>
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
                    setFieldValue(field.name, get(newValue, 'value', ''));
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
            defaultValue={values.clientId}
            name="clientId"
            render={({ field }) => {
              const { label } = find(clients, { value: field.value }) || {};
              const value = field.value ? { value: field.value, label } : null;
              return (
                <Select
                  {...field}
                  value={value}
                  onChange={newValue => {
                    setFieldValue(field.name, get(newValue, 'value', ''));
                  }}
                  options={clients}
                  placeholder={messages.fields.clientId}
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
            name="reportedDate"
            defaultValues={values.reportedDate}
            render={({ field }) => (
              <Datepicker
                {...field}
                value={values.reportedDate}
                id={messages.fields.reportedDate}
                label={messages.fields.reportedDate}
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
                helperText={touched.reportedDate ? errors.reportedDate : ''}
                error={touched.reportedDate && Boolean(errors.reportedDate)}
              />
            )}
          />
          {isClosed && (
            <React.Fragment>
              <Divider size="32" />
              <Field
                name="timeNeeded"
                defaultValues={values.timeNeeded}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Tiempo empleado en solución (minutos)"
                    helperText={touched.timeNeeded ? errors.timeNeeded : ''}
                    error={touched.timeNeeded && Boolean(errors.timeNeeded)}
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
                  />
                )}
              />
              <Field
                name="invoice"
                defaultValues={values.invoice}
                render={({ field }) => (
                  <Input
                    {...field}
                    label="Número de factura"
                    helperText={touched.invoice ? errors.invoice : ''}
                    error={touched.invoice && Boolean(errors.invoice)}
                  />
                )}
              />
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
                    label="Monto pagado"
                    helperText={touched.totalPaid ? errors.totalPaid : ''}
                    error={touched.totalPaid && Boolean(errors.totalPaid)}
                    disabled={!values.paid}
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
            </React.Fragment>
          )}
          {/* <FormikDebugger /> */}
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
  clients: PropTypes.array,
  isClient: PropTypes.bool,
  dispatch: PropTypes.func,
  defaultEvidence: PropTypes.array,
  isClosed: PropTypes.bool,
};

export default memo(CreateEditTicketForm);
