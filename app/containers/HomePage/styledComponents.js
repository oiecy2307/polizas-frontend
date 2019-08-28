import styled from 'styled-components';

export const MainContainer = styled.section`
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 32px 16px;
`;

export const FormSection = styled.div`
  background-color: #ffffff;
  border: 2px solid #eeeeee;
  border-radius: 8px;
  padding: 32px;
  display: flex;
  flex-direction: column;
  align-items: center;
`;

export const Logo = styled.img`
  width: 180px;
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

export const Form = styled.form`
  width: 100%;
`;
