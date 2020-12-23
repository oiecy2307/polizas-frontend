import styled from 'styled-components';

export const MainContainer = styled.div`
  padding-bottom: 48px;
`;

export const Container = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 600px;
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
`;

export const Body = styled.div`
  padding: 24px;
  background: #f9fafb;

  & .item {
    padding: 18px 16px 18px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    transition: background 0.25s;
    border-radius: 2px;
  }

  & .item:hover {
    background: #fdfeffd9;
  }
`;

export const IconGreen = styled.div`
  background-color: ${props => (props.isRed ? '#fbeae5' : '#e3f1df')};
  border-radius: 50%;
  width: 32px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;

  & svg {
    color: ${props => (props.isRed ? '#DE3618' : '#108043')};
    font-size: 18px;
  }
`;

export const ItemMainInfo = styled.div`
  display: flex;
  justify-content: space-between;
  width: calc(100% - 48px);
  align-items: center;

  & .formal-name {
    font-size: 12px;
    color: gray;
    margin-top: 4px;
  }
`;

export const ItemMessage = styled.div`
  color: #454f5b;
  font-size: 14px;
  padding-right: 8px;
`;
