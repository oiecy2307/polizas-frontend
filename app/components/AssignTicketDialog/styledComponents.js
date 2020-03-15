import styled from 'styled-components';
import { mediaQuery } from 'utils/helper';

export const TechnicalCheckbox = styled.div`
  width: 600px;
  max-width: 100%;
  height: 64px;
  margin-bottom: 16px;
  border-radius: 12px;
  display: flex;
  padding: 0 8px 0 24px;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e0e0e0;
  cursor: pointer;

  ${mediaQuery} {
    width: 100%;
  }
`;

export const Note = styled.div`
  color: #454f5b;
  font-size: 14px;
  margin-bottom: 48px;
`;

export const PersonalInfo = styled.div`
  width: calc(100% - 216px);
  font-size: 14px;

  & .name {
    color: black;
    font-weight: bold;
    margin-bottom: 2px;
  }
  & .email {
    color: #b6b6b6;
  }
`;

export const Label = styled.div`
  border-radius: 12px;
  padding: 8px 0;
  width: 96px;
  text-align: center;
  color: ${props => props.color || '#108043'};
  background-color: ${props => props.background || '#E3F1DF'};
`;
