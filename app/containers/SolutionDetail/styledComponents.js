import styled from 'styled-components';

export const MainContainer = styled.div`
  padding-bottom: 48px;
`;

export const Container = styled.div`
  margin: 0 auto;
  width: 100%;
  max-width: 800px;
  background-color: #ffffff;
  border-radius: 12px;
  box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);

  & h4,
  h5 {
    margin: 0;
  }

  & h5 {
    margin-bottom: 16px;
    color: #108043;
  }

  & h5:not(:first-child) {
    margin-top: 24px;
  }
`;

export const TopSection = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 16px 24px;
  border-bottom: 1px solid #97979747;

  & div > div {
    font-size: 12px;
    margin-top: 4px;
  }
`;

export const Header = styled.div`
  padding: 16px 24px;

  & h3 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0;
    padding-bottom: 24px;
    border-bottom: 1px solid #97979747;
  }
`;

export const Body = styled.div`
  padding: 16px 24px;
  background: #f9fafb;

  & h3 {
    display: flex;
    justify-content: space-between;
    align-items: center;
    margin-bottom: 0;
    padding-bottom: 24px;
    border-bottom: 1px solid #97979747;
  }
`;

export const Div = styled.div`
  cursor: ${props => (props.clickable ? 'pointer' : 'default')};
`;

export const Canceled = styled.div`
  padding: 16px;
  text-align: center;
  font-size: 16px;
  background: #fbeae5;
  color: #de3618;
  border-radius: 12px;
  margin: 0 auto 24px;
  max-width: 800px;
`;

export const EditorWrapper = styled.div`
  & .editor-class {
    box-shadow: 0 1px 5px 0 rgba(0, 0, 0, 0.1);
    padding: 0 16px;
  }

  & .DraftEditor-editorContainer > div {
    min-height: 50vh;
  }
`;
