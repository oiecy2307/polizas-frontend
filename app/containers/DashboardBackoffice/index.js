/**
 *
 * DashboardBackoffice
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { get } from 'lodash';
import { PieChart, Pie, Tooltip } from 'recharts';

import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import { wsGetDashboardInformation } from 'services/dashboard';
import { getStatusLabel, getFullName } from 'utils/helper';
import PieChartItem from 'components/PieChartItem';

import makeSelectDashboardBackoffice from './selectors';
import { Content, Paper } from './styledComponents';

export function DashboardBackoffice({ dispatch }) {
  const [initialLoading, setInitialLoading] = useState(true);
  const [ticketStatusCount, setTicketStatusCount] = useState([]);
  const [technicalsWork, setTechnicalsWork] = useState([]);

  useEffect(() => {
    fetchDashboardInformation();
  }, []);

  const fetchDashboardInformation = async () => {
    try {
      dispatch(aSetLoadingState(true));
      const response = await wsGetDashboardInformation();
      if (response) {
        const statuses = get(response, 'data.ticketStatusCount', []);
        const technicals = get(response, 'data.technicalsWork', []);
        setTicketStatusCount(
          statuses.map(status => ({
            name: getStatusLabel(status.status),
            label: getStatusLabel(status.status),
            value: status.count,
          })),
        );
        setTechnicalsWork(
          technicals.map(t => ({
            name: getFullName(t.technical),
            label: get(t, 'technical.name', ''),
            value: t.count,
          })),
        );
      }
      setInitialLoading(false);
    } catch (e) {
      const error = (get(e, 'data.message', '') || '').toString();
      dispatch(aOpenSnackbar(error, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  };

  if (initialLoading) {
    return (
      <div>
        <Helmet>
          <title>Inicio</title>
        </Helmet>
        Cargando...
      </div>
    );
  }

  return (
    <Content>
      <Helmet>
        <title>Inicio</title>
      </Helmet>
      <Paper>
        <h3>Tickets por estatus</h3>
        <PieChart width={360} height={280}>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={ticketStatusCount}
            outerRadius={80}
            fill="#108043"
            label={payload => <PieChartItem {...payload} />}
          />
          <Tooltip />
        </PieChart>
      </Paper>
      <Paper>
        <h3>Tickets cerrados por técnico</h3>
        <PieChart width={360} height={280}>
          <Pie
            dataKey="value"
            isAnimationActive={false}
            data={technicalsWork}
            outerRadius={80}
            fill="#108043"
            label={payload => <PieChartItem {...payload} />}
          />
          <Tooltip />
        </PieChart>
      </Paper>
    </Content>
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
