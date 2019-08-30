import styled from 'styled-components';

export const SpaceBetween = styled.div`
  display: flex;
  justify-content: space-between;
  ${props => (props.alignVertical ? 'align-items: center;' : '')}
`;

export const AlignVertical = styled.div`
  display: flex;
  align-items: center;
`;

export const LabelButton = styled.button`
  background: transparent;
  border: none;
  outline: none;
  font-size: 14px;
  color: ${props => props.color || '#50b83c'};
  cursor: pointer;
  transition: 0.25s opacity;

  &:hover {
    opacity: 0.7;
  }
`;

export const Button = styled.button`
  background: ${props => props.background || '#50b83c'};
  border: none;
  outline: none;
  font-size: 14px;
  letter-spacing: 0.28px;
  padding: 12px 32px;
  border-radius: 8px;
  color: ${props => props.color || 'white'};
  cursor: pointer;
  transition: 0.25s opacity;

  &:hover {
    opacity: 0.7;
  }
`;

export const TabButton = styled.button`
  background: ${({ selected }) => (selected ? '#E3F1DF' : '#DFE3E8')};
  color: ${({ selected }) => (selected ? '#108043' : '#454F5B')};
  border: none;
  outline: none;
  font-size: 14px;
  letter-spacing: 0.28px;
  padding: 12px 24px;
  border-radius: 12px;
  cursor: pointer;
  transition: 0.25s all;
  margin-right: ${({ noMargin }) => (noMargin ? 0 : 16)}px;
  margin-bottom: ${({ noMargin }) => (noMargin ? 0 : 16)}px;

  &:hover {
    background: #e3f1df;
    color: #108043;
  }
`;
