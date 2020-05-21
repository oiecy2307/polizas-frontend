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

import { wsGetReport } from 'services/tickets';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import { getStatusLabel } from 'utils/helper';

import { Paper } from 'utils/globalStyledComponents';
import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import TablePagination from '@material-ui/core/TablePagination';

import EmptyState from 'components/EmptyState';
import Label from 'components/Label';

const useStyles = makeStyles({
  table: {
    minWidth: 800,
  },
});

export function TicketsReporter({ dispatch }) {
  const [items, setItems] = useState([]);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [count, setCount] = useState(0);

  useEffect(() => {
    fetchTickets();
  }, [page, rowsPerPage]);

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
