/**
 *
 * UserSettings
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { compose } from 'redux';

import messages from './messages';

export function UserSettings() {
  return (
    <div>
      <Helmet>
        <title>UserSettings</title>
        <meta name="description" content="Description of UserSettings" />
      </Helmet>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

UserSettings.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(UserSettings);
