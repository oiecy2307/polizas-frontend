/**
 *
 * MainLayout
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
import makeSelectMainLayout from './selectors';
import reducer from './reducer';
import saga from './saga';

export function MainLayout() {
  useInjectReducer({ key: 'mainLayout', reducer });
  useInjectSaga({ key: 'mainLayout', saga });

  return (
    <div>
      <Helmet>
        <title>MainLayout</title>
        <meta name="description" content="Description of MainLayout" />
      </Helmet>
    </div>
  );
}

MainLayout.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  mainLayout: makeSelectMainLayout(),
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
)(MainLayout);
