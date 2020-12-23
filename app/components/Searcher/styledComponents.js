import styled from 'styled-components';
import { mediaQuery } from 'utils/helper';

export const Container = styled.div`
  position: relative;
  display: flex;
  align-items: center;
  margin-right: 16px;
  margin-bottom: 16px;
  width: 240px;

  & svg {
    position: absolute;
    left: 8px;
    color: #47515d;
  }

  ${mediaQuery} {
    width: 100%;
    margin-right: 0;
  }
`;

export const Input = styled.input`
  height: 40px;
  outline: none;
  border: none;
  color: #47515d;
  font-size: 14px;
  padding: 0 16px 0 40px;
  border-radius: 12px;
  box-shadow: 0 1px 2px 0 rgba(0, 0, 0, 0.05);
  width: 100%;
  background: #fafffc;
  background: #fff;
`;
