import styled from 'styled-components';

const daySelectedGreen = `
  border: 2px solid #50B83C;
  color: white;
  background: #50B83C;
`;

const daySelectedRed = `
  border: 2px solid #DE3618;
  color: white;
  background: #DE3618;
`;

const dayGreen = `
  border: 2px solid #50B83C;
  color: #50B83C;
`;

const dayRed = `
  border: 2px solid #DE3618;
  color: #DE3618;
`;

const getVariant = (variant = '', selected = false) => {
  switch (true) {
    case variant === 'success' && selected:
      return daySelectedGreen;
    case variant === 'success' && !selected:
      return dayGreen;
    case variant === 'warning' && selected:
      return daySelectedRed;
    case variant === 'warning' && !selected:
      return dayRed;
    case selected:
      return daySelectedGreen;
    default:
      return '';
  }
};

export const Container = styled.div`
  background-color: #ffffff;
  border-radius: 12px;
  max-width: 420px;
  padding: 24px 32px;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
  ${({ responsive }) => responsive && 'align-self: start;'}
  @media (max-width: ${({ maxResponsive }) => maxResponsive}px) {
    ${({ responsive }) => responsive && 'max-width: unset;'}
  }
`;

export const Header = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  color: #212b36;
  font-family: product-sans-bold;
  font-size: 16px;
  letter-spacing: 0.32px;
  text-transform: capitalize;
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

export const DaysName = styled.div`
  color: #616161;
  font-family: product-sans-bold;
  font-size: 12px;
  margin-top: 40px;
  display: flex;
  margin-bottom: 16px;

  & span {
    width: calc(100% / 7);
    text-align: center;
  }
`;

export const DaysContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
`;

export const DayItem = styled.div`
  color: #212121;
  font-family: product-sans-bold;
  font-size: 13px;
  width: calc(100% / 7);
  height: 56px;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;

  & span {
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    ${({ variant, selected }) => getVariant(variant, selected)}
    border-radius: 50%;
    transition: all 0.25s;
  }

  /* &:hover > span {
    background: #d9f7d4;
    border: 2px solid #d9f7d4;
  } */
`;
