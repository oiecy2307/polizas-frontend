import styled from 'styled-components';

export const Container = styled.div`
  max-width: 600px;
  margin: 0 auto;
`;

export const ConfigSection = styled.div`
  padding: 24px;

  & > h3 {
    margin: 0;
    font-size: 20px;
    margin-bottom: 8px;
  }

  & .description {
    font-size: 12px;
    margin-bottom: 24px;
  }

  & .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 600px;
    max-width: 100%;
  }
`;
