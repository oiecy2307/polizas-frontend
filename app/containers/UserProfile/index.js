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
import { Link } from 'react-router-dom';
import { compose } from 'redux';
import { get, times } from 'lodash';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import { getFullName, getIsImage, getRoleLabel } from 'utils/helper';
import moment from 'moment/min/moment-with-locales';
import { LoggedUser } from 'contexts/logged-user';

import { wsGetUserProfile, wsUploadImagePicture } from 'services/profile';
import { aReloadUserInfo } from 'containers/MainLayout/actions';

import Avatar from 'components/Avatar';
import Button from 'components/Button';
import Fab from 'components/Fab';
import CreateEditUser from 'components/CreateEditUser';
import ChangePasswordDialog from 'components/ChangePasswordDialog';
import EmptyState from 'components/EmptyState';
import ExpandableItem from 'components/ExpandableItem';
import SimpleTicketItem from 'components/SimpleTicketItem';

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
  Div,
} from './styledComponents';

export function UserProfile({ match, dispatch }) {
  useInjectReducer({ key: 'userProfile', reducer });
  const [profile, setProfile] = useState({});
  const [todayTickets, setTodayTickets] = useState([]);
  const [yesterdayTickets, setYesterdayTickets] = useState([]);
  const [restTickets, setRestTickets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [passwordDialogOpen, setPasswordDialogOpen] = useState(false);

  const id = get(match, 'params.id', '');

  const currentUser = useContext(LoggedUser);
  const isMyOwnProfile =
    currentUser.id.toString() === get(match, 'params.id', '').toString();

  useEffect(() => {
    fetchUserProfile();
  }, [id]);

  const filesRef = useRef(null);

  const fetchUserProfile = async () => {
    try {
      if (!id) return;
      dispatch(aSetLoadingState(true));
      const response = await wsGetUserProfile(id);
      if (response.error) {
        dispatch(aOpenSnackbar('Error al obtener perfil', 'error'));
        setNotFound(true);
      } else {
        setProfile(get(response, 'data.user', {}));
        setTodayTickets(get(response, 'data.todayTickets', []) || []);
        setYesterdayTickets(get(response, 'data.yesterdayTickets', []) || []);
        setRestTickets(get(response, 'data.restTickets', []) || []);
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
      const isImage = getIsImage(file.name);
      if (!isImage) {
        dispatch(
          aOpenSnackbar('Solo se aceptan formatos PNG, JPG y JPEG', 'error'),
        );
        return;
      }
      dispatch(aSetLoadingState(true));
      const response = await wsUploadImagePicture(file);
      if (response.error) {
        dispatch(
          aOpenSnackbar('No se pudo guardar la foto de perfil', 'error'),
        );
      } else {
        dispatch(aOpenSnackbar('Foto guarda con éxito', 'success'));
        fetchUserProfile();
        dispatch(aReloadUserInfo());
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
        <EmptyState message="No se encontró el perfil" />
      </div>
    );
  }

  const name = getFullName(profile);
  const title = name || 'Perfil';
  const company = get(profile, 'company.name', '');
  const companyId = get(profile, 'company.id', '');
  const phoneNumber = get(profile, 'phoneNumber', '');
  const role = get(profile, 'role', '');
  const createdAt = moment(get(profile, 'createdAt', new Date())).format('LL');
  const email = get(profile, 'email', '');
  const username = get(profile, 'username', '');
  const image = get(profile, 'image', '');

  const showRightInfo =
    isMyOwnProfile ||
    currentUser.role !== 'client' ||
    (currentUser.role === 'client' && companyId === currentUser.companyId);

  const texts = (() => {
    switch (role) {
      case 'admin':
      case 'technical':
        return [
          'Asignados recientemente',
          'Asignados ayer',
          'Asignados la semana pasada',
        ];
      case 'salesman':
        return [
          'Reportados recientemente',
          'Reportados ayer',
          'Reportados la semana pasada',
        ];
      case 'client':
        return [
          'Creados recientemente',
          'Creados ayer',
          'Creados la semana pasada',
        ];
      default:
        return [
          'Asignados recientemente',
          'Asignados ayer',
          'Asignados la semana pasada',
        ];
    }
  })();

  if (loading) {
    return (
      <Content showRightInfo={showRightInfo}>
        <Helmet>
          <title>Perfil</title>
        </Helmet>
        <PersonalInfoContainer showRightInfo={showRightInfo} className="shadow">
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
        {showRightInfo && (
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
        )}
      </Content>
    );
  }

  return (
    <Content showRightInfo={showRightInfo}>
      <Helmet>
        <title>{title}</title>
      </Helmet>
      <PersonalInfoContainer showRightInfo={showRightInfo} className="shadow">
        <h4>Perfil</h4>
        <div className="picture-container">
          <Avatar type="" name={name} size={120} src={image} />
          {isMyOwnProfile && (
            <Span onClick={handleOpenFileInput} className="add-picture">
              <CameraAltIcon />
            </Span>
          )}
        </div>
        {name && (
          <React.Fragment>
            <h5>Nombre</h5>
            <div>{name}</div>
          </React.Fragment>
        )}
        {company && (
          <React.Fragment>
            <h5>Empresa</h5>
            <Link to={`/empresas/${get(profile, 'company.id', '')}`}>
              <div>{company}</div>
            </Link>
          </React.Fragment>
        )}
        {phoneNumber && (
          <React.Fragment>
            <h5>Teléfono</h5>
            <div>{phoneNumber}</div>
          </React.Fragment>
        )}
        {role && (
          <React.Fragment>
            <h5>Rol</h5>
            <div>{getRoleLabel(role)}</div>
          </React.Fragment>
        )}
        {createdAt && (
          <React.Fragment>
            <h5>Miembro desde</h5>
            <div>{createdAt}</div>
          </React.Fragment>
        )}
        {email && (
          <React.Fragment>
            <h5>Correo</h5>
            <div>{email}</div>
          </React.Fragment>
        )}
        {username && (
          <React.Fragment>
            <h5>Username</h5>
            <div>{username}</div>
          </React.Fragment>
        )}
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
      {showRightInfo && (
        <ComplementInfo className="shadow">
          <h4>Últimos tickets</h4>
          <div className="expandibles-container">
            <ExpandableItem
              header={<div>{texts[0]}</div>}
              content={
                <div>
                  {todayTickets.map(ticket => (
                    <SimpleTicketItem ticket={ticket} key={ticket.id} />
                  ))}
                  {!todayTickets.length && <Div>Sin tickets</Div>}
                </div>
              }
            />
            <ExpandableItem
              header={<div>{texts[1]}</div>}
              content={
                <div>
                  {yesterdayTickets.map(ticket => (
                    <SimpleTicketItem ticket={ticket} key={ticket.id} />
                  ))}
                  {!yesterdayTickets.length && <Div>Sin tickets</Div>}
                </div>
              }
            />
            <ExpandableItem
              header={<div>{texts[2]}</div>}
              content={
                <div>
                  {restTickets.map(ticket => (
                    <SimpleTicketItem ticket={ticket} key={ticket.id} />
                  ))}
                  {!restTickets.length && <Div>Sin tickets</Div>}
                </div>
              }
            />
          </div>
        </ComplementInfo>
      )}
      {isMyOwnProfile && (
        <React.Fragment>
          <Input
            ref={filesRef}
            type="file"
            value=""
            onChange={handleChangeFiles}
            accept=".png, .jpg, .jpeg"
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
