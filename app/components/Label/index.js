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
  const [color, background] = (() => {
    switch (option) {
      case 'low':
      case 'new':
      case 'paid':
        return ['#108043', '#E3F1DF'];
      case 'medium':
      case 'assigned':
        return ['#8A6116', '#FCF1CD'];
      case 'high':
      case 'closed':
        return ['#DE3618', '#FBEAE5'];
      case 'unselected':
      case 'cancelled':
      default:
        return ['#454F5B', '#DFE3E8'];
    }
  })();
  const text = (() => {
    switch (option) {
      case 'low':
        return 'Nivel bajo';
      case 'new':
        return 'Nuevo';
      case 'paid':
        return 'Pagado';
      case 'medium':
        return 'Nivel medio';
      case 'assigned':
        return 'Asignado';
      case 'high':
        return 'Nivel alto';
      case 'closed':
        return 'Pendiente de pago';
      case 'cancelled':
        return 'Cancelado';
      case 'unselected':
      default:
        return defaultText || '';
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
