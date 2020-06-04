/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React, { memo, useEffect } from 'react';
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
import PasswordRequest from 'containers/PasswordRequest/Loadable';
import Register from 'containers/Register/Loadable';
import RecoverPassword from 'containers/RecoverPassword/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import TicketsAdmin from 'containers/TicketsAdmin/Loadable';
import TicketsReporter from 'containers/TicketsReporter/Loadable';
import UserProfile from 'containers/UserProfile';
import Invoices from 'containers/Invoices/Loadable';
import MainLayout from 'containers/MainLayout';
import DashboardBackoffice from 'containers/DashboardBackoffice';
import Users from 'containers/Users/Loadable';
import TicketDetail from 'containers/TicketDetail/Loadable';
import Companies from 'containers/Companies/Loadable';
import Products from 'containers/Products/Loadable';
import Solutions from 'containers/Solutions/Loadable';
import SolutionDetail from 'containers/SolutionDetail/Loadable';
import Invitations from 'containers/Invitations';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';
import useMediaQuery from '@material-ui/core/useMediaQuery';

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
  const matches = useMediaQuery('@media (max-width:768px)');
  const matchesXs = useMediaQuery('@media (max-width:576px)');
  const globalValues = {
    primaryColor: '#108043',
    language: 'es',
    isResponsive: matches,
    isResponsiveXs: matchesXs,
  };

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
            responsiveTitle="Tickets"
            component={TicketsAdmin}
          />
          <AppRoute
            exact
            path="/reporteador-tickets"
            layout={MainLayout}
            responsiveTitle="Reporteador de tickets"
            component={TicketsReporter}
          />
          <AppRoute
            exact
            path="/facturas"
            layout={MainLayout}
            responsiveTitle="Facturas"
            component={Invoices}
          />
          <AppRoute
            exact
            path="/usuarios"
            layout={MainLayout}
            responsiveTitle="Usuarios"
            component={Users}
          />
          <AppRoute
            exact
            path="/"
            layout={MainLayout}
            responsiveTitle="Dashboard"
            component={DashboardBackoffice}
          />
          <AppRoute
            exact
            path="/perfil/:id"
            layout={MainLayout}
            responsiveTitle="Perfil"
            component={UserProfile}
          />
          <AppRoute
            exact
            path="/tickets/:id"
            layout={MainLayout}
            responsiveTitle="Detalle de ticket"
            component={TicketDetail}
          />
          <AppRoute
            exact
            path="/invitaciones"
            layout={MainLayout}
            responsiveTitle="Invitaciones"
            component={Invitations}
          />
          <AppRoute
            exact
            path="/empresas"
            layout={MainLayout}
            responsiveTitle="Empresas"
            component={Companies}
          />
          <AppRoute
            exact
            path="/productos"
            layout={MainLayout}
            responsiveTitle="Productos"
            component={Products}
          />
          <AppRoute
            exact
            path="/soluciones"
            layout={MainLayout}
            responsiveTitle="Soluciones"
            component={Solutions}
          />
          <AppRoute
            exact
            path="/soluciones/:id"
            layout={MainLayout}
            responsiveTitle="Detalle de solución"
            component={SolutionDetail}
          />
          <Route exact path="/inicio-sesion" component={HomePage} />
          <Route exact path="/registro/:token" component={Register} />
          <Route
            exact
            path="/recuperar-contrasena/:token"
            component={RecoverPassword}
          />
          <Route
            exact
            path="/solicitar-contrasena"
            component={PasswordRequest}
          />
          <Route component={NotFoundPage} />
        </Switch>
        <GlobalStyle />
        {loading && <Loader linear />}
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
