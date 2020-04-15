import styled from 'styled-components';

export const Container = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 800px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);

  & h4 {
    margin: 0;
  }
`;

export const TopSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #97979747;

  & div > div {
    font-size: 12px;
    margin-top: 4px;
  }
`;

export const Header = styled.div`
  padding: 16px 24px;
  display: flex;
  justify-content: space-between;

  & .labels {
    flex-shrink: 0;
    display: flex;
    flex-direction: column;
    align-items: flex-end;
  }

  & .labels > div :first-child {
    margin-bottom: 16px;
  }

  & .description {
    padding-right: 16px;
    text-align: justify;
  }
`;
