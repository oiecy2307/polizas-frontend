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

export function MainLayout({ children, history }) {
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

  async function evaluateToken() {
    const token = await getToken();
    if (!token) history.push('inicio-sesion');
    const lCurrentUser = await getCurrentUser();
    setCurrentUser(lCurrentUser);
    setPageLoaded(true);
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
    await ImmortalDB.remove('user');
    await ImmortalDB.remove('token');
    history.push('/inicio-sesion');
  }

  if (!pageLoaded) return <div />;

  const menu = (
    <React.Fragment>
      <SidebarItem
        onClick={handleChangeRoute('/')}
        selected={optionSelected === '/'}
      >
        <SidebarIcon icon="dashboard" />
        <SidebarItemText>{messages.menu.dashboard}</SidebarItemText>
      </SidebarItem>
      <SidebarItem
        onClick={handleChangeRoute('/tickets')}
        selected={optionSelected === '/tickets'}
      >
        <SidebarIcon icon="tickets" />
        <SidebarItemText>{messages.menu.tickets}</SidebarItemText>
      </SidebarItem>
      <SidebarItem
        onClick={handleChangeRoute('/facturas')}
        selected={optionSelected === '/facturas'}
      >
        <SidebarIcon icon="facturas" />
        <SidebarItemText>{messages.menu.invoices}</SidebarItemText>
      </SidebarItem>
      <SidebarItem
        onClick={handleChangeRoute('/usuarios')}
        selected={optionSelected === '/usuarios'}
      >
        <SidebarIcon icon="usuarios" />
        <SidebarItemText>{messages.menu.users}</SidebarItemText>
      </SidebarItem>
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
