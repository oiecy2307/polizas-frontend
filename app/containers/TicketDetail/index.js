/**
 *
 * TicketDetail
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import { get, times } from 'lodash';
import moment from 'moment/min/moment-with-locales';

import { wsGetTicketById } from 'services/tickets';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';

import Button from 'components/Button';
import Label from 'components/Label';
import Skeleton from '@material-ui/lab/Skeleton';
import Tooltip from '@material-ui/core/Tooltip';

import { Container, TopSection, Header } from './styledComponents';

moment.locale('es');

export function TicketDetail({ dispatch, match }) {
  const [ticket, setTicket] = useState(null);
  const [notFound, setNotFound] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchTicket();
  }, []);

  const fetchTicket = async () => {
    try {
      const id = get(match, 'params.id', null);
      if (!id) return;
      dispatch(aSetLoadingState(true));
      const response = await wsGetTicketById(id);
      if (!response || response.error) {
        dispatch(aOpenSnackbar('No fue posible obtener ticket', 'error'));
        setNotFound(true);
        return;
      }
      if (!response.data) setNotFound(true);
      else setTicket(response.data);
    } catch (e) {
      setNotFound(true);
      dispatch(aOpenSnackbar('No fue posible obtener ticket', 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
      setInitialLoading(false);
    }
  };

  if (notFound) {
    return (
      <div>
        <Helmet>
          <title>TicketDetail</title>
          <meta name="description" content="Description of TicketDetail" />
        </Helmet>
        <h1>404</h1>
        <h1>No se encontró el ticket</h1>
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div>
        <Helmet>
          <title>TicketDetail</title>
          <meta name="description" content="Description of TicketDetail" />
        </Helmet>
        {times(10, i => (
          <React.Fragment key={i}>
            <Skeleton
              animation="wave"
              height="40px"
              width="100%"
              variant="text"
              key={i}
            />
          </React.Fragment>
        ))}
      </div>
    );
  }

  const shortName = get(ticket, 'shortName', '');
  const createdAt = get(ticket, 'createdAt', '');
  const description = get(ticket, 'description', '');
  const priority = get(ticket, 'priority', '');
  const status = get(ticket, 'paid', false)
    ? 'paid'
    : get(ticket, 'status', 'new');

  return (
    <Container>
      <Helmet>
        <title>TicketDetail</title>
        <meta name="description" content="Description of TicketDetail" />
      </Helmet>
      <TopSection>
        <div>
          <h4>{shortName}</h4>
          <Tooltip title={moment(createdAt).format('LL')}>
            <div>{`Creado ${moment(createdAt).fromNow()}`}</div>
          </Tooltip>
        </div>
        <Button>Editar ticket</Button>
      </TopSection>
      <Header>
        <div className="description">{description}</div>
        <div className="labels">
          <Label option={priority} />
          <Label option={status} />
        </div>
      </Header>
    </Container>
  );
}

TicketDetail.propTypes = {
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.object,
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
)(TicketDetail);
