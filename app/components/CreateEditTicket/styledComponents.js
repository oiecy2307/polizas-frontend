import styled from 'styled-components';
import { mediaQuery } from 'utils/helper';

export const Form = styled.div`
  width: 560px;
  max-width: 100%;
  margin: 0 auto;

  ${mediaQuery} {
    width: 100%;
    margin: 0;
  }
`;
