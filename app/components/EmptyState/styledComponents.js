import styled from 'styled-components';

export const EmptyContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 16px;
  flex-direction: column;

  & > img {
    width: ${props => (props.small ? '230px' : '360px')};
    max-width: 100%;
  }
`;
