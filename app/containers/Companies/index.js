/**
 *
 * Companies
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import { get, times } from 'lodash';
import moment from 'moment/min/moment-with-locales';

import { wsGetCompanies } from 'services/companies';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';

import Skeleton from '@material-ui/lab/Skeleton';

import { TabButton } from 'utils/globalStyledComponents';
import Table from 'components/Table';
import Fab from 'components/Fab';
import EmptyState from 'components/EmptyState';
import CreateEditCompany from 'components/CreateEditCompany';

import AssignCompanyAdminForm from './assignCompanyAdminForm';

const columns = [
  {
    key: 'name',
    label: 'Nombre',
  },
  {
    key: 'address',
    label: 'Dirección',
  },
  {
    key: 'active',
    label: 'Estatus',
  },
  {
    key: 'createdAt',
    label: 'Creada',
  },
  {
    key: 'admin',
    label: 'Responsable',
  },
];

export function Companies({ dispatch }) {
  const [optionSelected, setOptionSelected] = useState('all');
  const [companies, setCompanies] = useState([]);
  const [newCompanyOpen, setNewCompanyOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
  const [companyToEdit, setCompanyToEdit] = useState(null);
  const [companyToAssign, setCompanyToAssign] = useState(null);

  useEffect(() => {
    fetchCompanies();
  }, []);

  const fetchCompanies = async () => {
    try {
      dispatch(aSetLoadingState(true));
      const response = await wsGetCompanies();
      const lCompanies = get(response, 'data.rows', []);
      setCompanies(lCompanies);
    } catch (e) {
      const error =
        get(e, 'data.message', 'No se pudo obtener las empresas') || '';
      dispatch(aOpenSnackbar(error, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
      setInitialLoading(false);
    }
  };

  const handleUpdateCompany = company => {
    setCompanyToEdit(company.originalItem);
    setNewCompanyOpen(true);
  };

  const handleAssignCompanyAdmin = company => {
    setCompanyToAssign(company);
  };

  const handleDeactivateCompany = () => {};

  const handleCloseDialogCompany = () => {
    setCompanyToEdit(null);
    setNewCompanyOpen(false);
  };

  const optionsMenu = [
    {
      option: 'Editar',
      action: handleUpdateCompany,
    },
    {
      option: 'Asignar responsable',
      action: handleAssignCompanyAdmin,
    },
    {
      option: 'Desactivar',
      action: handleDeactivateCompany,
    },
  ];

  const items = companies
    .filter(c => {
      if (optionSelected === 'all') return true;
      if (optionSelected === 'actives' && c.active) return true;
      if (optionSelected === 'disabled' && !c.active) return true;
      return false;
    })
    .map(c => ({
      ...c,
      name: <div className="one-line-text">{c.name}</div>,
      active: c.active ? 'Activa' : 'Desactivada',
      createdAt: (
        <div className="one-line-text">{moment(c.createdAt).format('LL')}</div>
      ),
      originalItem: c,
    }));

  if (initialLoading) {
    return (
      <div>
        <Helmet>
          <title>Empresas</title>
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
    <div>
      <Helmet>
        <title>Empresas</title>
      </Helmet>
      <div>
        <TabButton
          selected={optionSelected === 'all'}
          onClick={() => setOptionSelected('all')}
        >
          Todas
        </TabButton>
        <TabButton
          selected={optionSelected === 'actives'}
          onClick={() => setOptionSelected('actives')}
        >
          Activas
        </TabButton>
        <TabButton
          selected={optionSelected === 'disabled'}
          onClick={() => setOptionSelected('disabled')}
        >
          Desactivadas
        </TabButton>
      </div>
      <Table
        columns={columns}
        items={items}
        withMenu
        optionsMenu={optionsMenu}
        isClickable={false}
        showPagination={false}
      />
      {items.length === 0 && <EmptyState />}
      <Fab onClick={() => setNewCompanyOpen(true)} />
      <CreateEditCompany
        open={newCompanyOpen}
        onClose={handleCloseDialogCompany}
        callback={fetchCompanies}
        dispatch={dispatch}
        defaultCompany={companyToEdit}
      />
      <AssignCompanyAdminForm
        open={Boolean(companyToAssign)}
        onClose={() => setCompanyToAssign(null)}
        callback={() => {}}
        dispatch={dispatch}
        company={companyToAssign}
      />
    </div>
  );
}

Companies.propTypes = {
  dispatch: PropTypes.func.isRequired,
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
)(Companies);
