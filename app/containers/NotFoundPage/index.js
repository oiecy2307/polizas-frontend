/**
 * NotFoundPage
 *
 * This is the page we show when the user visits a url that doesn't have a route
 *
 */

import React from 'react';
import styled from 'styled-components';
import config from 'config';

const Content = styled.div`
  padding: 24px;
  display: flex;
  align-items: center;
  justify-content: center;
  min-height: 100vh;
  min-width: 100vw;

  & > img {
    max-width: calc(100vw - 48px);
    max-height: calc(100vh - 48px);
  }
`;

export default function NotFound() {
  return (
    <Content>
      <img src={`${config.BASE_URL.replace('/api', '')}/404.png`} alt="404" />
    </Content>
  );
}
