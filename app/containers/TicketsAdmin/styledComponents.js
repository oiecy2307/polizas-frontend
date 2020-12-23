import styled from 'styled-components';

export const ButtonsSection = styled.div`
  @media (max-width: 1190px) {
    max-width: 560px;
    margin: 0 auto;
  }
`;

export const Content = styled.div`
  display: flex;
  justify-content: space-between;
  margin-top: 8px;
  // @media (max-width: 768px) {
  @media (max-width: 1190px) {
    flex-direction: column-reverse;
    align-items: center;
    max-width: 560px;
    margin: 8px auto;
    & > div {
      margin-bottom: 24px;
    }
  }
`;

export const LeftSection = styled.div`
  width: calc(100% - 444px);
  // @media (max-width: 768px) {
  @media (max-width: 1190px) {
    width: 100%;
  }
`;

export const DateDetailContainer = styled.div`
  background-color: #ffffff;
  border-radius: 12px 12px 0 0;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
  margin-bottom: 24px;
`;

export const DateText = styled.div`
  padding: 28px 24px;
  color: #212b36;
  font-size: 18px;
  font-family: product-sans-bold;
`;

export const PorAsignarItem = styled.div`
  border-top: 1px solid #f6f7f9;
  padding: 18px 16px 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
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

export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #919eab;
`;

export const ItemMessage = styled.div`
  color: #454f5b;
  font-size: 14px;
`;

export const ItemCompany = styled.div`
  color: #919eab;
  font-size: 14px;
  padding-left: 8px;
  text-align: right;
`;

export const LabelPurple = styled.div`
  background-color: #f6f0fd;
  border-radius: 12.5px;
  color: #50248f;
  font-size: 13px;
  padding: 8px 22px;
  @media (max-width: 576px) {
    display: none;
  }
`;

export const ItemMainInfo = styled.div`
  display: flex;
  justify-content: space-between;
  width: calc(100% - 100px);
  @media (max-width: 576px) {
    width: calc(100% - 90px);
  }
`;

export const Explanation = styled.div`
  display: flex;
  align-items: center;
  width: 100%;

  & > span {
    margin-left: 16px;
    color: #212b36;
    font-size: 16px;
    font-weight: 400;
  }

  &:not(:last-child) {
    margin-bottom: 16px;
  }
`;

export const IconCalendarContainer = styled.div`
  border-radius: 50%;
  width: 32px;
  height: 32px;
  background: ${props => props.background};
  color: ${props => props.color};
  display: flex;
  align-items: center;
  justify-content: center;

  & svg {
    font-size: 16px;
  }
`;

export const ColorsExplanation = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  max-width: 420px;
  padding: 24px 32px;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
  margin-top: 24px;
  @media (max-width: 1190px) {
    max-width: unset;
  }
`;

export const TicketInformation = styled.div`
  & svg {
    color: #108043;
    margin-right: 24px;
  }

  & > div:not(:last-child) {
    margin-bottom: 24px;
  }

  & .row {
    display: flex;
    padding-right: 8px;
  }

  & .row .time {
    display: flex;
    align-items: center;
  }

  & .row .time .action {
    cursor: pointer;
    margin-left: 8px;
  }

  & .row-technical {
    display: flex;
    align-items: center;
  }

  & .row-technical > div {
    padding-left: 16px;
  }
`;

export const ButtonDot = styled.span`
  position: absolute;
  top: -2px;
  right: -2px;
  width: 10px;
  height: 10px;
  border-radius: 50%;
  background: #50b83c;
`;

export const Span = styled.span``;
