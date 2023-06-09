/* eslint-disable no-unused-vars */
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
import { LoggedUser } from 'contexts/logged-user';
import Fab from 'components/Fab';
import Table from 'components/Table';
import EmptyState from 'components/EmptyState';
import CreateEditUser from 'components/CreateEditUser';
import SkeletonLoader from 'components/SkeletonLoader';

import { wsGetUsers, wsDeleteUser } from 'services/users';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';

import { useInjectReducer } from 'utils/injectReducer';
import makeSelectUsers from './selectors';
import reducer from './reducer';
import getMessages from './messages';

export function Users(props) {
  useInjectReducer({ key: 'users', reducer });
  const currentUser = useContext(LoggedUser);
  const isClientAdmin =
    currentUser.role === 'client' && currentUser.isCompanyAdmin;
  const { language } = useContext(GlobalValuesContext);
  const [optionSelected, setOptionSelected] = useState(
    isClientAdmin ? 'client' : 'admin',
  );
  const [messages] = useState(getMessages(language));
  const [users, setUsers] = useState([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [userToEdit, setUserToEdit] = useState(null);
  const [page, setPage] = useState(0);
  const [rowsPerPage, setRowsPerPage] = useState(10);
  const [initialLoading, setInitialLoading] = useState(true);
  const { dispatch } = props;

  const columns = [
    {
      key: 'name',
      label: messages.table.name,
      style: { minWidth: 160 },
    },
    {
      key: 'email',
      label: messages.table.email,
      style: { minWidth: 200 },
    },
    {
      key: 'date',
      label: messages.table.date,
      style: { minWidth: 160 },
    },
  ];

  const items = users.map(user => ({
    id: user.id,
    name: `${user.nombre} ${user.apellidoPaterno} ${user.apellidoMaterno}`,
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
      if (user.id === currentUser.id) {
        dispatch(
          aOpenSnackbar('No puedes desactivar tu propio usuario', 'error'),
        );
        return;
      }
      dispatch(aSetLoadingState(true));
      const response = await wsDeleteUser(user.id);
      if (response.error) {
        dispatch(aOpenSnackbar('No se pudo eliminar el usuario', 'error'));
      } else {
        dispatch(aOpenSnackbar('Usuario eliminado correctamente', 'success'));
        fetchUsers();
      }
    } catch (e) {
      dispatch(aOpenSnackbar('No se pudo eliminar el usuario', 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  };

  const optionsMenu = [];

  if (!isClientAdmin) {
    optionsMenu.push({
      option: 'Editar',
      action: handleOpenEditUser,
    });
  }

  if (optionSelected !== 'inactive') {
    optionsMenu.push({
      option: 'Eliminar',
      action: handleDesactivateUser,
    });
  } else {
    optionsMenu.push({
      option: 'Activar',
      action: handleDesactivateUser,
    });
  }

  useEffect(() => {
    fetchUsers();
  }, []);

  async function fetchUsers() {
    try {
      dispatch(aSetLoadingState(true));
      const rUsers = await wsGetUsers();
      if (rUsers.error)
        dispatch(aOpenSnackbar('Error al consultar usuarios', 'error'));
      setUsers(get(rUsers, 'data', []));
    } catch (e) {
      dispatch(aOpenSnackbar('Error al consultar usuarios', 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
      setInitialLoading(false);
    }
  }

  const handleSelectOption = option => () => {
    setOptionSelected(option);
  };

  const handleSaveSuccess = () => {
    fetchUsers();
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
          <title>Usuarios</title>
        </Helmet>
        <SkeletonLoader />
      </div>
    );
  }

  return (
    <div>
      <Helmet>
        <title>Usuarios</title>
        <meta name="description" content="crud de usuarios" />
      </Helmet>

      {Boolean(users.length) && (
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
          labelRowsPerPage="Usuarios por página"
          onChangeRowsPerPage={handleChangeRowsPerPage}
        />
      )}
      <Fab onClick={() => setDialogOpen(true)} />
      {!users.length && <EmptyState />}
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
