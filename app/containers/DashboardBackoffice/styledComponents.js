import styled from 'styled-components';
import { mediaQuery, mediaQueryS } from 'utils/helper';

export const Content = styled.div`
  display: flex;
  justify-content: space-between;
  justify-content: space-evenly;
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
  /* margin-right: 24px; */
  margin-bottom: 24px;
  width: calc(50% - 16px);

  & > h3 {
    width: 100%;
    padding-left: 16px;
    margin-top: 0;
  }

  @media (max-width: 1024px) {
    margin-right: 0;
    width: 100%;
  }

  ${mediaQuery} {
    margin-right: 0;
    width: 100%;
  }

  & a {
    width: 100%;
  }
`;

export const Label = styled.div`
  border-radius: 12px;
  padding: 8px 0;
  width: 96px;
  text-align: center;
  color: ${props => props.color || '#108043'};
  background-color: ${props => props.background || '#E3F1DF'};

  ${mediaQueryS} {
    width: 86px;
  }
`;

export const PersonalInfo = styled.div`
  width: calc(100% - 160px);
  font-size: 14px;

  & .name {
    color: black;
    font-weight: bold;
    margin-bottom: 2px;
  }
  & .email {
    color: #b6b6b6;
  }

  ${mediaQueryS} {
    width: calc(100% - 140px);
  }
`;

export const TechnicalCheckbox = styled.div`
  width: 100%;
  height: 64px;
  margin-bottom: 16px;
  border-radius: 12px;
  display: flex;
  padding: 0 8px 0 24px;
  align-items: center;
  justify-content: space-between;
  border: 1px solid #e0e0e0;
  cursor: pointer;

  ${mediaQuery} {
    width: 100%;
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

export const ItemCompany = styled.div`
  color: #919eab;
  font-size: 14px;
  padding-left: 8px;
  text-align: right;
  flex-shrink: 0;
  max-width: 50%;
`;

export const TodayTicketsSection = styled.div`
  width: 100%;

  & .item {
    padding: 18px 16px 18px 24px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    cursor: pointer;
    border-bottom: 1px solid #f6f7f9;
  }

  & .item:first-child {
    border-top: 1px solid #f6f7f9;
  }
`;
