/**
 *
 * CompanyDetail
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import { Link } from 'react-router-dom';
import moment from 'moment/min/moment-with-locales';
import { get, times } from 'lodash';
import { getFullName } from 'utils/helper';

import { wsGetCompanyById } from 'services/companies';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import Avatar from 'components/Avatar';
import EmptyState from 'components/EmptyState';
import SimpleTicketItem from 'components/SimpleTicketItem';

import Skeleton from '@material-ui/lab/Skeleton';

import {
  Container,
  TopSection,
  Header,
  Body,
  MainContainer,
} from './styledComponents';

export function CompanyDetail({ dispatch, match }) {
  const [company, setCompany] = useState({});
  const [tickets, setTickets] = useState([]);
  const [companyAdmin, setCompanyAdmin] = useState(null);
  const [notFound, setNotFound] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchCompany();
  }, []);

  const fetchCompany = async () => {
    try {
      const id = get(match, 'params.id', null);
      dispatch(aSetLoadingState(true));
      const response = await wsGetCompanyById(id);
      setCompany(get(response, 'data.company', {}) || {});
      setTickets(get(response, 'data.tickets.rows', []) || []);
      setCompanyAdmin(get(response, 'data.companyAdmin', null));
    } catch (e) {
      const errorMessage = get(e, 'data.message', '');
      dispatch(aOpenSnackbar(errorMessage, 'error'));
      setNotFound(true);
    } finally {
      dispatch(aSetLoadingState(false));
      setInitialLoading(false);
    }
  };

  const companyName = get(company, 'name', '') || '';
  const createdAt = get(company, 'createdAt', '') || '';
  const formalName = get(company, 'formalName', '') || '';
  const address = get(company, 'address', '') || '';
  const adminName = getFullName(companyAdmin);
  const adminImage = get(companyAdmin, 'image', '') || '';

  if (notFound) {
    return (
      <div>
        <Helmet>
          <title>Detalle de empresa</title>
        </Helmet>
        <EmptyState message="No se encontró la empresa" />
      </div>
    );
  }

  if (initialLoading) {
    return (
      <div>
        <Helmet>
          <title>Detalle de empresa</title>
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

  return (
    <MainContainer>
      <Helmet>
        <title>{companyName || 'Detalle de empresa'}</title>
      </Helmet>
      <Container>
        <TopSection>
          <div>
            <h4>{companyName}</h4>
            <div style={{ width: 'fit-content' }}>
              {`Creada el ${moment(createdAt).format('LL')}`}
            </div>
          </div>
        </TopSection>
        <Header>
          {companyAdmin && (
            <React.Fragment>
              <h5>Reponsable de la empresa</h5>
              <Link to={`/perfil/${get(companyAdmin, 'id', '')}`}>
                <div className="user">
                  <Avatar name={adminName} src={adminImage} />
                  <div className="name">{adminName}</div>
                </div>
              </Link>
            </React.Fragment>
          )}
          {formalName && (
            <React.Fragment>
              <h5>Razón social</h5>
              <div>{formalName}</div>
            </React.Fragment>
          )}
          {address && (
            <React.Fragment>
              <h5>Dirección</h5>
              <div>{address}</div>
            </React.Fragment>
          )}
        </Header>
        <Body>
          <h5>Últimos tickets</h5>
          {tickets.map(ticket => (
            <SimpleTicketItem ticket={ticket} key={ticket.id} />
          ))}
          {!tickets.length && (
            <div style={{ textAlign: 'center' }}>
              Aún no se han creado tickets
            </div>
          )}
        </Body>
      </Container>
    </MainContainer>
  );
}

CompanyDetail.propTypes = {
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
)(CompanyDetail);
