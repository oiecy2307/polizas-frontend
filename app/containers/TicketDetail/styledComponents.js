import styled from 'styled-components';

export const MainContainer = styled.div`
  padding: 24px 16px 48px;
`;

export const LoaderContainer = styled.div`
  max-width: 800px;
  margin: 0 auto;
  padding: 24px 16px 48px;
`;

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

  & h4 {
    padding-right: 8px;
  }

  & h5 {
    margin-bottom: 16px;
    color: #108043;
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

  & button {
    flex-shrink: 0;
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

  & .labels > div :last-child {
    cursor: pointer;
  }

  & .description {
    padding-right: 16px;
    text-align: justify;
    -webkit-hyphens: auto;
    -ms-hyphens: auto;
    hyphens: auto;
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

  & .user .formal-name {
    margin-left: 16px;
    font-size: 12px;
    color: gray;
    margin-top: 4px;
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

  & .comment-input {
    position: relative;
  }

  & .comment-input > button svg {
    color: #108043;
  }

  & .comment-input > button {
    position: absolute;
    right: 4px;
    bottom: 4px;
  }

  & .comment-input > div > div {
    padding-bottom: 48px;
    position: relative;
  }
`;

export const Div = styled.div`
  cursor: ${props => (props.clickable ? 'pointer' : 'default')};
`;

export const Canceled = styled.div`
  padding: 16px;
  text-align: center;
  font-size: 16px;
  background: #fbeae5;
  color: #de3618;
  border-radius: 12px;
  margin: 0 auto 24px;
  max-width: 800px;
`;
