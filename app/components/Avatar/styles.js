import styled from 'styled-components';

export const Image = styled.img`
  border-radius: 50%;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  object-fit: cover;
  margin: 0;
  flex-shrink: 0;
`;

export const Name = styled.span`
  background: ${props => props.color || '#de481e'};
  display: flex;
  align-items: center;
  justify-content: center;
  color: white;
  font-size: 14px;
  text-transform: capitalize;
  border-radius: 50%;
  width: ${props => props.size}px;
  height: ${props => props.size}px;
  flex-shrink: 0;
`;
