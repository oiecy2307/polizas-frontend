import styled from 'styled-components';
import { mediaQueryL } from 'utils/helper';

export const Content = styled.div`
  display: flex;
  max-width: 1280px;
  margin: 0 auto;
  ${mediaQueryL} {
    flex-direction: column;
    max-width: 560px;
  }

  h4 {
    margin: 0 0 24px;
  }

  h5 {
    margin: 24px 0 16px;
    color: #108043;
  }
`;

export const PersonalInfoContainer = styled.div`
  border-radius: 12px;
  padding: 24px;
  margin-right: 24px;
  width: 300px;

  ${mediaQueryL} {
    margin-bottom: 24px;
    width: 100%;
    margin-right: 0;
  }

  & .picture-container {
    position: relative;
    width: 120px;
  }

  & .picture-container .add-picture {
    position: absolute;
    bottom: 0;
    right: 0;
    background: #c4c4c4;
    border-radius: 50%;
    width: 32px;
    height: 32px;
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
  }

  & .picture-container > span {
    font-size: 48px;
  }

  & img {
    background-color: #ffffff;
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
  }
`;

export const ComplementInfo = styled.div`
  border-radius: 12px;
  padding: 24px;
  flex-grow: 1;
`;

export const Input = styled.input`
  display: none;
`;

export const Span = styled.span``;
