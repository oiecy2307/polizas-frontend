import styled from 'styled-components';
import { mediaQueryS } from 'utils/helper';

export const Content = styled.div`
  padding-bottom: 64px;

  & th {
    min-width: 200px;
  }
`;

export const DrawerContent = styled.div`
  padding: 24px;
  max-width: 392px;
  width: 100%;
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

export const TopSection = styled.div`
  margin-bottom: 24px;
  display: flex;
  justify-content: space-between;
  align-items: center;

  & > div {
    width: 240px;
    display: flex;
    align-items: center;
  }

  & > div > div:first-child {
    flex-grow: 1;
  }

  & > div > div > div > div {
    margin: 0;
  }

  & .arrow {
    transform: ${props => (props.desc ? 'rotate(180deg)' : 'none')};
    width: 48px;
    transition: all 0.25s;
    margin-left: 8px;
  }

  ${mediaQueryS} {
    flex-direction: column;

    & > div {
      width: 100%;
      margin-bottom: 16px;
    }

    & > button {
      width: 100%;
    }
  }
`;
