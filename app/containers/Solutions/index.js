/**
 *
 * Solutions
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
import { Link } from 'react-router-dom';

import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import { wsGetSolutions } from 'services/solutions';
import { wsGetProductsBrief } from 'services/products';

import Table from 'components/Table';
import EmptyState from 'components/EmptyState';
import CreateEditSolution from 'components/CreateEditSolution';
import Fab from 'components/Fab';

const columns = [
  {
    key: 'shortName',
    label: 'Nombre',
  },
  {
    key: 'products',
    label: 'Productos relacionados',
  },
  {
    key: 'createdAt',
    label: 'Creado',
  },
];

export function Solutions({ dispatch }) {
  const [solutions, setSolutions] = useState([]);
  const [products, setProducts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [newSolutionOpen, setNewSolutionOpen] = useState(false);
  const [solutionToEdit, setSolutionToEdit] = useState(null);

  useEffect(() => {
    fetchSolutions();
    fetchProducts();
  }, []);

  const fetchSolutions = async () => {
    try {
      dispatch(aSetLoadingState(true));
      const response = await wsGetSolutions();
      const lSolutions = get(response, 'data.rows', []);
      setSolutions(lSolutions);
      setInitialLoading(false);
    } catch (e) {
      const defaultError = 'Error al obtener soluciones';
      const error = get(e, 'data.message', defaultError) || defaultError;
      dispatch(aOpenSnackbar(error, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  };

  const fetchProducts = async () => {
    try {
      const response = await wsGetProductsBrief();
      const lProducts = get(response, 'data', []);
      setProducts(lProducts);
    } catch (e) {
      // ERROR HANDLER
    }
  };

  const handleUpdateSolution = solution => {
    setSolutionToEdit(solution.originalItem);
    setNewSolutionOpen(true);
  };

  // const handleDeleteSolution = solution => solution;

  const optionsMenu = [
    {
      option: 'Editar',
      action: handleUpdateSolution,
    },
    // {
    //   option: 'Eliminar',
    //   action: handleDeleteSolution,
    // },
  ];

  const handleCloseDialogSolution = () => {
    setNewSolutionOpen(false);
  };

  const items = solutions.map(s => ({
    ...s,
    shortName: (
      <Link to={`/soluciones/${s.id}`}>
        <div style={{ color: 'black' }}>{s.shortName}</div>
      </Link>
    ),
    products: (
      <ul style={{ paddingLeft: 14 }}>
        {s.products.map(p => (
          <li>{`${p.name} (${p.solutionProduct.version})`}</li>
        ))}
      </ul>
    ),
    createdAt: moment(s.createdAt).format('LL'),
    originalItem: s,
  }));

  if (initialLoading) {
    return (
      <div>
        <Helmet>
          <title>Soluciones</title>
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
        <title>Soluciones</title>
      </Helmet>
      <Table
        columns={columns}
        items={items}
        withMenu
        optionsMenu={optionsMenu}
        isClickable={false}
        showPagination={false}
      />
      {!solutions.length && <EmptyState />}
      <CreateEditSolution
        open={newSolutionOpen}
        onClose={handleCloseDialogSolution}
        callback={fetchSolutions}
        dispatch={dispatch}
        defaultSolution={solutionToEdit}
        products={products}
      />
      <Fab onClick={() => setNewSolutionOpen(true)} />
    </div>
  );
}

Solutions.propTypes = {
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
)(Solutions);
