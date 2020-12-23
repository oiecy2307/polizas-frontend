import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  margin-bottom: 24px;

  & > span {
    flex-shrink: 0;
  }

  & .content {
    flex-grow: 1;
    padding-left: 16px;
  }

  & .header {
    font-size: 14px;
    margin-bottom: 8px;
    display: flex;
    justify-content: space-between;
  }

  & .header > div {
    flex-grow: 1;
    padding-right: 16px;
  }

  & .header > svg {
    cursor: pointer;
    flex-shrink: 0;
    color: #108043;
  }
`;
