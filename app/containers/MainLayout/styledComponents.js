import styled from 'styled-components';

export const MainContainer = styled.div`
  padding-top: 64px;
`;

export const TopBarContainer = styled.header`
  background-color: #ffffff;
  box-shadow: 0 2px 4px 0 rgba(0, 0, 0, 0.1);
  height: 64px;
  padding: 8px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  position: fixed;
  width: 100%;
  top: 0;
`;

export const Logo = styled.div`
  float: left;
  width: 32px;
  height: 32px;
  border-radius: 50%;
  background: #e3f1df;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const Suppdesk = styled.span`
  margin-left: 24px;
  font-family: product-sans-bold;
  color: #212b36;
  font-size: 21px;
`;

export const Avatar = styled.img`
  border-radius: 50%;
  object-fit: cover;
  width: 35px;
  height: 35px;
  margin-left: 32px;
`;

export const Flex = styled.div`
  display: flex;
  min-height: calc(100vh - 64px);
`;

export const LeftMenu = styled.div`
  background-color: #ffffff;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
  width: 236px;
  min-height: calc(100vh - 64px);
  padding: 40px 8px;

  @media (max-width: 768px) {
    display: none;
  }
`;

export const Content = styled.div`
  width: calc(100% - 236px);
  min-height: calc(100vh - 64px);
  padding: 24px;
  @media (max-width: 768px) {
    width: 100%;
    padding: 24px 16px;
  }
`;

export const MenuItem = styled.div`
  display: flex;
  align-items: center;
  background: ${props => (props.active ? '#E3F1DF' : 'white')};
  color: ${props => (props.active ? '#108043' : '#454F5B')};
  font-size: 14px;
  border-radius: 12px;
  width: 100%;
  padding: 10px 16px;
  margin-bottom: 16px;
  cursor: pointer;
  transition: all 0.25s;

  &:hover {
    background: #e3f1df;
    color: #108043;
  }
`;
