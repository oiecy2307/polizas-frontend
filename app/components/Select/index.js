/**
 *
 * Select
 *
 */

import React, { memo, useContext } from 'react';
import { GlobalValuesContext } from 'contexts/global-values';
import Select from 'react-select';
import PropTypes from 'prop-types';
import styled from 'styled-components';
import useMediaQuery from '@material-ui/core/useMediaQuery';

const Error = styled.div`
  margin-top: -28px;
  padding-left: 14px;
  color: #f44336;
  font-size: 12px;
  margin-bottom: 24px;
`;

const SelectContainer = styled.div`
  position: relative;
`;

const FloatingLabel = styled.span`
  color: #616161;
  position: absolute;
  top: 8px;
  left: 12px;
  font-size: 12px;
`;

function SelectStyled(props) {
  const { customEmpty } = props;
  const borderBottom = props.error
    ? '2px solid rgb(244, 67, 54)'
    : '1px solid #919191';
  const { isResponsive } = useContext(GlobalValuesContext);
  const matches = useMediaQuery(
    '@media only screen and (max-width: 1080px) and (min-width: 800px)',
  );
  const position =
    matches || isResponsive
      ? {}
      : { menuPlacement: 'bottom', menuPosition: 'fixed' };

  const noOptionsMessage = customEmpty || (() => <span>Sin resultados</span>);

  return (
    <SelectContainer>
      <Select
        noOptionsMessage={noOptionsMessage}
        styles={{
          control: provided => ({
            ...provided,
            minHeight: 56,
            backgroundColor: 'rgba(0, 0, 0, 0.09)',
            marginBottom: 32,
            border: 'none',
            paddingLeft: 4,
            borderBottom,
            borderBottomLeftRadius: 0,
            borderBottomRightRadius: 0,
          }),
          menu: provided => ({
            ...provided,
            zIndex: 999,
          }),
          singleValue: provided => ({
            ...provided,
            top: '74%',
          }),
          multiValue: provided => ({
            ...provided,
            backgroundColor: 'white',
          }),
          placeholder: provided => ({
            ...provided,
            color: props.error ? 'rgb(244, 67, 54)' : 'rgba(0, 0, 0, 0.54)',
          }),
          valueContainer: provided => ({
            ...provided,
            paddingTop: props.isMulti ? 32 : 0,
          }),
          menuPortal: provided => ({
            ...provided,
            background: 'white',
            zIndex: 999,
          }),
        }}
        isClearable
        {...props}
        {...position}
      />
      {props.value && <FloatingLabel>{props.placeholder}</FloatingLabel>}
      {props.error && <Error>{props.error}</Error>}
    </SelectContainer>
  );
}

SelectStyled.propTypes = {
  field: PropTypes.object,
  error: PropTypes.string,
  value: PropTypes.any,
  placeholder: PropTypes.any,
  isMulti: PropTypes.bool,
  customEmpty: PropTypes.func,
};

export default memo(SelectStyled);
