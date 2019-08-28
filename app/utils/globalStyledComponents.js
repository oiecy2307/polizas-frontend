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
