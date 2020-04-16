import styled from 'styled-components';

export const Container = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 800px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);

  & h4,
  h5 {
    margin: 0;
  }

  & h5 {
    margin-bottom: 16px;
  }

  & h5:not(:first-child) {
    margin-top: 24px;
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

export const Body = styled.div`
  padding: 16px 24px;
  background: #f9fafb;

  & .user {
    display: flex;
    align-items: center;
  }

  & .user .name {
    margin-left: 16px;
  }

  & .evidence img {
    max-width: 100%;
    margin-bottom: 16px;
  }

  & .evidence .data-type {
    max-width: 100%;
    width: 400px;
    border-radius: 12px;
    background: #f4f6f8;
    overflow: hidden;
    display: flex;
    align-items: center;
    justify-content: center;
    height: 160px;
    margin-bottom: 16px;
    text-align: center;
  }
`;
