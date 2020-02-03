/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { memo, useState, useEffect } from 'react';
import { Switch, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { compose } from 'redux';
import { useInjectReducer } from 'utils/injectReducer';
import GlobalStyle from 'global-styles';
import { GlobalValuesContext } from 'contexts/global-values';
import moment from 'moment/min/moment-with-locales';

import AppRoute from 'components/AppRoute';
import Loader from 'components/Loader';
import Snackbar from '@material-ui/core/Snackbar';
import MuiAlert from '@material-ui/lab/Alert';

import HomePage from 'containers/HomePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import TicketsAdmin from 'containers/TicketsAdmin/Loadable';
import Invoices from 'containers/Invoices/Loadable';
import MainLayout from 'containers/MainLayout';
import DashboardBackoffice from 'containers/DashboardBackoffice';
import Users from 'containers/Users/Loadable';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import { makeSelectApp } from './selectors';
import reducer from './reducer';
import { closeSnackbar } from './actions';

const theme = createMuiTheme({
  typography: {
    fontFamily: ['product-sans', 'Helvetica Neue', 'Arial'].join(','),
    useNextVariants: true,
  },
  palette: {
    primary: {
      main: '#108043',
    },
    secondary: {
      main: '#E3F1DF',
    },
    success: {
      main: '#4caf50',
    },
    error: {
      main: '#f44336',
    },
    info: {
      main: '#2196f3',
    },
    warning: {
      main: '#ff9800',
    },
  },
});

function Alert(props) {
  return <MuiAlert elevation={6} variant="filled" {...props} />;
}

function App({ app, dispatch }) {
  useInjectReducer({ key: 'appPage', reducer });
  const { loading, snackbar } = app;
  const [globalValues] = useState({
    primaryColor: '#108043',
    language: 'es',
    isResponsive: false,
  });

  useEffect(() => {
    moment.locale(globalValues.language);
  }, [globalValues.language]);

  const handleCloseSnackbar = () => {
    dispatch(closeSnackbar());
  };

  return (
    <GlobalValuesContext.Provider value={globalValues}>
      <MuiThemeProvider theme={theme}>
        <Helmet
          titleTemplate="%s - Suppdesk"
          defaultTitle="Backoffice - Suppdesk"
        >
          <meta name="description" content="Backoffice de la primavera" />
        </Helmet>
        <Switch>
          <AppRoute
            exact
            path="/tickets"
            layout={MainLayout}
            component={TicketsAdmin}
          />
          <AppRoute
            exact
            path="/facturas"
            layout={MainLayout}
            component={Invoices}
          />
          <AppRoute
            exact
            path="/usuarios"
            layout={MainLayout}
            component={Users}
          />
          <AppRoute
            exact
            path="/"
            layout={MainLayout}
            component={DashboardBackoffice}
          />
          <Route exact path="/inicio-sesion" component={HomePage} />
          <Route component={NotFoundPage} />
        </Switch>
        <GlobalStyle />
        {loading && <Loader />}
        <Snackbar
          open={snackbar.open}
          autoHideDuration={3000}
          onClose={handleCloseSnackbar}
        >
          <Alert onClose={handleCloseSnackbar} severity={snackbar.severity}>
            {snackbar.text}
          </Alert>
        </Snackbar>
      </MuiThemeProvider>
    </GlobalValuesContext.Provider>
  );
}

App.propTypes = {
  app: PropTypes.object,
  dispatch: PropTypes.func,
};

const mapStateToProps = createStructuredSelector({
  app: makeSelectApp(),
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
)(App);
