import styled from 'styled-components';

export const Container = styled.div`
  max-width: 500px;
  margin: 0 auto;
`;

export const ConfigSection = styled.div`
  padding: 24px;

  & > h3 {
    margin: 0;
    font-size: 20px;
    margin-bottom: 8px;
  }

  & > h3:not(:first-child) {
    margin-top: 32px;
  }

  & .description {
    font-size: 12px;
    margin-bottom: 24px;
  }

  & .item {
    display: flex;
    align-items: center;
    justify-content: space-between;
    width: 600px;
    max-width: 100%;
  }
`;

export const DomainItem = styled.div`
  border: 1px solid white;
  border-radius: 4px;
  padding: 8px 12px;
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fafafa;

  &:not(:last-child) {
    margin-bottom: 8px;
  }

  & .actions {
    flex-shrink: 0;
    padding-left: 16px;
  }

  & .action-icon {
    color: gray;
    cursor: pointer;
  }

  & .action-icon:last-child {
    margin-left: 16px;
  }

  & .action-icon:hover {
    color: black;
  }
`;

export const SaveSection = styled.div`
  display: flex;
  justify-content: flex-end;
`;

export const DayItem = styled.div`
  & .schedule-item {
    display: flex;
    align-items: center;
    justify-content: space-between;
  }

  & h4 {
    color: #108043;
  }

  & .separator {
    margin: 0 16px;
  }

  & .selects-section {
    display: flex;
    align-items: center;
    width: 360px;
    max-width: calc(100% - 60px);
  }

  & .select-schedule {
    flex-grow: 1;
  }
`;
