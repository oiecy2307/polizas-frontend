import styled from 'styled-components';
import { mediaQuery } from 'utils/helper';

export const Form = styled.div`
  width: 604px;
  max-width: 100%;
  margin: 0 auto;

  ${mediaQuery} {
    width: 100%;
    margin: 0;
  }
`;

export const PriorityOptions = styled.div`
  display: flex;
  justify-content: space-between;
  width: 300px;
  max-width: 100%;
  margin-bottom: 32px;
`;
