/**
 *
 * Dialog
 *
 */

import React, { memo, useContext } from 'react';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import { GlobalValuesContext } from 'contexts/global-values';
import { mediaQuery } from 'utils/helper';

import DialogTitle from '@material-ui/core/DialogTitle';
import Dialog from '@material-ui/core/Dialog';
import IconButton from '@material-ui/core/IconButton';
import CloseIcon from '@material-ui/icons/Close';
import DialogActions from '@material-ui/core/DialogActions';
import Button from 'components/Button';

const Content = styled.div`
  padding: 24px;

  ${mediaQuery} {
    padding-bottom: 72px;
  }
`;

const CloseSection = styled.div`
  position: absolute;
  top: 8px;
  right: 8px;
`;

const ActionsSection = styled.div`
  ${mediaQuery} {
    position: fixed;
    padding-bottom: 16px;
    bottom: 0;
    right: 16px;
    width: 100%;
    background: white;
    z-index: 1;
  }
`;

function DialogComponent({
  open,
  onClose,
  title,
  children,
  withActions,
  negativeAction,
  onNegativeAction,
  positiveAction,
  onPositiveAction,
  disabled,
  actionIsSubmit,
}) {
  const { isResponsive } = useContext(GlobalValuesContext);

  return (
    <Dialog
      fullScreen={isResponsive}
      onClose={onClose}
      aria-labelledby="simple-dialog-title"
      open={open}
    >
      <DialogTitle id="simple-dialog-title">{title}</DialogTitle>
      <CloseSection>
        <IconButton aria-label="close" onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </CloseSection>
      <Content>{children}</Content>
      {withActions && (
        <ActionsSection>
          <DialogActions>
            <Button
              variant="text"
              onClick={onNegativeAction}
              style={{ marginRight: 16 }}
            >
              {negativeAction}
            </Button>
            {actionIsSubmit ? (
              <Button disabled={disabled} type="submit">
                {positiveAction}
              </Button>
            ) : (
              <Button disabled={disabled} onClick={onPositiveAction}>
                {positiveAction}
              </Button>
            )}
          </DialogActions>
        </ActionsSection>
      )}
    </Dialog>
  );
}

DialogComponent.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  title: PropTypes.string,
  children: PropTypes.any,
  withActions: PropTypes.bool,
  negativeAction: PropTypes.string,
  onNegativeAction: PropTypes.func,
  positiveAction: PropTypes.string,
  onPositiveAction: PropTypes.func,
  disabled: PropTypes.bool,
  actionIsSubmit: PropTypes.bool,
};

DialogComponent.defaultProps = {
  withActions: false,
  negativeAction: 'Cancelar',
  positiveAction: 'Aceptar',
};

export default memo(DialogComponent);
