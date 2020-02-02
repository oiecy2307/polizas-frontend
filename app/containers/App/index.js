/**
 *
 * App.js
 *
 * This component is the skeleton around the actual pages, and should only
 * contain code that should be seen on all pages. (e.g. navigation bar)
 *
 */

import React from 'react';
import { Switch, Route } from 'react-router-dom';
import { Helmet } from 'react-helmet';

import AppRoute from 'components/AppRoute';
import HomePage from 'containers/HomePage/Loadable';
import NotFoundPage from 'containers/NotFoundPage/Loadable';
import TicketsAdmin from 'containers/TicketsAdmin/Loadable';
import Invoices from 'containers/Invoices/Loadable';
import MainLayout from 'containers/MainLayout';
import DashboardBackoffice from 'containers/DashboardBackoffice';
import Users from 'containers/Users/Loadable';
import { MuiThemeProvider, createMuiTheme } from '@material-ui/core/styles';

import GlobalStyle from '../../global-styles';

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
  },
});

export default function App() {
  return (
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
    </MuiThemeProvider>
  );
}
