import { createGlobalStyle } from 'styled-components';
import ProductSans from 'fonts/Product Sans Regular.ttf';
import ProductSansItalic from 'fonts/Product Sans Italic.ttf';
import ProductSansBold from 'fonts/Product Sans Bold.ttf';
import ProductSansBoldItalic from 'fonts/Product Sans Bold Italic.ttf';

const GlobalStyle = createGlobalStyle`
  html,
  body {
    height: 100%;
    width: 100%;
    background-color: #fafafa;
  }

  body {
    font-family: 'product-sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  body.fontLoaded {
    font-family: 'product-sans', 'Open Sans', 'Helvetica Neue', Helvetica, Arial, sans-serif;
  }

  #app {
    background-color: #fafafa;
    min-height: 100%;
    min-width: 100%;
    color: #212121;
    letter-spacing: 0.32px;
  }

  @font-face {
    font-family: 'product-sans';
    font-style: normal;
    font-weight: normal;
    src:
      url('${ProductSans}') format('opentype');
  }

  @font-face {
    font-family: 'product-sans-bold';
    font-style: normal;
    font-weight: normal;
    src:
      url('${ProductSansBold}') format('opentype');
  }

  @font-face {
    font-family: 'product-sans-italic';
    font-style: normal;
    font-weight: normal;
    src:
      url('${ProductSansItalic}') format('opentype');
  }

  @font-face {
    font-family: 'product-sans-bold-italic';
    font-style: normal;
    font-weight: normal;
    src:
      url('${ProductSansBoldItalic}') format('opentype');
  }

  .text-capitalize {
    text-transform: capitalize;
  }

  .text-ellipsis {
    text-overflow: ellipsis;
    white-space: nowrap;
    overflow: hidden;
  }

  /* total width */
  ::-webkit-scrollbar {
      background-color: #fff;
      width: 16px;
      border-radius: 4px;
  }

  /* background of the scrollbar except button or resizer */
  ::-webkit-scrollbar-track {
      background-color:#fff
      border-radius: 4px;
  }
  ::-webkit-scrollbar-track:hover {
      background-color:#f4f4f4
  }

  /* scrollbar itself */
  ::-webkit-scrollbar-thumb {
      background-color:#babac0;
      border-radius:16px;
      border:5px solid #fff
  }
  ::-webkit-scrollbar-thumb:hover {
      background-color:#a0a0a5;
      border:4px solid #f4f4f4
  }

  /* set button(top and bottom of the scrollbar) */
  ::-webkit-scrollbar-button {display:none}
`;

export default GlobalStyle;
