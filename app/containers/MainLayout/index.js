/**
 *
 * MainLayout
 *
 */

import React, { memo, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { getToken, getCurrentUser } from 'utils/helper';
import { GlobalValuesContext } from 'contexts/global-values';
import { LoggedUser } from 'contexts/logged-user';
import { ImmortalDB } from 'immortal-db';
import { get } from 'lodash';
import firebase from 'firebase';
import config from 'config';
import { wsSaveToken, wsLogout } from 'services/auth';
import { aOpenSnackbar } from 'containers/App/actions';

import LayersIcon from '@material-ui/icons/Layers';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import ExitIcon from '@material-ui/icons/ExitToAppOutlined';
import Drawer from '@material-ui/core/Drawer';
import Avatar from 'components/Avatar';

import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { AlignVertical } from 'utils/globalStyledComponents';
import makeSelectMainLayout from './selectors';
import reducer from './reducer';
import saga from './saga';
import {
  MainContainer,
  TopBarContainer,
  Logo,
  Suppdesk,
  Flex,
  LeftMenu,
  Content,
  MobileMenu,
  MenuResponsive,
} from './styledComponents';
import { SidebarIcon, SidebarItem, SidebarItemText } from './icons';
import getMessages from './messages';

const iconStyle = {
  color: '#108043',
  fontSize: 24,
  cursor: 'pointer',
};

export function MainLayout({ children, history, dispatch }) {
  useInjectReducer({ key: 'mainLayout', reducer });
  useInjectSaga({ key: 'mainLayout', saga });
  const { language } = useContext(GlobalValuesContext);
  const [menuOpen, setMenuOpen] = useState(false);
  const [pageLoaded, setPageLoaded] = useState(false);
  const [messages] = useState(getMessages(language));
  const [currentUser, setCurrentUser] = useState({});

  useEffect(() => {
    evaluateToken();
  }, []);

  const saveToken = async (id, token) => {
    try {
      const notificationToken = localStorage.getItem('notificationToken');
      const body = { id, token };
      if (notificationToken && notificationToken !== token) {
        const response = wsSaveToken(body);
        if (!response.error) localStorage.setItem('notificationToken', token);
      } else if (!notificationToken) {
        const response = wsSaveToken(body);
        if (!response.error) localStorage.setItem('notificationToken', token);
      }
    } catch (e) {
      console.log(token); // eslint-disable-line no-console
    }
  };

  async function evaluateToken() {
    const token = await getToken();
    if (!token) history.push('inicio-sesion');
    const lCurrentUser = await getCurrentUser();
    setCurrentUser(lCurrentUser);
    setPageLoaded(true);

    // TOKEN NOTIFICATION LOGIC
    console.log('firebase', firebase);
    if (!firebase.apps.length) {
      firebase.initializeApp(config.firebaseConfig);
    }
    const messaging = firebase.messaging();

    Notification.requestPermission().then(permission => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
        messaging
          .getToken()
          .then(lToken => {
            console.log('lToken', lToken);
            saveToken(lCurrentUser.id, lToken);
          })
          .catch(err => {
            console.log('ERROR:', err); // eslint-disable-line no-console
          });
      } else {
        console.log('Unable to get permission to notify.');
      }
    });

    // messaging
    //   .requestPermission()
    //   .then(() => messaging.getToken())
    //   .then(token => {
    //     saveToken(token);
    //   })
    //   .catch(err => {
    //     console.log('ERROR:', err); // eslint-disable-line no-console
    //   });
    //
    // messaging.onTokenRefresh(() => {
    //   messaging
    //     .getToken()
    //     .then(refreshedToken => {
    //       saveToken(refreshedToken);
    //     })
    //     .catch(err => {
    //       console.log('ERROR:', err); // eslint-disable-line no-console
    //     });
    // });
    //
    // navigator.serviceWorker.addEventListener('message', event => {
    //   const message = event.data['firebase-messaging-msg-data'];
    //   const notify = {
    //     mensaje: message.notification.title,
    //     subtitulo: message.notification.body,
    //     urlImagen: message.data.urlImagen,
    //     tipoNotificacion: message.data.tipo,
    //     visto: !message.data.visto,
    //     id: message.data.id,
    //   };
    //   const n = new Notification(
    //     notify.mensaje.replace(/<\/?[^>]+(>|$)/g, ''),
    //     // { icon: urlIcon },
    //   );
    //   setTimeout(n.close.bind(n), 7000);
    // });
  }

  const optionSelected = children.props.location.pathname;
  const optionResponsive = (() => {
    switch (optionSelected) {
      case '/':
        return 'Dashboard';
      default:
        return optionSelected.replace('/', '');
    }
  })();

  const handleChangeRoute = route => () => {
    history.push(`${route}`);
    setMenuOpen(false);
  };
  const handleChangeMenuState = () => {
    setMenuOpen(!menuOpen);
  };

  const toggleDrawer = event => {
    if (
      event.type === 'keydown' &&
      (event.key === 'Tab' || event.key === 'Shift')
    ) {
      return;
    }

    setMenuOpen(!menuOpen);
  };

  async function handleLogOut() {
    try {
      const lCurrentUser = await getCurrentUser();
      await ImmortalDB.remove('user');
      await ImmortalDB.remove('token');
      const response = await wsLogout({ id: lCurrentUser.id });
      history.push('/inicio-sesion');
      if (response.error) {
        dispatch(aOpenSnackbar('Error al cerrar sesión', 'error'));
      }
    } catch (e) {
      dispatch(aOpenSnackbar('Error al cerrar sesión', 'error'));
    }
  }

  if (!pageLoaded) return <div />;
  const isAdmin = currentUser.role === 'admin';

  const menu = (
    <React.Fragment>
      {/* <SidebarItem
        onClick={handleChangeRoute('/')}
        selected={optionSelected === '/'}
      >
        <SidebarIcon icon="dashboard" />
        <SidebarItemText>{messages.menu.dashboard}</SidebarItemText>
      </SidebarItem> */}
      <SidebarItem
        onClick={handleChangeRoute('/tickets')}
        selected={optionSelected === '/tickets'}
      >
        <SidebarIcon icon="tickets" />
        <SidebarItemText>{messages.menu.tickets}</SidebarItemText>
      </SidebarItem>
      {/* <SidebarItem
        onClick={handleChangeRoute('/facturas')}
        selected={optionSelected === '/facturas'}
      >
        <SidebarIcon icon="facturas" />
        <SidebarItemText>{messages.menu.invoices}</SidebarItemText>
      </SidebarItem> */}
      {isAdmin && (
        <SidebarItem
          onClick={handleChangeRoute('/usuarios')}
          selected={optionSelected === '/usuarios'}
        >
          <SidebarIcon icon="usuarios" />
          <SidebarItemText>{messages.menu.users}</SidebarItemText>
        </SidebarItem>
      )}
      <SidebarItem onClick={handleLogOut}>
        <ExitIcon />
        <SidebarItemText>{messages.menu.logout}</SidebarItemText>
      </SidebarItem>
    </React.Fragment>
  );

  return (
    <LoggedUser.Provider value={currentUser}>
      <MainContainer>
        <TopBarContainer>
          <AlignVertical>
            <Logo>
              <LayersIcon style={{ ...iconStyle }} />
            </Logo>
            <Suppdesk>Suppdesk</Suppdesk>
          </AlignVertical>
          <AlignVertical>
            <NotificationsIcon
              style={{ ...iconStyle, color: '#637381', marginRight: 24 }}
            />
            <Avatar name={get(currentUser, 'name', '')} />
          </AlignVertical>
        </TopBarContainer>
        <MobileMenu>
          <MenuIcon onClick={handleChangeMenuState} style={{ ...iconStyle }} />
          <h1>{optionResponsive}</h1>
          <Drawer open={menuOpen} onClose={toggleDrawer}>
            <MenuResponsive>
              <AlignVertical style={{ marginBottom: 24, paddingLeft: 10 }}>
                <Logo>
                  <LayersIcon style={{ ...iconStyle }} />
                </Logo>
                <Suppdesk>Suppdesk</Suppdesk>
              </AlignVertical>
              {menu}
            </MenuResponsive>
          </Drawer>
        </MobileMenu>
        <Flex>
          <LeftMenu>{menu}</LeftMenu>
          <Content>{children}</Content>
        </Flex>
      </MainContainer>
    </LoggedUser.Provider>
  );
}

MainLayout.propTypes = {
  dispatch: PropTypes.func,
  children: PropTypes.element,
  history: PropTypes.object.isRequired,
};

const mapStateToProps = createStructuredSelector({
  mainLayout: makeSelectMainLayout(),
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
)(MainLayout);
