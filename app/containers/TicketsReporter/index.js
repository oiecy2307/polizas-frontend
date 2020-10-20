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
import { get, isEqual } from 'lodash';
import { makeStyles } from '@material-ui/core/styles';
import moment from 'moment/min/moment-with-locales';

import { wsGetReport, wsGetReportFilters } from 'services/tickets';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import {
  getStatusLabel,
  getFullName,
  minutesToHours,
  toMoneyFormat,
  trimObject,
  dateFormatToServer,
  formatToFolio,
} from 'utils/helper';

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
import Checkbox from '@material-ui/core/Checkbox';
import ArrowUpwardIcon from '@material-ui/icons/ArrowUpward';
import IconButton from '@material-ui/core/IconButton';
import FormControl from '@material-ui/core/FormControl';
import SelectMU from '@material-ui/core/Select';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import CloseIcon from '@material-ui/icons/Close';

import EmptyState from 'components/EmptyState';
import Label from 'components/Label';
import Fab from 'components/Fab';
import Select from 'components/Select';
import InputText from 'components/InputText';
import Datepicker from 'components/Datepicker';
import Button from 'components/Button';
import SkeletonLoader from 'components/SkeletonLoader';

import {
  DrawerContent,
  PairInputsRow,
  TopSection,
  Content,
} from './styledComponents';

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

const orderOptions = [
  {
    value: 'number',
    label: 'Folio',
  },
  {
    value: 'reportedDate',
    label: 'Fecha de creación',
  },
  {
    value: 'shortName',
    label: 'Nombre corto',
  },
  {
    value: 'invoice',
    label: 'No. de factura',
  },
  {
    value: 'companyId',
    label: 'Empresa',
  },
  {
    value: 'technicalId',
    label: 'Técnico',
  },
  {
    value: 'status',
    label: 'Estatus',
  },
  {
    value: 'priority',
    label: 'Prioridad',
  },
  {
    value: 'paid',
    label: 'Pagado',
  },
  {
    value: 'finishedDate',
    label: 'Fecha de terminación',
  },
  {
    value: 'paidDate',
    label: 'Fecha de pago',
  },
  {
    value: 'timeNeeded',
    label: 'Tiempo implementado',
  },
  {
    value: 'cost',
    label: 'Costo registrado',
  },
  {
    value: 'totalPaid',
    label: 'Total pagado',
  },
];

const getFormatedDate = date => {
  try {
    if (!date) return null;
    return moment(date).format(dateFormatToServer);
  } catch (e) {
    return null;
  }
};

