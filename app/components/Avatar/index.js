/**
 *
 * Avatar
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Image, Name } from './styles';

function Avatar({ src, name, color, size }) {
  if (src) {
    return <Image size={size} src={src} />;
  }
  return (
    <Name size={size} color={color}>
      {name.charAt(0)}
    </Name>
  );
}

Avatar.propTypes = {
  src: PropTypes.string,
  name: PropTypes.string,
  color: PropTypes.string,
  size: PropTypes.number,
};

Avatar.defaultProps = {
  size: 32,
  name: '',
  color: '#108043',
};

export default memo(Avatar);
