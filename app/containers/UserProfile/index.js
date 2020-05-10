/**
 *
 * UserProfile
 *
 */

import React, { memo, useEffect, useState, useRef, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { get, times } from 'lodash';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import { getFullName } from 'utils/helper';
import moment from 'moment/min/moment-with-locales';
import { LoggedUser } from 'contexts/logged-user';

import { wsGetUserProfile, wsUploadImagePicture } from 'services/profile';

import Avatar from 'components/Avatar';
import Button from 'components/Button';
import Fab from 'components/Fab';
import CreateEditUser from 'components/CreateEditUser';
import ChangePasswordDialog from 'components/ChangePasswordDialog';

import CameraAltIcon from '@material-ui/icons/CameraAlt';
import Skeleton from '@material-ui/lab/Skeleton';
import EditIcon from '@material-ui/icons/Edit';

import { useInjectReducer } from 'utils/injectReducer';
import makeSelectUserProfile from './selectors';
import reducer from './reducer';
import {
  Content,
  PersonalInfoContainer,
  ComplementInfo,
  Input,
  Span,
} from './styledComponents';

export function UserProfile({ match, dispatch }) {
  useInjectReducer({ key: 'userProfile', reducer });
  const [profile, setProfile] = useState({});
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  const currentUser = useContext(LoggedUser);
  const isMyOwnProfile = currentUser.id === get(match, 'params.id', '');

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const filesRef = useRef(null);

  const fetchUserProfile = async () => {
    try {
      const id = get(match, 'params.id', '');
      if (!id) return;
      dispatch(aSetLoadingState(true));
      const response = await wsGetUserProfile(id);
      if (response.error) {
        dispatch(aOpenSnackbar('Error al obtener perfil', 'error'));
        setNotFound(true);
      } else {
        setProfile(response.data);
      }
    } catch (e) {
      dispatch(aOpenSnackbar('Error al obtener perfil', 'error'));
      setNotFound(true);
    } finally {
      dispatch(aSetLoadingState(false));
      setLoading(false);
    }
  };

  const handleChangeFiles = async () => {
    try {
      const files = Array.from(filesRef.current.files);
      if (files.some(f => f.size > 50 * 1000000)) {
        dispatch(aOpenSnackbar('El tamaño máximo es de 50MB', 'error'));
      }
      if (!files.length) return;
      const file = files[0];
      dispatch(aSetLoadingState(true));
      const response = await wsUploadImagePicture(file);
      if (response.error) {
        dispatch(
          aOpenSnackbar('No se pudo guardar la foto de perfil', 'error'),
        );
      } else {
        dispatch(aOpenSnackbar('Foto guarda con éxito', 'success'));
        fetchUserProfile();
      }
    } catch (e) {
      dispatch(aOpenSnackbar('No se pudo guardar la foto de perfil', 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  };

  const handleOpenFileInput = () => {
    filesRef.current.click();
  };

  const handleOpenEditUser = () => {
    setEditDialogOpen(true);
  };

  if (notFound) {
    return (
      <div>
        <Helmet>
          <title>Perfil</title>
        </Helmet>
        <h1>404</h1>
        <h1>No se encontró el ticket</h1>
      </div>
    );
  }

  if (loading) {
    return (
      <Content>
        <Helmet>
          <title>Perfil</title>
        </Helmet>
        <PersonalInfoContainer className="shadow">
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
        </PersonalInfoContainer>
        <ComplementInfo className="shadow">
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
        </ComplementInfo>
      </Content>
    );
  }

  const name = getFullName(profile);
  const title = name || 'Perfil';
  const company = get(profile, 'company.name', '');
  const phoneNumber = get(profile, 'phoneNumber', '');
  const role = get(profile, 'role', '');
  const createdAt = moment(get(profile, 'createdAt', new Date())).format('LL');
  const email = get(profile, 'email', '');
  const username = get(profile, 'username', '');
  const image = get(profile, 'image', '');

  return (
    <Content>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <PersonalInfoContainer className="shadow">
        <h4>Perfil</h4>
        <div className="picture-container">
          <Avatar type="" name={name} size={120} src={image} />
          {isMyOwnProfile && (
            <Span onClick={handleOpenFileInput} className="add-picture">
              <CameraAltIcon />
            </Span>
          )}
        </div>
        <h5>Nombre</h5>
        <div>{name}</div>
        <h5>Empresa</h5>
        <div>{company}</div>
        <h5>Teléfono</h5>
        <div>{phoneNumber}</div>
        <h5>Rol</h5>
        <div>{role}</div>
        <h5>Miembro desde</h5>
        <div>{createdAt}</div>
        <h5>Correo</h5>
        <div>{email}</div>
        <h5>Username</h5>
        <div>{username}</div>
        {isMyOwnProfile && (
          <React.Fragment>
            <h5>Contraseña</h5>
            <div>
              <Button
                variant="text"
                onClick={() => setPasswordDialogOpen(true)}
              >
                Cambiar
              </Button>
            </div>
          </React.Fragment>
        )}
      </PersonalInfoContainer>
      <ComplementInfo className="shadow">
        <h4>Últimos tickets</h4>
      </ComplementInfo>
      {isMyOwnProfile && (
        <React.Fragment>
          <Input
            ref={filesRef}
            type="file"
            value=""
            onChange={handleChangeFiles}
          />
          <Fab onClick={handleOpenEditUser} icon={<EditIcon />} />
          <CreateEditUser
            open={editDialogOpen}
            onClose={() => {
              setEditDialogOpen(false);
            }}
            callback={fetchUserProfile}
            dispatch={dispatch}
            userToEdit={profile}
            fromProfile
          />
          <ChangePasswordDialog
            open={passwordDialogOpen}
            onClose={() => setPasswordDialogOpen(false)}
            callback={() => {}}
            dispatch={dispatch}
          />
        </React.Fragment>
      )}
    </Content>
  );
}

UserProfile.propTypes = {
  dispatch: PropTypes.func.isRequired,
  match: PropTypes.object,
};

const mapStateToProps = createStructuredSelector({
  userProfile: makeSelectUserProfile(),
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

export default compose(
  withConnect,
  memo,
)(UserProfile);
