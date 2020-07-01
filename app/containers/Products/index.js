/**
 *
 * Products
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import { get, times } from 'lodash';
import moment from 'moment/min/moment-with-locales';

import Skeleton from '@material-ui/lab/Skeleton';
import { TabButton } from 'utils/globalStyledComponents';

import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import { wsGetProducts, wsUpdateProduct } from 'services/products';
import Table from 'components/Table';
import EmptyState from 'components/EmptyState';
import CreateEditProduct from 'components/CreateEditProduct';
import Fab from 'components/Fab';

const columns = [
  {
    key: 'name',
    label: 'Nombre',
    style: { minWidth: 160 },
  },
  {
    key: 'description',
    label: 'Descripción',
    style: { minWidth: 160 },
  },
  {
    key: 'actualVersion',
    label: 'Versión actual',
  },
  {
    key: 'updatedAt',
    label: 'Última actualización',
    style: { minWidth: 160 },
  },
];

export function Products({ dispatch }) {
  const [optionSelected, setOptionSelected] = useState('actives');
  const [products, setProducts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [newProductOpen, setNewProductOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchProducts();
  }, [page, rowsPerPage, optionSelected]);

  const fetchProducts = async () => {
    try {
      dispatch(aSetLoadingState(true));
      const response = await wsGetProducts(
        optionSelected,
        page * rowsPerPage,
        rowsPerPage,
      );
      const lProducts = get(response, 'data.rows', []);
      setProducts(lProducts);
      setCount(get(response, 'data.count', []));
      setInitialLoading(false);
    } catch (e) {
      const defaultError = 'Error al obtener productos';
      const error = get(e, 'data.message', defaultError) || defaultError;
      dispatch(aOpenSnackbar(error, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  };

  const handleUpdateProduct = product => {
    setProductToEdit(product.originalItem);
    setNewProductOpen(true);
  };

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

  const handleDeleteProduct = async product => {
    try {
      const { originalItem } = product;
      dispatch(aSetLoadingState(true));
      const response = await wsUpdateProduct({
        id: originalItem.id,
        active: !originalItem.active,
      });
      if (response.error) {
        dispatch(aOpenSnackbar('Error al actualizar producto', 'error'));
      } else {
        const text = !originalItem.active ? 'activado' : 'desactivado';
        dispatch(aOpenSnackbar(`Producto ${text} con éxito`, 'success'));
        fetchProducts();
      }
    } catch (e) {
      dispatch(aOpenSnackbar('Error al actualizar producto', 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  };

  const optionsMenu = [
    {
      option: 'Editar',
      action: handleUpdateProduct,
    },
    {
      option: 'Activar / desactivar',
      action: handleDeleteProduct,
    },
  ];

  if (optionSelected === 'actives') optionsMenu[1].option = 'Desactivar';
  if (optionSelected === 'disabled') optionsMenu[1].option = 'Activar';

  const handleCallBack = () => {
    fetchProducts();
    setProductToEdit(null);
  };

  const handleCloseDialogProduct = () => {
    setNewProductOpen(false);
    setProductToEdit(null);
  };

  const items = products.map(p => ({
    ...p,
    updatedAt: moment(p.updatedAt).format('LL'),
    originalItem: p,
  }));

  if (initialLoading) {
    return (
      <div>
        <Helmet>
          <title>Productos</title>
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
    <div style={{ marginBottom: 64 }}>
      <Helmet>
        <title>Productos</title>
      </Helmet>
      <div>
        <TabButton
          selected={optionSelected === 'actives'}
          onClick={() => setOptionSelected('actives')}
        >
          Activos
        </TabButton>
        <TabButton
          selected={optionSelected === 'disabled'}
          onClick={() => setOptionSelected('disabled')}
        >
          Desactivados
        </TabButton>
      </div>
      {products.length > 0 && (
        <Table
          columns={columns}
          items={items}
          withMenu
          optionsMenu={optionsMenu}
          isClickable={false}
          showPagination
          count={count}
          rowsPerPage={rowsPerPage}
          page={page}
          onChangePage={handleChangePage}
          labelRowsPerPage="Productos por página"
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}
      {!products.length && <EmptyState />}
      <CreateEditProduct
        open={newProductOpen}
        onClose={handleCloseDialogProduct}
        callback={handleCallBack}
        dispatch={dispatch}
        defaultProduct={productToEdit}
      />
      <Fab onClick={() => setNewProductOpen(true)} />
    </div>
  );
}

Products.propTypes = {
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
)(Products);