export function TicketsReporter({ dispatch }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);
  const [companies, setCompanies] = useState([]);
  const [technicals, setTechnicals] = useState([]);
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [initialLoading, setInitialLoading] = useState(true);
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
    invoice: null,
    invoiced: true,
    notInvoiced: true,
    number: '',
  });
  const [fieldsActive, setFieldsActive] = useState({
    number: true,
    shortName: true,
    statuses: true,
    priority: true,
    creationDate: true,
    companies: true,
    technicals: false,
    finishDate: false,
    paid: false,
    timeUsed: false,
    cost: false,
    totalPaid: false,
    paidDate: false,
    invoice: true,
  });
  const [temporalFilters, setTemporalFilters] = useState(null);
  const [activeFieldsOpen, setActiveFieldsOpen] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState('reportedDate');
  const [filterDesc, setFilterDesc] = useState(true);

  useEffect(() => {
    fetchFilters();
  }, []);

  useEffect(() => {
    fetchTickets();
  }, [page, rowsPerPage, selectedOrder, filterDesc]);

  useEffect(() => {
    const filtersAreEqual = isEqual(filtersActive, temporalFilters);
    if (!filtersOpen && !initialLoading && !filtersAreEqual) {
      fetchTickets();
    }
    if (filtersOpen) {
      setTemporalFilters(filtersActive);
    } else {
      setTemporalFilters(null);
    }
  }, [filtersOpen]);

  const fetchFilters = async () => {
    try {
      const response = await wsGetReportFilters();
      const lCompanies = get(response, 'data.companies', []) || [];
      const lTechnicals = get(response, 'data.technicals', []) || [];
      setCompanies(lCompanies);
      setTechnicals(lTechnicals);
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
        filters: {
          ...filtersActive,
          startCreationDate: getFormatedDate(filtersActive.startCreationDate),
          endCreationDate: getFormatedDate(filtersActive.endCreationDate),
          startFinishDate: getFormatedDate(filtersActive.startFinishDate),
          endFinishDate: getFormatedDate(filtersActive.endFinishDate),
          startPaidDate: getFormatedDate(filtersActive.startPaidDate),
          endPaidDate: getFormatedDate(filtersActive.endPaidDate),
          companies: (filtersActive.companies || []).map(c => c.value),
          technicals: (filtersActive.technicals || []).map(t => t.value),
          statuses: (filtersActive.statuses || []).map(s => s.value),
          priority: (filtersActive.priority || []).map(p => p.value),
        },
        orderBy: selectedOrder || 'reportedDate',
        orientation: filterDesc ? 'DESC' : 'ASC',
      };
      const response = await wsGetReport(trimObject(filter));
      if (!response) return;
      const lCount = get(response, 'data.count', 0);
      const lItems = get(response, 'data.rows', []);
      setItems(lItems);
      setCount(lCount);
    } catch (e) {
      const error = (
        get(e, 'data.message', 'Error al obtener tickets') || ''
      ).toString();
      dispatch(aOpenSnackbar(error, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
      setInitialLoading(false);
    }
  };

  const handleClickRow = item => {
    window.open(`/tickets/${item.id}`, '_blank');
  };
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

  const handleChangeCheckbox = (field, value) => {
    setFieldsActive(f => ({
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

  if (initialLoading) {
    return (
      <div>
        <Helmet>
          <title>Reporteador de tickets</title>
        </Helmet>
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <Content>
      <Helmet>
        <title>Reporteador de tickets</title>
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
                <MenuItem value={oo.value} key={oo.value}>
                  {oo.label}
                </MenuItem>
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
        <Button onClick={() => setActiveFieldsOpen(true)} variant="outlined">
          Cambiar campos
        </Button>
      </TopSection>
      <Paper>
        {Boolean(items.length) && (
          <Table className={classes.table}>
            <TableHead>
              <TableRow>
                {fieldsActive.number && (
                  <TableCell align="left">Folio</TableCell>
                )}
                {fieldsActive.shortName && (
                  <TableCell align="left">Nombre corto</TableCell>
                )}
                {fieldsActive.statuses && (
                  <TableCell align="left">Estatus</TableCell>
                )}
                {fieldsActive.invoice && (
                  <TableCell align="left">No. de factura</TableCell>
                )}
                {fieldsActive.priority && (
                  <TableCell align="left">Prioridad</TableCell>
                )}
                {fieldsActive.creationDate && (
                  <TableCell align="right">Fecha de reporte</TableCell>
                )}
                {fieldsActive.companies && (
                  <TableCell align="left">Empresa</TableCell>
                )}
                {fieldsActive.technicals && (
                  <TableCell align="left">Técnicos</TableCell>
                )}
                {fieldsActive.finishDate && (
                  <TableCell align="right">Fecha de terminación</TableCell>
                )}
                {fieldsActive.paid && (
                  <TableCell align="left">Pagado</TableCell>
                )}
                {fieldsActive.timeUsed && (
                  <TableCell align="right">Tiempo implementado</TableCell>
                )}
                {fieldsActive.cost && (
                  <TableCell align="right">Costo reportado</TableCell>
                )}
                {fieldsActive.totalPaid && (
                  <TableCell align="right">Total pagado</TableCell>
                )}
                {fieldsActive.paidDate && (
                  <TableCell align="right">Fecha de pago</TableCell>
                )}
              </TableRow>
            </TableHead>
            <TableBody>
              {items.map(item => (
                <TableRow
                  style={{ cursor: 'pointer' }}
                  onClick={() => handleClickRow(item)}
                  key={item.id}
                >
                  {fieldsActive.number && (
                    <TableCell align="left">
                      {formatToFolio(item.number)}
                    </TableCell>
                  )}
                  {fieldsActive.shortName && (
                    <TableCell align="left">{item.shortName}</TableCell>
                  )}
                  {fieldsActive.statuses && (
                    <TableCell align="left">
                      {getStatusLabel(item.status, item.paid)}
                    </TableCell>
                  )}
                  {fieldsActive.invoice && (
                    <TableCell align="left">{item.invoice}</TableCell>
                  )}
                  {fieldsActive.priority && (
                    <TableCell align="left">
                      <div style={{ maxWidth: 110 }}>
                        <Label option={item.priority} />
                      </div>
                    </TableCell>
                  )}
                  {fieldsActive.creationDate && (
                    <TableCell align="right">{item.reportedDate}</TableCell>
                  )}
                  {fieldsActive.companies && (
                    <TableCell align="left">
                      {get(item, 'client.company.name', '')}
                    </TableCell>
                  )}
                  {fieldsActive.technicals && (
                    <TableCell align="left">
                      {getFullName(get(item, 'technical', ''))}
                    </TableCell>
                  )}
                  {fieldsActive.finishDate && (
                    <TableCell align="right">
                      {item.finishedDate || ''}
                    </TableCell>
                  )}
                  {fieldsActive.paid && (
                    <TableCell align="left">
                      {item.paid ? 'Sí' : 'No'}
                    </TableCell>
                  )}
                  {fieldsActive.timeUsed && (
                    <TableCell align="right">
                      {minutesToHours(item.timeNeeded || 0)}
                    </TableCell>
                  )}
                  {fieldsActive.cost && (
                    <TableCell align="right">
                      {toMoneyFormat(item.cost || 0)}
                    </TableCell>
                  )}
                  {fieldsActive.totalPaid && (
                    <TableCell align="right">
                      {toMoneyFormat(item.totalPaid || 0)}
                    </TableCell>
                  )}
                  {fieldsActive.paidDate && (
                    <TableCell align="right">{item.paidDate || ''}</TableCell>
                  )}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
        {Boolean(items.length) && (
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
          <IconButton
            className="close-button"
            aria-label="close"
            onClick={handleFiltersClose}
          >
            <CloseIcon />
          </IconButton>
          <InputText
            type="number"
            value={filtersActive.number}
            onChange={e => handleChangeFilters('number', e.target.value)}
            label="Folio"
            maxLength="255"
          />
          <InputText
            type="text"
            value={filtersActive.shortName}
            onChange={e => handleChangeFilters('shortName', e.target.value)}
            label="Nombre ticket"
            maxLength="255"
          />
          <InputText
            type="text"
            value={filtersActive.invoice}
            onChange={e => handleChangeFilters('invoice', e.target.value)}
            label="No. de factura"
            maxLength="255"
          />
          <Divider size="16" />
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
          <FormControlLabel
            control={
              <Switch
                checked={filtersActive.invoiced}
                onChange={e =>
                  handleChangeFilters('invoiced', e.target.checked)
                }
                name="invoiced"
                color="primary"
              />
            }
            label="Mostrar facturados"
          />
          <FormControlLabel
            control={
              <Switch
                checked={filtersActive.notInvoiced}
                onChange={e =>
                  handleChangeFilters('notInvoiced', e.target.checked)
                }
                name="notInvoiced"
                color="primary"
              />
            }
            label="Mostrar NO facturados"
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
              type="number"
              onChange={e =>
                handleChangeFilters('startTimeUsed', e.target.value)
              }
              label="Desde"
              value={filtersActive.startTimeUsed}
              maxLength="255"
            />
            <InputText
              type="number"
              onChange={e => handleChangeFilters('endTimeUsed', e.target.value)}
              label="Hasta"
              value={filtersActive.endTimeUsed}
              maxLength="255"
            />
          </PairInputsRow>
          <h5>Costo registrado (rango)</h5>
          <PairInputsRow>
            <InputText
              type="number"
              onChange={e => handleChangeFilters('startCost', e.target.value)}
              label="Desde"
              value={filtersActive.startCost}
              maxLength="255"
            />
            <InputText
              type="number"
              onChange={e => handleChangeFilters('endCost', e.target.value)}
              label="Hasta"
              value={filtersActive.endCost}
              maxLength="255"
            />
          </PairInputsRow>
          <h5>Total pagado (rango)</h5>
          <PairInputsRow>
            <InputText
              type="number"
              onChange={e =>
                handleChangeFilters('startTotalPaid', e.target.value)
              }
              label="Desde"
              value={filtersActive.startTotalPaid}
              maxLength="255"
            />
            <InputText
              type="number"
              onChange={e =>
                handleChangeFilters('endTotalPaid', e.target.value)
              }
              label="Hasta"
              value={filtersActive.endTotalPaid}
              maxLength="255"
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
      <Drawer
        open={activeFieldsOpen}
        onClose={() => setActiveFieldsOpen(false)}
        anchor="right"
      >
        <DrawerContent>
          <h2>Campos visibles</h2>
          <IconButton
            className="close-button"
            aria-label="close"
            onClick={() => setActiveFieldsOpen(false)}
          >
            <CloseIcon />
          </IconButton>
          <FormControlLabel
            control={
              <Checkbox
                checked={fieldsActive.number}
                onChange={e => handleChangeCheckbox('number', e.target.checked)}
                name="number"
                color="primary"
              />
            }
            label="Folio"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={fieldsActive.shortName}
                onChange={e =>
                  handleChangeCheckbox('shortName', e.target.checked)
                }
                name="shortName"
                color="primary"
              />
            }
            label="Nombre corto"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={fieldsActive.statuses}
                onChange={e =>
                  handleChangeCheckbox('statuses', e.target.checked)
                }
                name="statuses"
                color="primary"
              />
            }
            label="Estatus"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={fieldsActive.invoice}
                onChange={e =>
                  handleChangeCheckbox('invoice', e.target.checked)
                }
                name="invoice"
                color="primary"
              />
            }
            label="No. de factura"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={fieldsActive.priority}
                onChange={e =>
                  handleChangeCheckbox('priority', e.target.checked)
                }
                name="priority"
                color="primary"
              />
            }
            label="Prioridad"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={fieldsActive.creationDate}
                onChange={e =>
                  handleChangeCheckbox('creationDate', e.target.checked)
                }
                name="creationDate"
                color="primary"
              />
            }
            label="Fecha de reporte"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={fieldsActive.companies}
                onChange={e =>
                  handleChangeCheckbox('companies', e.target.checked)
                }
                name="companies"
                color="primary"
              />
            }
            label="Empresa"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={fieldsActive.technicals}
                onChange={e =>
                  handleChangeCheckbox('technicals', e.target.checked)
                }
                name="technicals"
                color="primary"
              />
            }
            label="Técnicos"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={fieldsActive.finishDate}
                onChange={e =>
                  handleChangeCheckbox('finishDate', e.target.checked)
                }
                name="finishDate"
                color="primary"
              />
            }
            label="Fecha de terminación"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={fieldsActive.paid}
                onChange={e => handleChangeCheckbox('paid', e.target.checked)}
                name="paid"
                color="primary"
              />
            }
            label="Pagado"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={fieldsActive.timeUsed}
                onChange={e =>
                  handleChangeCheckbox('timeUsed', e.target.checked)
                }
                name="timeUsed"
                color="primary"
              />
            }
            label="Tiempo implementado"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={fieldsActive.cost}
                onChange={e => handleChangeCheckbox('cost', e.target.checked)}
                name="cost"
                color="primary"
              />
            }
            label="Costo reportado"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={fieldsActive.totalPaid}
                onChange={e =>
                  handleChangeCheckbox('totalPaid', e.target.checked)
                }
                name="totalPaid"
                color="primary"
              />
            }
            label="Total pagado"
          />
          <FormControlLabel
            control={
              <Checkbox
                checked={fieldsActive.paidDate}
                onChange={e =>
                  handleChangeCheckbox('paidDate', e.target.checked)
                }
                name="paidDate"
                color="primary"
              />
            }
            label="Fecha de pago"
          />
          <FloatRight>
            <Button onClick={() => setActiveFieldsOpen(false)}>Guardar</Button>
          </FloatRight>
        </DrawerContent>
      </Drawer>
      {!items.length && <EmptyState text="No se encontraron tickets" />}
    </Content>
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
