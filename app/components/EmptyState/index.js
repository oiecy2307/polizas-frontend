/**
 *
 * EmptyState
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import config from 'config';
import { EmptyContainer } from './styledComponents';

function EmptyState({ message, small }) {
  return (
    <EmptyContainer small={small}>
      <h2>{message}</h2>
      <img src={`${config.BASE_URL.replace('/api', '')}/empty.png`} alt="404" />
    </EmptyContainer>
  );
}

EmptyState.propTypes = {
  message: PropTypes.string,
  small: PropTypes.bool,
};

EmptyState.defaultProps = {
  message: 'Sin resultados',
  small: false,
};

export default memo(EmptyState);
