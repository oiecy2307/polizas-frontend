import React from 'react';
import { render } from 'react-testing-library';
import { IntlProvider } from 'react-intl';

import PasswordRequest from '../index';

describe('<PasswordRequest />', () => {
  it('should render and match the snapshot', () => {
    const {
      container: { firstChild },
    } = render(
      <IntlProvider locale="en">
        <PasswordRequest />
      </IntlProvider>,
    );
    expect(firstChild).toMatchSnapshot();
  });
});
