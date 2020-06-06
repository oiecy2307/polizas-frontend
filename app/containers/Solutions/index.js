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

import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import SelectMU from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Drawer from '@material-ui/core/Drawer';

import { FloatRight } from 'utils/globalStyledComponents';
import Table from 'components/Table';
import EmptyState from 'components/EmptyState';
import CreateEditSolution from 'components/CreateEditSolution';
import Fab from 'components/Fab';
import Button from 'components/Button';
import Datepicker from 'components/Datepicker';
import Select from 'components/Select';
import InputText from 'components/InputText';

import { DrawerContent, PairInputsRow, TopSection } from './styledComponents';

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

const orderOptions = [
  {
    value: 'shortName',
    label: 'Nombre',
  },
  {
    value: 'createdAt',
    label: 'Fecha de creación',
  },
];

export function Solutions({ dispatch }) {
  const [solutions, setSolutions] = useState([]);
  const [products, setProducts] = useState([]);
  const [initialLoading, setInitialLoading] = useState(true);
  const [newSolutionOpen, setNewSolutionOpen] = useState(false);
  const [solutionToEdit, setSolutionToEdit] = useState(null);
  const [filterDesc, setFilterDesc] = useState(true);
  const [filtersAsideOpen, setFiltersAsideOpen] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState('createdAt');
  const [filtersActive, setFiltersActive] = useState({
    shortName: '',
    products: [],
    startCreationDate: null,
    endCreationDate: null,
  });

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

  const handleFiltersClose = () => {
    setFiltersAsideOpen(false);
  };

  const handleChangeFilters = (field, value) => {
    setFiltersActive(f => ({
      ...f,
      [field]: value,
    }));
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

  const productsOptions = products.map(p => ({
    value: p.id,
    label: p.name,
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
      <TopSection desc={filterDesc}>
        <div className="select-container">
          <FormControl variant="outlined">
            <InputLabel id="select-label">Ordenar por</InputLabel>
            <SelectMU
              labelId="select-label"
              id="select-outlined"
              value={selectedOrder}
              onChange={e => setSelectedOrder(e.target.value)}
              label="Ordenar por"
            >
              {orderOptions.map(oo => (
                <MenuItem value={oo.value}>{oo.label}</MenuItem>
              ))}
            </SelectMU>
          </FormControl>
          <div className="arrow">
            <IconButton
              aria-label={filterDesc ? 'Ascendente' : 'Descendente'}
              onClick={() => setFilterDesc(fd => !fd)}
            >
              <ArrowUpwardIcon />
            </IconButton>
          </div>
        </div>
        <Button onClick={() => setFiltersAsideOpen(true)} variant="outlined">
          Filtrar
        </Button>
      </TopSection>
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
      <Drawer
        open={filtersAsideOpen}
        onClose={handleFiltersClose}
        anchor="right"
      >
        <DrawerContent>
          <h2>Filtros</h2>
          <InputText
            value={filtersActive.shortName}
            onChange={e => handleChangeFilters('shortName', e.target.value)}
            label="Nombre solución"
          />
          <Select
            placeholder="Productos"
            value={
              (filtersActive.products || []).length
                ? filtersActive.products
                : null
            }
            onChange={value => handleChangeFilters('products', value)}
            options={productsOptions}
            isMulti
            name="products"
          />
          <h5>Fecha de creación (rango)</h5>
          <PairInputsRow>
            <Datepicker
              language="es"
              onChange={value =>
                handleChangeFilters('startCreationDate', value)
              }
              label="Inicio"
              value={filtersActive.startCreationDate}
            />
            <Datepicker
              language="es"
              onChange={value => handleChangeFilters('endCreationDate', value)}
              label="Fin"
              value={filtersActive.endCreationDate}
            />
          </PairInputsRow>
          <FloatRight>
            <Button onClick={handleFiltersClose}>Filtrar</Button>
          </FloatRight>
        </DrawerContent>
      </Drawer>
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
