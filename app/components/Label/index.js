/**
 *
 * Label
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { Container } from './styledComponents';
// import { FormattedMessage } from 'react-intl';
// import messages from './messages';

function Label({ option, defaultText, onClick }) {
  const [color, background, text] = (() => {
    switch (option) {
      case 'low':
        return ['#108043', '#E3F1DF', 'Nivel bajo'];
      case 'medium':
        return ['#8A6116', '#FCF1CD', 'Nivel medio'];
      case 'high':
        return ['#DE3618', '#FBEAE5', 'Nivel alto'];
      case 'unselected':
      default:
        return ['#454F5B', '#DFE3E8', defaultText || ''];
    }
  })();
  return (
    <Container
      color={color}
      background={background}
      onClick={onClick}
      clickable={option === 'unselected'}
    >
      {text}
    </Container>
  );
}

Label.propTypes = {
  option: PropTypes.string,
  defaultText: PropTypes.string,
  onClick: PropTypes.func,
};

Label.defaultProps = {
  option: 'unselected',
  defaultText: '',
  onClick: () => {},
};

export default memo(Label);
