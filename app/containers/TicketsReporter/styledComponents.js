import styled from 'styled-components';

export const DrawerContent = styled.div`
  padding: 24px;
  width: 392px;
  max-width: 100%;
  display: flex;
  flex-direction: column;

  & h2,
  h5 {
    margin-top: 0;
  }
`;

export const PairInputsRow = styled.div`
  display: flex;
  justify-content: space-between;
  margin-bottom: 32px;

  & > div {
    max-width: calc((100% / 2) - 8px);
    margin: 0;
  }
`;
