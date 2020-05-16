/**
 *
 * Users
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

import Table from 'components/Table';
import { TabButton } from 'utils/globalStyledComponents';
import EmptyState from 'components/EmptyState';
import CreateEditUser from 'components/CreateEditUser';

import { wsGetUsersByType, wsUpdateUser } from 'services/users';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';

import { useInjectReducer } from 'utils/injectReducer';
import makeSelectUsers from './selectors';
import reducer from './reducer';
import getMessages from './messages';

export function Users(props) {
  useInjectReducer({ key: 'users', reducer });
  const { language } = useContext(GlobalValuesContext);
  const [optionSelected, setOptionSelected] = useState('admin');
  const [messages] = useState(getMessages(language));
  const [users, setUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);

  const { dispatch } = props;

  const columns = [
    {
      key: 'name',
      label: messages.table.name,
    },
    {
      key: 'email',
      label: messages.table.email,
    },
    {
      key: 'date',
      label: messages.table.date,
    },
  ];

  const items = users.map(user => ({
    id: user.id,
    name: `${user.name} ${user.lastname} ${user.secondLastName}`,
    email: user.email,
    username: user.username,
    date: moment(user.createdAt).format('LL'),
    fullItem: user,
  }));

  const handleOpenEditUser = user => {
    setUserToEdit(user.fullItem);
    setDialogOpen(true);
  };

  const handleDesactivateUser = async user => {
    try {
      dispatch(aSetLoadingState(true));
      const response = await wsUpdateUser(user.id, { role: 'inactive' });
      if (response.error) {
        dispatch(aOpenSnackbar('No se pudo desactivar el usuario', 'error'));
      } else {
        dispatch(aOpenSnackbar('Usuario desactivado correctamente', 'success'));
        fetchUsers(optionSelected);
      }
    } catch (e) {
      dispatch(aOpenSnackbar('No se pudo desactivar el usuario', 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  };

  const optionsMenu = [
    {
      option: 'Editar',
      action: handleOpenEditUser,
    },
  ];

  if (optionSelected !== 'inactive') {
    optionsMenu.push({
      option: 'Desactivar',
      action: handleDesactivateUser,
    });
  }

  useEffect(() => {
    fetchUsers(optionSelected);
  }, [optionSelected]);

  async function fetchUsers(type) {
    try {
      dispatch(aSetLoadingState(true));
      const rUsers = await wsGetUsersByType(type);
      if (rUsers.error)
        dispatch(aOpenSnackbar('Error al consultar usuarios', 'error'));
      setUsers(get(rUsers, 'data.rows', []));
    } catch (e) {
      dispatch(aOpenSnackbar('Error al consultar usuarios', 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  }

  const handleSelectOption = option => () => {
    setOptionSelected(option);
  };

  const handleSaveSuccess = () => {
    fetchUsers(optionSelected);
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
          {messages.tabs.admins}
        </TabButton>
        <TabButton
          selected={optionSelected === 'technical'}
          onClick={handleSelectOption('technical')}
        >
          {messages.tabs.technicalSupport}
        </TabButton>
        <TabButton
          selected={optionSelected === 'salesman'}
          onClick={handleSelectOption('salesman')}
        >
          {messages.tabs.salesman}
        </TabButton>
        <TabButton
          selected={optionSelected === 'client'}
          onClick={handleSelectOption('client')}
        >
          {messages.tabs.clients}
        </TabButton>
        <TabButton
          selected={optionSelected === 'inactive'}
          onClick={handleSelectOption('inactive')}
        >
          {messages.tabs.inactive}
        </TabButton>
      </div>
      {/*
          <Paper>
          <Table aria-label="simple table">
          <TableHead>
            <TableRow>
              <TableCell>{messages.table.name}</TableCell>
              <TableCell align="right">{messages.table.email}</TableCell>
              <TableCell align="right">{messages.table.username}</TableCell>
              <TableCell align="right">{messages.table.date}</TableCell>
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
        </Paper> */}
      <Table
        columns={columns}
        items={items}
        withMenu
        optionsMenu={optionsMenu}
        isClickable={false}
        showPagination={false}
      />
      {users.length === 0 && <EmptyState small />}
      <CreateEditUser
        open={dialogOpen}
        onClose={() => {
          setDialogOpen(false);
          setUserToEdit(null);
        }}
        callback={handleSaveSuccess}
        dispatch={dispatch}
        userToEdit={userToEdit}
      />
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
