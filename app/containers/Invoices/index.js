/**
 *
 * Invoices
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
import makeSelectInvoices from './selectors';
import reducer from './reducer';
import saga from './saga';

export function Invoices() {
  useInjectReducer({ key: 'invoices', reducer });
  useInjectSaga({ key: 'invoices', saga });

  return (
    <div>
      <Helmet>
        <title>Facturas</title>
        <meta name="description" content="Description of Invoices" />
      </Helmet>
    </div>
  );
}

Invoices.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  invoices: makeSelectInvoices(),
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
)(Invoices);
