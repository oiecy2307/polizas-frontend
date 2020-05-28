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

import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import { wsGetProducts } from 'services/products';
import Table from 'components/Table';
import EmptyState from 'components/EmptyState';
import CreateEditProduct from 'components/CreateEditProduct';
import Fab from 'components/Fab';

const columns = [
  {
    key: 'name',
    label: 'Nombre',
  },
  {
    key: 'description',
    label: 'Descripción',
  },
  {
    key: 'actualVersion',
    label: 'Versión actual',
  },
  {
    key: 'createdAt',
    label: 'Creada',
  },
];

export function Products({ dispatch }) {
  const [products, setProducts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [newProductOpen, setNewProductOpen] = useState(false);
  const [productToEdit, setProductToEdit] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      dispatch(aSetLoadingState(true));
      const response = await wsGetProducts();
      const lProducts = get(response, 'data.rows', []);
      setProducts(lProducts);
      setInitialLoading(false);
    } catch (e) {
      const error = get(e, 'data.message', '') || '';
      dispatch(aOpenSnackbar(error, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  };

  const handleUpdateProduct = product => {
    setProductToEdit(product.originalItem);
    setNewProductOpen(true);
  };

  // const handleDeleteProduct = product => product;

  const optionsMenu = [
    {
      option: 'Editar',
      action: handleUpdateProduct,
    },
    // {
    //   option: 'Eliminar',
    //   action: handleDeleteProduct,
    // },
  ];

  const handleCloseDialogProduct = () => {
    setNewProductOpen(false);
  };

  const items = products.map(p => ({
    ...p,
    createdAt: moment(p.createdAt).format('LL'),
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
    <div>
      <Helmet>
        <title>Productos</title>
      </Helmet>
      <Table
        columns={columns}
        items={items}
        withMenu
        optionsMenu={optionsMenu}
        isClickable={false}
        showPagination={false}
      />
      {!products.length && <EmptyState />}
      <CreateEditProduct
        open={newProductOpen}
        onClose={handleCloseDialogProduct}
        callback={fetchProducts}
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
