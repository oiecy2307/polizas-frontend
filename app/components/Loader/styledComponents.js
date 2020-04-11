import styled, { keyframes } from 'styled-components';

export const LoaderContainer = styled.div`
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: #e8e8e882;
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
`;

const transform = keyframes`
  from {
    transform: scale(1);
  }

  to {
    transform: scale(1.5);
  }
`;

export const Logo = styled.div`
  float: left;
  width: 160px;
  height: 160px;
  border-radius: 50%;
  background: #e3f1df;
  display: flex;
  align-items: center;
  justify-content: center;
  animation: ${transform} 1s alternate infinite;
`;

export const LinearContainer = styled.div`
  position: fixed;
  width: 100%;
  top: 0;
  left: 0;
  z-index: 9;
`;
