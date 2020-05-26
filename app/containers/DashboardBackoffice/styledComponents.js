import styled from 'styled-components';

export const Content = styled.div`
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
`;

export const Paper = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
  overflow: auto;
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 32px 16px;
  margin-right: 24px;
  margin-bottom: 24px;

  & > h3 {
    width: 100%;
    padding-left: 16px;
    margin-top: 0;
  }
`;
