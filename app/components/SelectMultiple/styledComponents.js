import styled, { css } from 'styled-components';

export const Wrapper = styled.span`
  margin: 0;
  margin-top: 24px;
  padding: 0;
  &:first-child {
    margin-top: 0;
  }
`;

export const OptionsWrapper = styled.div`
  position: absolute;
  width: 300px;
  right: -40px;
  max-height: 300px;
  overflow: scroll;
  top: 36px;
  background-color: #ffffff;
  box-shadow: 0 0 7px 0 rgba(0, 0, 0, 0.1);
  z-index: 1300;
`;

export const EmptyOptions = styled.h3`
  padding: 16px;
  margin: 0;
  font-size: 14px;
  font-weight: 500;
  text-align: center;
  color: #757575;
  box-sizing: border-box;
`;

export const OptionsList = styled.ul`
  z-index: 3000;
  padding: 0;
  margin: 0;
  display: flex;
  width: 300px;
  background: white;
  flex-flow: column nowrap;
  justify-content: space-between;
`;

export const OptionsItem = styled.li`
  z-index: 3000;
  box-sizing: border-box;
  padding: 0 16px;
  margin: 0;
  display: flex;
  align-items: center;
  color: #757575;
  font-weight: 500;
  font-size: 16px;
  width: 100%;
  &:hover {
    background: #e8f5e9;
  }
`;

export const Icon = styled.img`
  height: 16px;
  width: 16px;
  transition: 0.35s;

  ${({ open }) =>
    open &&
    css`
      transform: rotate(-180deg);
    `}
`;
