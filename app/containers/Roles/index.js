/**
 *
 * Roles
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { FormattedMessage } from 'react-intl';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectReducer } from 'utils/injectReducer';
import makeSelectRoles from './selectors';
import reducer from './reducer';
import messages from './messages';

export function Roles() {
  useInjectReducer({ key: 'roles', reducer });

  return (
    <div>
      <Helmet>
        <title>Roles</title>
        <meta name="description" content="Description of Roles" />
      </Helmet>
      <FormattedMessage {...messages.header} />
    </div>
  );
}

Roles.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  roles: makeSelectRoles(),
});

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  mapStateToProps,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(Roles);
