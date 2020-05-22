/**
 *
 * TicketsReporter
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import { get } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';

import { wsGetReport, wsGetReportFilters } from 'services/tickets';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import { getStatusLabel, getFullName } from 'utils/helper';

import { Paper, Divider, FloatRight } from 'utils/globalStyledComponents';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';
import FilterIcon from '@material-ui/icons/FilterListOutlined';
import Drawer from '@material-ui/core/Drawer';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Switch from '@material-ui/core/Switch';

import EmptyState from 'components/EmptyState';
import Label from 'components/Label';
import Fab from 'components/Fab';
import Select from 'components/Select';
import InputText from 'components/InputText';
import Datepicker from 'components/Datepicker';
import Button from 'components/Button';

import { DrawerContent, PairInputsRow } from './styledComponents';

const useStyles = makeStyles({
  table: {
    minWidth: 800,
  },
});

const statusOptions = [
  {
    value: 'new',
    label: 'Nuevo',
  },
  {
    value: 'assigned',
    label: 'Asignado',
  },
  {
    value: 'closed',
    label: 'Cerrado',
  },
];

const priorityOptions = [
  {
    value: 'low',
    label: 'Nivel bajo',
  },
  {
    value: 'medium',
    label: 'Nivel medio',
  },
  {
    value: 'high',
    label: 'Nivel alto',
  },
];

export function TicketsReporter({ dispatch }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [technicals, setTechnicals] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(true);
  const [filtersActive, setFiltersActive] = useState({
    companies: [],
    technicals: [],
    statuses: [],
    paid: true,
    notPaid: true,
    shortName: '',
    priority: [],
    startCreationDate: null,
    endCreationDate: null,
    startFinishDate: null,
    endFinishDate: null,
    startTimeUsed: '',
    endTimeUsed: '',
    startCost: '',
    endCost: '',
    startTotalPaid: '',
    endTotalPaid: '',
    startPaidDate: null,
    endPaidDate: null,
  });

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [page, rowsPerPage]);

  const fetchFilters = async () => {
    try {
      const response = await wsGetReportFilters();
      const lCompanies = get(response, 'data.companies', []) || [];
      const lTechnicals = get(response, 'data.technicals', []) || [];
      setCompanies(lCompanies);
      setTechnicals(lTechnicals);
      // setFiltersActive(f => ({
      //   ...f,
      //   companies: lCompanies.map(c => ({ value: c.id, label: c.name })),
      //   technicals: lTechnicals.map(c => ({
      //     value: c.id,
      //     label: getFullName(c),
      //   })),
      // }));
    } catch (e) {
      const error = 'No se pudo obtener filtros para el reporte';
      dispatch(aOpenSnackbar(error, 'error'));
    }
  };

  const fetchTickets = async () => {
    try {
      dispatch(aSetLoadingState(true));
      const filter = {
        offset: page * rowsPerPage,
        limit: rowsPerPage,
      };
      const response = await wsGetReport(filter);
      const lCount = get(response, 'data.count', 0);
      const lItems = get(response, 'data.rows', []);
      setItems(lItems);
      setCount(lCount);
    } catch (e) {
      const error = get(e, 'data.message', 'Error al obtener tickets') || '';
      dispatch(aOpenSnackbar(error, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  };

  const handleClickRow = item => item;
  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };
  const handleChangeRowsPerPage = event => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };
  const handleFiltersClose = () => {
    setFiltersOpen(false);
  };
  const handleChangeFilters = (field, value) => {
    setFiltersActive(f => ({
      ...f,
      [field]: value,
    }));
  };

  const companiesOptions = companies.map(c => ({ value: c.id, label: c.name }));
  const technicalsOptions = technicals.map(c => ({
    value: c.id,
    label: getFullName(c),
  }));
  const classes = useStyles();
  return (
    <div>
      <Paper>
        <Helmet>
          <title>Reporteador de tickets</title>
        </Helmet>
        <Table className={classes.table}>
          <TableHead>
            <TableRow>
              <TableCell align="left">Nombre corto</TableCell>
              <TableCell align="left">Estatus</TableCell>
              <TableCell align="left">Prioridad</TableCell>
              <TableCell align="left">Fecha de reporte</TableCell>
              <TableCell align="left">Empresa</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map(item => (
              <TableRow
                style={{ cursor: 'pointer' }}
                onClick={() => handleClickRow(item)}
                key={item.id}
              >
                <TableCell align="left">{item.shortName}</TableCell>
                <TableCell align="left">
                  {getStatusLabel(item.status, item.paid)}
                </TableCell>
                <TableCell align="left">
                  <div style={{ maxWidth: 110 }}>
                    <Label option={item.priority} />
                  </div>
                </TableCell>
                <TableCell align="left">{item.reportedDate}</TableCell>
                <TableCell align="left">
                  {get(item, 'client.company.name', '')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {items.length > 0 && (
          <TablePagination
            rowsPerPageOptions={[10, 15, 20, 30, 40, 50, 100]}
            component="div"
            count={count}
            rowsPerPage={rowsPerPage}
            page={page}
            backIconButtonProps={{
              'aria-label': 'Siguiente página',
            }}
            nextIconButtonProps={{
              'aria-label': 'Página anterior',
            }}
            SelectProps={{
              inputProps: { 'aria-label': 'Items por página' },
              native: true,
            }}
            labelRowsPerPage="Tickets por página"
            onChangePage={handleChangePage}
            labelDisplayedRows={({ from, to }) => `${from}-${to} de ${count}`}
            onChangeRowsPerPage={handleChangeRowsPerPage}
          />
        )}
      </Paper>
      <Fab icon={<FilterIcon />} onClick={() => setFiltersOpen(true)} />
      <Drawer open={filtersOpen} onClose={handleFiltersClose} anchor="right">
        <DrawerContent>
          <h2>Filtros</h2>
          <InputText
            value={filtersActive.shortName}
            onChange={e => handleChangeFilters('shortName', e.target.value)}
            label="Nombre ticket"
          />
          <Select
            placeholder="Empresas"
            value={
              (filtersActive.companies || []).length
                ? filtersActive.companies
                : null
            }
            onChange={value => handleChangeFilters('companies', value)}
            options={companiesOptions}
            isMulti
            name="companies"
          />
          <Select
            placeholder="Técnicos"
            value={
              (filtersActive.technicals || []).length
                ? filtersActive.technicals
                : null
            }
            onChange={value => handleChangeFilters('technicals', value)}
            options={technicalsOptions}
            isMulti
            name="technicals"
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
          <h5>Fecha de terminación (rango)</h5>
          <PairInputsRow>
            <Datepicker
              language="es"
              onChange={value => handleChangeFilters('startFinishDate', value)}
              label="Inicio"
              value={filtersActive.startFinishDate}
            />
            <Datepicker
              language="es"
              onChange={value => handleChangeFilters('endFinishDate', value)}
              label="Fin"
              value={filtersActive.endFinishDate}
            />
          </PairInputsRow>
          <Select
            placeholder="Estatus"
            value={
              (filtersActive.statuses || []).length
                ? filtersActive.statuses
                : null
            }
            onChange={value => handleChangeFilters('statuses', value)}
            options={statusOptions}
            isMulti
            name="statuses"
          />
          <FormControlLabel
            control={
              <Switch
                checked={filtersActive.paid}
                onChange={e => handleChangeFilters('paid', e.target.checked)}
                name="paid"
                color="primary"
              />
            }
            label="Mostrar pagados"
          />
          <FormControlLabel
            control={
              <Switch
                checked={filtersActive.notPaid}
                onChange={e => handleChangeFilters('notPaid', e.target.checked)}
                name="notPaid"
                color="primary"
              />
            }
            label="Mostrar NO pagados"
          />
          <Divider size="32" />
          <Select
            placeholder="Prioridad"
            value={
              (filtersActive.priority || []).length
                ? filtersActive.priority
                : null
            }
            onChange={value => handleChangeFilters('priority', value)}
            options={priorityOptions}
            isMulti
            name="priority"
          />
          <h5>Tiempo implementado (rango)</h5>
          <PairInputsRow>
            <InputText
              onChange={e =>
                handleChangeFilters('startTimeUsed', e.target.value)
              }
              label="Desde"
              value={filtersActive.startTimeUsed}
            />
            <InputText
              onChange={e => handleChangeFilters('endTimeUsed', e.target.value)}
              label="Hasta"
              value={filtersActive.endTimeUsed}
            />
          </PairInputsRow>
          <h5>Costo registrado (rango)</h5>
          <PairInputsRow>
            <InputText
              onChange={e => handleChangeFilters('startCost', e.target.value)}
              label="Desde"
              value={filtersActive.startCost}
            />
            <InputText
              onChange={e => handleChangeFilters('endCost', e.target.value)}
              label="Hasta"
              value={filtersActive.endCost}
            />
          </PairInputsRow>
          <h5>Total pagado (rango)</h5>
          <PairInputsRow>
            <InputText
              onChange={e =>
                handleChangeFilters('startTotalPaid', e.target.value)
              }
              label="Desde"
              value={filtersActive.startTotalPaid}
            />
            <InputText
              onChange={e =>
                handleChangeFilters('endTotalPaid', e.target.value)
              }
              label="Hasta"
              value={filtersActive.endTotalPaid}
            />
          </PairInputsRow>
          <h5>Fecha de pago (rango)</h5>
          <PairInputsRow>
            <Datepicker
              language="es"
              onChange={value => handleChangeFilters('startPaidDate', value)}
              label="Inicio"
              value={filtersActive.startPaidDate}
            />
            <Datepicker
              language="es"
              onChange={value => handleChangeFilters('endPaidDate', value)}
              label="Fin"
              value={filtersActive.endPaidDate}
            />
          </PairInputsRow>
          <FloatRight>
            <Button onClick={handleFiltersClose}>Filtrar</Button>
          </FloatRight>
        </DrawerContent>
      </Drawer>
      {!items.length && <EmptyState text="No se encontraron tickets" />}
    </div>
  );
}

TicketsReporter.propTypes = {
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
)(TicketsReporter);
