/**
 *
 * CreateEditSolutionForm
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Field } from 'formik';

import Input from 'components/InputText';
import Select from 'components/Select';

import { Form } from './styledComponents';

function CreateEditSolutionForm(props) {
  const { values, touched, errors, products, setFieldValue } = props;
  const optionsProducts = products.map(p => ({
    value: p.id,
    label: p.name,
    version: p.actualVersion,
  }));

  return (
    <Form>
      <Field
        name="shortName"
        defaultValues={values.shortName}
        render={({ field }) => (
          <Input
            {...field}
            type="text"
            label="Nombre"
            helperText={touched.shortName ? errors.shortName : ''}
            error={touched.shortName && Boolean(errors.shortName)}
          />
        )}
      />
      <Select
        placeholder="Productos relacionados"
        value={(values.products || []).length ? values.products : null}
        onChange={value => setFieldValue('products', value)}
        options={optionsProducts}
        isMulti
        name="products"
        menuPlacement="bottom"
        menuPosition="fixed"
      />
    </Form>
  );
}

CreateEditSolutionForm.propTypes = {
  setFieldValue: PropTypes.func,
  setFieldTouched: PropTypes.func,
  values: PropTypes.object,
  touched: PropTypes.object,
  errors: PropTypes.object,
  isEditing: PropTypes.bool,
  fromProfile: PropTypes.bool,
  products: PropTypes.array,
};

export default memo(CreateEditSolutionForm);
