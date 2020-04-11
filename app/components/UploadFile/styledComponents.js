import styled from 'styled-components';

export const Container = styled.div`
  width: ${props => props.width || 'calc((100% / 4) - 16px)'};
  height: ${props => props.height || '118px'};
  border-radius: 12px;
  background: #f4f6f8;
  overflow: hidden;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  cursor: pointer;
  flex-direction: column;

  & img {
    width: 100%;
    height: 100%;
    object-fit: cover;
  }

  & svg {
    color: #108043;
  }

  & .note {
    text-align: center;
    color: #637381;
    margin-top: 8px;
    font-size: 12px;
  }

  & .data-type {
    margin: 16px;
    overflow: hidden;
    max-height: 100%;
    max-width: 100%;
  }

  & .absolute {
    position: absolute;
  }

  & .delete {
    background: black;
    width: 100%;
    height: 100%;
    opacity: 0;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
    transition: opacity 0.25s;
  }

  & .delete svg {
    font-size: 40px;
    color: white;
  }

  & .delete:hover {
    opacity: 0.9;
  }
`;

export const Input = styled.input`
  display: none;
`;

export const Div = styled.div``;

export const Layer = styled.div`
  position: absolute;
  width: 100%;
  height: 100%;
  background: white;
  opacity: 0.8;
`;
