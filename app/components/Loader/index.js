/**
 *
 * Loader
 *
 */

import React, { memo } from 'react';
// import PropTypes from 'prop-types';
import LayersIcon from '@material-ui/icons/Layers';
import { LoaderContainer, Logo } from './styledComponents';

const iconStyle = {
  color: '#108043',
  fontSize: 80,
  cursor: 'pointer',
};

function Loader() {
  return (
    <LoaderContainer>
      <Logo>
        <LayersIcon style={{ ...iconStyle }} />
      </Logo>
    </LoaderContainer>
  );
}

Loader.propTypes = {};

export default memo(Loader);
