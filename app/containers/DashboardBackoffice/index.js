/**
 *
 * DashboardBackoffice
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import makeSelectDashboardBackoffice from './selectors';
import reducer from './reducer';
import saga from './saga';

export function DashboardBackoffice() {
  useInjectReducer({ key: 'dashboardBackoffice', reducer });
  useInjectSaga({ key: 'dashboardBackoffice', saga });

  return (
    <div>
      <Helmet>
        <title>DashboardBackoffice</title>
        <meta name="description" content="Description of DashboardBackoffice" />
      </Helmet>
    </div>
  );
}

DashboardBackoffice.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  dashboardBackoffice: makeSelectDashboardBackoffice(),
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
)(DashboardBackoffice);
