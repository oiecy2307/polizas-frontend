import styled from 'styled-components';

export const Container = styled.div`
  width: 378px;
  max-width: 100%;

  & .top {
    height: 48px;
    padding: 0 16px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    border-bottom: 1px solid #dfe3e8;
  }

  & .content {
    overflow: auto;
  }
`;

export const NotificationItem = styled.div`
  padding: 16px;
  width: 100%;
  transition: background 0.25s;
  cursor: pointer;
  display: flex;
  align-items: center;
  position: relative;
  background: ${props => (props.isNew ? '#F1F8EF' : 'white')};

  & .icon-container > svg {
    color: #108043;
    font-size: 24px;
  }

  & .icon-container {
    width: 40px;
    height: 40px;
    border-radius: 50%;
    background: #e3f1df;
    display: flex;
    align-items: center;
    justify-content: center;
  }

  & .title {
    font-size: 14px;
    color: black;
    font-weight: bold;
    margin-bottom: 8px;
  }

  & .body {
    font-size: 14px;
    margin-bottom: 8px;
  }

  & .date {
    font-size: 12px;
    color: #454f5b;
    margin-bottom: 8px;
  }

  & .content {
    width: calc(100% - 40px);
    padding-left: 16px;
  }

  &:hover {
    background: #f2f1ee;
  }
`;
