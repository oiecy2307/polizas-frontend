import styled from 'styled-components';

export const Container = styled.div`
  background: ${props => props.background || '#FCF1CD'};
  color: ${props => props.color || '#8A6116'};
  padding: 8px 16px;
  font-size: 13px;
  text-align: center;
  border-radius: 12px;
  max-height: 32px;
  flex-shrink: 0;
  cursor: ${props => (props.clickable ? 'pointer' : 'default')};
  transition: all 0.25s;
`;
