import styled from 'styled-components';

const expandedStyle = `
  max-height: 3000px;
  transition: max-height 0.5s ease-in;
`;

export const Container = styled.div`
  border-top: 1px solid #f6f7f9;
`;

export const Header = styled.div`
  padding: 18px 16px 18px 24px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  cursor: pointer;
`;

export const IconPurple = styled.div`
  background-color: #f6f0fd;
  border-radius: 50%;
  width: 32px;
  height: 32px;
`;

export const IconContainer = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  width: 24px;
  height: 24px;
  border-radius: 50%;
  border: 1px solid #919eab;
  ${({ expanded }) => expanded && 'transform: rotate(180deg);'}
  transition: transform 0.25s;
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
  width: calc(100% - 246px);
  @media (max-width: 576px) {
    width: calc(100% - 90px);
  }
`;

export const ExpandedSection = styled.div`
  background: #f9fafb;
  max-height: 0;
  transition: max-height 0.5s ease-out;
  ${({ expanded }) => expanded && expandedStyle}
  overflow: hidden;
`;

export const Content = styled.div`
  padding: 32px 24px;
`;
