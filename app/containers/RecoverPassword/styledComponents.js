import styled from 'styled-components';
import { mediaQuery } from 'utils/helper';

export const Form = styled.div`
  padding: 32px 8px;
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;

  .form {
    background-color: #ffffff;
    border: 2px solid #eeeeee;
    border-radius: 8px;
    padding: 32px;
    width: 423px;
    max-width: 100%;
    margin: 0 auto;
  }

  .top {
    display: flex;
    flex-direction: column;
    align-items: center;
    margin-bottom: 16px;
  }

  ${mediaQuery} {
    padding: 0;
  }
`;

export const Logo = styled.div`
  float: left;
  width: 64px;
  height: 64px;
  border-radius: 50%;
  background: #e3f1df;
  display: flex;
  align-items: center;
  justify-content: center;
`;

export const H1 = styled.h1`
  font-size: 24px;
  max-width: 200px;
  text-align: center;
  font-family: product-sans-bold;
`;

export const P = styled.p`
  font-size: 16px;
  max-width: 355px;
  text-align: center;
`;
