/**
 *
 * Searcher
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

import SearchIcon from '@material-ui/icons/Search';

import { Container, Input } from './styledComponents';

function Searcher({ value, onChange, onSearch }) {
  const handleKeyPress = e => {
    if (e.key === 'Enter') {
      onSearch();
    }
  };

  return (
    <Container>
      <SearchIcon />
      <Input
        type="text"
        placeholder="Buscar..."
        value={value}
        onChange={onChange}
        onBlur={onSearch}
        onKeyPress={handleKeyPress}
        maxLength="255"
      />
    </Container>
  );
}

Searcher.propTypes = {
  value: PropTypes.string,
  onChange: PropTypes.func,
  onSearch: PropTypes.func,
};

export default memo(Searcher);
