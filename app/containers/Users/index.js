/**
 *
 * Users
 *
 */

import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { get } from 'lodash';
import moment from 'moment/min/moment-with-locales';

import Table from '@material-ui/core/Table';
import TableBody from '@material-ui/core/TableBody';
import TableCell from '@material-ui/core/TableCell';
import TableHead from '@material-ui/core/TableHead';
import TableRow from '@material-ui/core/TableRow';
import { TabButton, Paper, FabContainer } from 'utils/globalStyledComponents';
import Fab from '@material-ui/core/Fab';
import AddIcon from '@material-ui/icons/Add';

import { wsGetUsersByType } from 'services/users';
import { setLoadingState, openSnackbar } from 'containers/App/actions';

import { useInjectReducer } from 'utils/injectReducer';
import makeSelectUsers from './selectors';
import reducer from './reducer';

moment.locale('es');

export function Users(props) {
  useInjectReducer({ key: 'users', reducer });
  const [optionSelected, setOptionSelected] = useState('admin');
  const [users, setUsers] = useState([]);

  const { dispatch } = props;

  useEffect(() => {
    fetchUsers(optionSelected);
  }, [optionSelected]);

  async function fetchUsers(type) {
    try {
      dispatch(setLoadingState(true));
      const rUsers = await wsGetUsersByType(type);
      if (rUsers.error) {
        dispatch(openSnackbar('Error al consultar usuarios', 'error'));
      }
      setUsers(get(rUsers, 'data.rows', []));
    } catch (e) {
      dispatch(openSnackbar('Error al consultar usuarios', 'error'));
    } finally {
      dispatch(setLoadingState(false));
    }
  }

  const handleSelectOption = option => () => {
    setOptionSelected(option);
  };

  return (
    <div>
      <Helmet>
        <title>Usuarios</title>
        <meta name="description" content="crud de usuarios" />
      </Helmet>
      <div>
        <TabButton
          selected={optionSelected === 'admin'}
          onClick={handleSelectOption('admin')}
        >
          Administrativos
        </TabButton>
        <TabButton
          selected={optionSelected === 'technical'}
          onClick={handleSelectOption('technical')}
        >
          Soporte
        </TabButton>
        <TabButton
          selected={optionSelected === 'salesman'}
          onClick={handleSelectOption('salesman')}
        >
          Clientes
        </TabButton>
      </div>
      <Paper>
        <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>Nombre</TableCell>
              <TableCell align="right">Correo electrónico</TableCell>
              <TableCell align="right">Username</TableCell>
              <TableCell align="right">Fecha registro</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {users.map(user => (
              <TableRow key={user.id}>
                <TableCell className="text-capitalize">
                  {`${user.name} ${user.lastname} ${user.secondLastName}`}
                </TableCell>
                <TableCell align="right">{user.email}</TableCell>
                <TableCell align="right">{user.username}</TableCell>
                <TableCell align="right">
                  {moment(user.createdAt).format('LL')}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </Paper>
      <FabContainer>
        <Fab color="primary" aria-label="add" onClick={() => {}}>
          <AddIcon />
        </Fab>
      </FabContainer>
    </div>
  );
}

Users.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  users: makeSelectUsers(),
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

export default compose(withConnect)(Users);
