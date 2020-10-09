/**
 *
 * CreateEditCompany
 *
 */

import React, { memo, useState, useContext } from 'react';
import PropTypes from 'prop-types';
import { GlobalValuesContext } from 'contexts/global-values';
import { Formik } from 'formik';
import * as Yup from 'yup';
import { get } from 'lodash';

import { wsCreateCompany, wsUpdateCompany } from 'services/companies';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import { trimObject } from 'utils/helper';

import Dialog from 'components/Dialog';
import Button from 'components/Button';
import Popover from '@material-ui/core/Popover';
import Form from './form';

import { PopoverContent } from './styledComponents';
import getMessages from './messages';

function CreateEditCompany({
  open,
  onClose,
  callback,
  dispatch,
  defaultCompany,
  usePopover,
  anchorEl,
}) {
  const { language } = useContext(GlobalValuesContext);
  const [messages] = useState(getMessages(language));
  const isEditing = Boolean(defaultCompany);

  async function handleCreateCompany(values, { resetForm, setSubmitting }) {
    try {
      dispatch(aSetLoadingState(true));

      if (isEditing) {
        const body = {
          id: defaultCompany.id,
          ...values,
        };
        await wsUpdateCompany(trimObject(body));
      } else {
        const body = {
          ...values,
        };
        await wsCreateCompany(trimObject(body));
      }

      dispatch(aOpenSnackbar('Compañía creada con éxito', 'success'));
      callback();
      onClose();
      resetForm();
      setSubmitting(false);
    } catch (e) {
      const errorMessage = get(e, 'data.message', 'Error al crear compañía');
      dispatch(aOpenSnackbar(errorMessage, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  }

  const defaultValues = {
    name: get(defaultCompany, 'name', '') || '',
    address: get(defaultCompany, 'address', '') || '',
    formalName: get(defaultCompany, 'formalName', '') || '',
    rfc: get(defaultCompany, 'rfc', '') || '',
  };

  const validationSchema = Yup.object({
    name: Yup.string('Nombre comercial')
      .trim()
      .required('Campo requerido')
      .max(100, 'Texto demasiado largo'),
    address: Yup.string('Dirección')
      .trim()
      .notRequired('')
      .max(255, 'Texto demasiado largo'),
    formalName: Yup.string('Razón social')
      .trim()
      .notRequired('')
      .max(255, 'Texto demasiado largo'),
    rfc: Yup.string('RFC')
      .trim()
      .notRequired('')
      .max(255, 'Texto demasiado largo'),
  });

  const dialogTitle = isEditing ? 'Editar empresa' : 'Nueva empresa';

  if (!open) return <div style={{ display: 'none ' }} />;

  return (
    <Formik
      onSubmit={(values, actions) => {
        handleCreateCompany(values, actions);
      }}
      validationSchema={validationSchema}
      initialValues={defaultValues}
      render={p =>
        usePopover ? (
          <Popover
            id="company-popover"
            open={open}
            anchorEl={anchorEl}
            onClose={() => {
              onClose();
              p.handleReset();
            }}
            anchorOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
            transformOrigin={{
              vertical: 'bottom',
              horizontal: 'right',
            }}
          >
            <PopoverContent>
              <h4>Nueva empresa</h4>
              <Form {...p} disabled={false} />
              <div className="actions">
                <Button
                  variant="text"
                  onClick={() => {
                    onClose();
                    p.handleReset();
                  }}
                  style={{ marginRight: 16 }}
                >
                  Cancelar
                </Button>
                <Button
                  disabled={!p.isValid || p.isSubmitting}
                  onClick={() => p.handleSubmit(p.values)}
                >
                  Guardar
                </Button>
              </div>
            </PopoverContent>
          </Popover>
        ) : (
          <Dialog
            onClose={() => {
              onClose();
              p.handleReset();
            }}
            title={dialogTitle}
            open={open}
            withActions
            negativeAction={messages.actions.cancel}
            positiveAction={messages.actions.save}
            onNegativeAction={() => {
              onClose();
              p.handleReset();
            }}
            onPositiveAction={() => p.handleSubmit(p.values)}
            disabled={!p.isValid || p.isSubmitting}
          >
            <Form {...p} disabled={false} />
          </Dialog>
        )
      }
    />
  );
}

CreateEditCompany.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  callback: PropTypes.func,
  dispatch: PropTypes.func,
  defaultCompany: PropTypes.object,
  usePopover: PropTypes.bool,
  anchorEl: PropTypes.any,
};

export default memo(CreateEditCompany);
