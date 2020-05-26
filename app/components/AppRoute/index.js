/**
 *
 * AppRoute
 *
 */

import React from 'react';
import { compose } from 'redux';
import { withRouter, Route } from 'react-router-dom';
import PropTypes from 'prop-types';

class AppRoute extends React.PureComponent { // eslint-disable-line
  render() {
    const {
      layout: Layout,
      component: Component,
      history,
      responsiveTitle,
      ...rest
    } = this.props;
    return (
      <Route
        {...rest}
        render={routeProps => (
          <Layout
            pathname={routeProps.location.pathname}
            history={history}
            responsiveTitle={responsiveTitle}
          >
            <Component {...routeProps} />
          </Layout>
        )}
      />
    );
  }
}

AppRoute.propTypes = {
  layout: PropTypes.object.isRequired,
  component: PropTypes.any.isRequired,
  history: PropTypes.object.isRequired,
  responsiveTitle: PropTypes.string.isRequired,
};

export default compose(withRouter)(AppRoute);
