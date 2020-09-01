import styled from 'styled-components';

export const Container = styled.div`
  display: flex;
  align-items: center;

  & .action {
    cursor: pointer;
    margin-left: 8px;
  }
`;

export const Span = styled.div`
  cursor: pointer;

  & svg {
    color: #108043;
  }
`;
