/**
 *
 * Loader
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import LayersIcon from '@material-ui/icons/Layers';
import LinearProgress from '@material-ui/core/LinearProgress';

import { LoaderContainer, Logo, LinearContainer } from './styledComponents';

const iconStyle = {
  color: '#108043',
  fontSize: 80,
  cursor: 'pointer',
};

function Loader({ linear }) {
  if (linear) {
    return (
      <LinearContainer>
        <LinearProgress />
      </LinearContainer>
    );
  }

  return (
    <LoaderContainer>
      <Logo>
        <LayersIcon style={{ ...iconStyle }} />
      </Logo>
    </LoaderContainer>
  );
}

Loader.propTypes = {
  linear: PropTypes.bool,
};

export default memo(Loader);
