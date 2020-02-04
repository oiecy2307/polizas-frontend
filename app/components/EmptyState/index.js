/**
 *
 * EmptyState
 *
 */

import React, { memo, useState, useContext } from 'react';
import { GlobalValuesContext } from 'contexts/global-values';
// import PropTypes from 'prop-types';
import { EmptyContainer } from './styledComponents';

import getMessages from './messages';

function EmptyState() {
  const { language } = useContext(GlobalValuesContext);
  const [messages] = useState(getMessages(language));

  return <EmptyContainer>{messages.state}</EmptyContainer>;
}

EmptyState.propTypes = {};

export default memo(EmptyState);
