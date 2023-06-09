import styled from 'styled-components';
import { mediaQueryS } from 'utils/helper';

export const Content = styled.div`
  padding-bottom: 64px;

  & th {
    min-width: 160px;
    white-space: nowrap;
  }
`;

export const DrawerContent = styled.div`
  padding: 24px;
  max-width: 392px;
  width: 100%;
  display: block;
  flex-shrink: 0;
  position: relative;

  & h2,
  h5 {
    margin-top: 0;
  }

  & > label {
    width: 100%;
  }

  & .close-button {
    position: absolute;
    top: 8px;
    right: 8px;
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

  & .select-container {
    width: 260px;
    display: flex;
    align-items: center;
    position: relative;
  }

  & .select-container > div:first-child {
    flex-grow: 1;
  }

  & .arrow {
    transform: ${props => (props.desc ? 'rotate(180deg)' : 'none')};
    width: 48px;
    transition: all 0.25s;
    margin-left: 8px;
    position: absolute;
    right: 32px;
  }

  ${mediaQueryS} {
    flex-direction: column;

    & > .select-container {
      width: 100%;
      margin-bottom: 16px;
    }

    & > button {
      width: 100%;
    }
  }
`;
