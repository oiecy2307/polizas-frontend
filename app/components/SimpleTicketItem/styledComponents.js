import styled from 'styled-components';

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

export const Container = styled.div`
  padding: 18px 16px 18px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
  transition: background 0.25s;
  border-radius: 2px;

  &:hover {
    background: #fdfeffd9;
  }
`;
