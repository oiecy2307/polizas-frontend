/**
 *
 * Fab
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { FabContainer } from 'utils/globalStyledComponents';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

function FabComponent({ onClick, ...restProps }) {
  return (
    <FabContainer>
      <Fab {...restProps} color="primary" aria-label="add" onClick={onClick}>
        <AddIcon />
      </Fab>
    </FabContainer>
  );
}

FabComponent.propTypes = {
  onClick: PropTypes.func,
};

export default memo(FabComponent);
