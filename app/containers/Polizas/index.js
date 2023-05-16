/**
 *
 * Polizas
 *
 */

import React, { useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { get } from 'lodash';
import { GlobalValuesContext } from 'contexts/global-values';
import { LoggedUser } from 'contexts/logged-user';
import Fab from 'components/Fab';
import Table from 'components/Table';
import EmptyState from 'components/EmptyState';
import CreateEditPoliza from 'components/CreateEditPoliza';
import SkeletonLoader from 'components/SkeletonLoader';

import { wsGetPolizas, wsDeletePoliza } from 'services/polizas';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';

import makeSelectPolizas from './selectors';
import getMessages from './messages';

export function Polizas(props) {
  const currentUser = useContext(LoggedUser);
  const isClientAdmin =
    currentUser.role === 'client' && currentUser.isCompanyAdmin;
  const { language } = useContext(GlobalValuesContext);
  const [optionSelected, setOptionSelected] = useState(
    isClientAdmin ? 'client' : 'admin',
  );
  const [messages] = useState(getMessages(language));
  const [polizas, setPolizas] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [polizaToEdit, setPolizaToEdit] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [initialLoading, setInitialLoading] = useState(true);
  const { dispatch } = props;

  const columns = [
    {
      key: 'nombreEmpleado',
      label: messages.table.nombreEmpleado,
      style: { minWidth: 200 },
    },
    {
      key: 'empleadoGenero',
      label: messages.table.empleadoGenero,
      style: { minWidth: 200 },
    },
    {
      key: 'productoSku',
      label: messages.table.productoSku,
      style: { minWidth: 160 },
    },
    {
      key: 'cantidad',
      label: messages.table.cantidad,
      style: { minWidth: 160 },
    },
    {
      key: 'fecha',
      label: messages.table.fecha,
      style: { minWidth: 200 },
    },
    {
      key: 'nombre',
      label: messages.table.nombre,
      style: { minWidth: 160 },
    },
  ];

  const items = polizas.map(poliza => ({
    id: poliza.id,
    nombreEmpleado: `${poliza.user.nombre} ${poliza.user.apellidoPaterno} ${
      poliza.user.apellidoMaterno
    }`,
    empleadoGenero: poliza.empleadoGenero,
    productoSku: poliza.inventario.sku,
    cantidad: poliza.cantidad,
    fecha: poliza.createdAt,
    nombre: poliza.inventario.nombre,
    usuarioId: poliza.userId,
    inventarioId: poliza.inventarioId,
    fullItem: poliza,
  }));

  const handleOpenEditPoliza = poliza => {
    setPolizaToEdit(poliza.fullItem);
    setDialogOpen(true);
  };

  const handleDesactivatePoliza = async poliza => {
    try {
      dispatch(aSetLoadingState(true));
      const response = await wsDeletePoliza(poliza.id);
      if (response.error) {
        dispatch(aOpenSnackbar('No se pudo eliminar la poliza', 'error'));
      } else {
        dispatch(aOpenSnackbar('Poliza eliminada correctamente', 'success'));
        fetchPolizas();
      }
    } catch (e) {
      dispatch(aOpenSnackbar('No se pudo eliminar la poliza', 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  };

  const optionsMenu = [];

  if (!isClientAdmin) {
    optionsMenu.push({
      option: 'Editar',
      action: handleOpenEditPoliza,
    });
  }

  if (optionSelected !== 'inactive') {
    optionsMenu.push({
      option: 'Eliminar',
      action: handleDesactivatePoliza,
    });
  } else {
    optionsMenu.push({
      option: 'Activar',
      action: handleDesactivatePoliza,
    });
  }

  useEffect(() => {
    fetchPolizas();
  }, []);

  async function fetchPolizas() {
    try {
      dispatch(aSetLoadingState(true));
      const rPolizas = await wsGetPolizas();
      if (rPolizas.error)
        dispatch(aOpenSnackbar('Error al consultar polizas', 'error'));
      setPolizas(get(rPolizas, 'data', []));
    } catch (e) {
      dispatch(aOpenSnackbar('Error al consultar polizas', 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
      setInitialLoading(false);
    }
  }

  const handleSelectOption = option => () => {
    setOptionSelected(option);
  };

  const handleSaveSuccess = () => {
    fetchPolizas();
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
          <title>Polizas</title>
        </Helmet>
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>Polizas</title>
        <meta name="description" content="crud de polizas" />
      </Helmet>

      {Boolean(polizas.length) && (
        <Table
          columns={columns}
          items={items}
          withMenu
          optionsMenu={optionsMenu}
          isClickable
          showPagination={false}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          labelRowsPerPage="polizas por página"
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}
      <Fab onClick={() => setDialogOpen(true)} />
      {!polizas.length && <EmptyState />}
      <CreateEditPoliza
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setPolizaToEdit(null);
        }}
        callback={handleSaveSuccess}
        dispatch={dispatch}
        polizaToEdit={polizaToEdit}
      />
    </div>
  );
}

Polizas.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  users: makeSelectPolizas(),
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

export default compose(withConnect)(Polizas);
