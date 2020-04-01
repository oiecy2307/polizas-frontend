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

function Label({ option }) {
  const [color, background, text] = (() => {
    switch (option) {
      case 'low':
        return ['#108043', '#E3F1DF', 'Nivel bajo'];
      case 'medium':
        return ['#8A6116', '#FCF1CD', 'Nivel medio'];
      case 'high':
        return ['#DE3618', '#FBEAE5', 'Nivel alto'];
      default:
        return ['#8A6116', '#FCF1CD'];
    }
  })();
  return (
    <Container color={color} background={background}>
      {text}
    </Container>
  );
}

Label.propTypes = {
  option: PropTypes.string,
};

export default memo(Label);
