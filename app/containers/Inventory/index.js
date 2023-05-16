/* eslint-disable no-unused-vars */
/**
 *
 * Inventory
 *
 */

import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { get } from 'lodash';
import moment from 'moment/min/moment-with-locales';
import { GlobalValuesContext } from 'contexts/global-values';
import { LoggedUser } from 'contexts/logged-user';
import Fab from 'components/Fab';
import Table from 'components/Table';
import EmptyState from 'components/EmptyState';
import CreateEditUser from 'components/CreateEditUser';
import SkeletonLoader from 'components/SkeletonLoader';

import { wsGetInventario } from 'services/inventario';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';

import { useInjectReducer } from 'utils/injectReducer';
import makeSelectInventario from './selectors';
import reducer from './reducer';
import getMessages from './messages';

export function Inventory(props) {
  useInjectReducer({ key: 'inventario', reducer });
  const currentUser = useContext(LoggedUser);
  const isClientAdmin =
    currentUser.role === 'client' && currentUser.isCompanyAdmin;
  const { language } = useContext(GlobalValuesContext);
  const [optionSelected, setOptionSelected] = useState(
    isClientAdmin ? 'client' : 'admin',
  );
  const [messages] = useState(getMessages(language));
  const [inventory, setInventory] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [initialLoading, setInitialLoading] = useState(true);
  const { dispatch } = props;

  const columns = [
    {
      key: 'name',
      label: messages.table.name,
      style: { minWidth: 160 },
    },
    {
      key: 'sku',
      label: messages.table.sku,
      style: { minWidth: 200 },
    },
    {
      key: 'cantidad',
      label: messages.table.cantidad,
      style: { minWidth: 160 },
    },
  ];

  const items = inventory.map(product => ({
    id: product.id,
    name: product.nombre,
    sku: product.sku,
    cantidad: product.cantidad,
    fullItem: product,
  }));

  const handleOpenEditUser = user => {
    setUserToEdit(user.fullItem);
    setDialogOpen(true);
  };

  useEffect(() => {
    fetchInventory();
  }, []);

  async function fetchInventory() {
    try {
      dispatch(aSetLoadingState(true));
      const rInventory = await wsGetInventario();
      if (rInventory.error)
        dispatch(aOpenSnackbar('Error al consultar el inventario', 'error'));
      setInventory(get(rInventory, 'data', []));
    } catch (e) {
      dispatch(aOpenSnackbar('Error al consultar el inventrio', 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
      setInitialLoading(false);
    }
  }

  const handleSelectOption = option => () => {
    setOptionSelected(option);
  };

  const handleSaveSuccess = () => {
    fetchInventory();
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  if (initialLoading) {
    return (
      <div>
        <Helmet>
          <title>Inventario</title>
        </Helmet>
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>Inventario</title>
        <meta name="description" content="crud de usuarios" />
      </Helmet>

      {Boolean(inventory.length) && (
        <Table
          columns={columns}
          items={items}
          withMenu
          isClickable
          showPagination={false}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          labelRowsPerPage="Usuarios por página"
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}
    </div>
  );
}

Inventory.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  inventario: makeSelectInventario(),
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

export default compose(withConnect)(Inventory);
