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
import firebase from 'firebase/app';
import 'firebase/messaging';
import config from 'config';
import { wsSaveToken, wsLogout, wsGetUserInfo } from 'services/auth';
import { wsGetNotificationsCount } from 'services/notifications';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';

import LayersIcon from '@material-ui/icons/Layers';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import ExitIcon from '@material-ui/icons/ExitToAppOutlined';
import AccountCircleIcon from '@material-ui/icons/AccountCircleOutlined';
import UserIcon from '@material-ui/icons/GroupOutlined';
import UserAddIcon from '@material-ui/icons/PersonAddOutlined';
import CompanyAddIcon from '@material-ui/icons/BusinessOutlined';
import Drawer from '@material-ui/core/Drawer';
import Avatar from 'components/Avatar';
import NotificationsPop from 'components/NotificationsPop';

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
  NotificationContainer,
} from './styledComponents';
import {
  SidebarIcon,
  SidebarItem,
  SidebarItemWOLink,
  SidebarItemText,
} from './icons';
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
  const [notificationsAnchorEl, setNotificationsAnchorEl] = useState(null);
  const [notificationsCount, setNotificationsCount] = useState(0);

  useEffect(() => {
    fetchUserInfo();
    window.addEventListener('focus', onFocus);
    return () => {
      window.removeEventListener('focus', onFocus);
    };
  }, []);

  const onFocus = () => {
    fetchNotificationsCount();
  };

  const fetchUserInfo = async () => {
    try {
      dispatch(aSetLoadingState(true));
      const response = await wsGetUserInfo();
      await ImmortalDB.set('user', JSON.stringify(response.data));
    } catch (e) {
      if (get(e, 'status', '') === 401) {
        handleLogOut();
      }
    } finally {
      dispatch(aSetLoadingState(false));
      evaluateToken();
      fetchNotificationsCount();
    }
  };

  const fetchNotificationsCount = async () => {
    try {
      const response = await wsGetNotificationsCount();
      if (!response.error) {
        const count = get(response, 'data', 0);
        setNotificationsCount(count > 9 ? 9 : count);
      }
    } catch (e) {
      setNotificationsCount(0);
    }
  };

  const saveToken = async (id, token) => {
    try {
      const notificationToken = await ImmortalDB.get('notificationToken');
      const body = { id, token };
      if (notificationToken && notificationToken !== token) {
        const response = wsSaveToken(body);
        if (!response.error) await ImmortalDB.set('notificationToken', token);
      } else if (!notificationToken) {
        const response = wsSaveToken(body);
        if (!response.error) await ImmortalDB.set('notificationToken', token);
      }
    } catch (e) {
      console.log(token); // eslint-disable-line no-console
    }
  };

  async function evaluateToken() {
    const token = await getToken();
    const lCurrentUser = await getCurrentUser();
    if (!token || !lCurrentUser) {
      history.push('/inicio-sesion');
      return;
    }
    setCurrentUser(lCurrentUser);
    setPageLoaded(true);

    // TOKEN NOTIFICATION LOGIC
    if (!firebase.apps.length) {
      firebase.initializeApp(config.firebaseConfig);
    }
    const messaging = firebase.messaging();

    messaging
      .requestPermission()
      .then(() => messaging.getToken())
      .then(lToken => {
        saveToken(lCurrentUser.id, lToken);
      })
      .catch(err => {
        console.log('ERROR:', err); // eslint-disable-line no-console
      });

    messaging.onTokenRefresh(() => {
      messaging
        .getToken()
        .then(refreshedToken => {
          saveToken(lCurrentUser.id, refreshedToken);
        })
        .catch(err => {
          console.log('ERROR:', err); // eslint-disable-line no-console
        });
    });

    navigator.serviceWorker.addEventListener('message', event => {
      fetchNotificationsCount();
      const message = event.data['firebase-messaging-msg-data'];
      const n = new Notification(
        message.data.title.replace(/<\/?[^>]+(>|$)/g, ''),
        {
          body: message.data.body,
          icon: message.data.icon,
        },
      );
      setTimeout(n.close.bind(n), 7000);
    });
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

  const handleChangeRoute = () => {
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
      const notificationToken = await ImmortalDB.get('notificationToken');
      await ImmortalDB.remove('user');
      await ImmortalDB.remove('token');
      await ImmortalDB.remove('notificationToken');
      const lCurrentUser = await getCurrentUser();
      if (notificationToken) {
        await wsLogout({
          id: lCurrentUser.id,
          token: notificationToken,
        });
      }
    } finally {
      history.push('/inicio-sesion');
    }
  }

  const handleOpenNotifications = event => {
    setNotificationsAnchorEl(event.currentTarget);
  };

  const handleGoToDashboard = () => {
    history.push('/');
  };

  if (!pageLoaded) return <div />;
  const isAdmin = currentUser.role === 'admin';
  const isClientAdmin =
    currentUser.role === 'client' && currentUser.isCompanyAdmin;

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
        onClick={handleChangeRoute}
        to="/tickets"
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
          onClick={handleChangeRoute}
          to="/usuarios"
          selected={optionSelected === '/usuarios'}
        >
          <UserIcon />
          <SidebarItemText>{messages.menu.users}</SidebarItemText>
        </SidebarItem>
      )}
      {(isAdmin || isClientAdmin) && (
        <SidebarItem
          onClick={handleChangeRoute}
          to="/invitaciones"
          selected={optionSelected === '/invitaciones'}
        >
          <UserAddIcon />
          <SidebarItemText>{messages.menu.invitations}</SidebarItemText>
        </SidebarItem>
      )}
      {isAdmin && (
        <SidebarItem
          onClick={handleChangeRoute}
          to="/empresas"
          selected={optionSelected === '/empresas'}
        >
          <CompanyAddIcon />
          <SidebarItemText>{messages.menu.companies}</SidebarItemText>
        </SidebarItem>
      )}
      <SidebarItem
        onClick={handleChangeRoute}
        to={`/perfil/${currentUser.id}`}
        selected={optionSelected === `/perfil/${currentUser.id}`}
      >
        <AccountCircleIcon />
        <SidebarItemText>{messages.menu.profile}</SidebarItemText>
      </SidebarItem>
      <SidebarItemWOLink onClick={handleLogOut}>
        <ExitIcon />
        <SidebarItemText>{messages.menu.logout}</SidebarItemText>
      </SidebarItemWOLink>
    </React.Fragment>
  );

  return (
    <LoggedUser.Provider value={currentUser}>
      <MainContainer>
        <TopBarContainer>
          <AlignVertical
            onClick={handleGoToDashboard}
            style={{ cursor: 'pointer' }}
          >
            <Logo>
              <LayersIcon style={{ ...iconStyle }} />
            </Logo>
            <Suppdesk>Suppdesk</Suppdesk>
          </AlignVertical>
          <AlignVertical>
            <NotificationContainer onClick={handleOpenNotifications}>
              <NotificationsIcon
                style={{ ...iconStyle, color: '#637381', marginRight: 24 }}
              />
              {notificationsCount > 0 && (
                <div className="badge">{notificationsCount}</div>
              )}
            </NotificationContainer>
            <Avatar
              name={get(currentUser, 'name', '')}
              src={get(currentUser, 'image', '')}
            />
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
      <NotificationsPop
        anchorEl={notificationsAnchorEl}
        onClose={() => setNotificationsAnchorEl(null)}
        onRefreshCount={fetchNotificationsCount}
      />
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
