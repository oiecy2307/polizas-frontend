/**
 *
 * MainLayout
 *
 */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import LayersIcon from '@material-ui/icons/Layers';
import MenuIcon from '@material-ui/icons/Menu';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';
import Drawer from '@material-ui/core/Drawer';

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
  Avatar,
  Flex,
  LeftMenu,
  Content,
  MobileMenu,
  MenuResponsive,
} from './styledComponents';
import { SidebarIcon, SidebarItem, SidebarItemText } from './icons';

const iconStyle = {
  color: '#108043',
  fontSize: 24,
  cursor: 'pointer',
};

export function MainLayout({ children, history }) {
  useInjectReducer({ key: 'mainLayout', reducer });
  useInjectSaga({ key: 'mainLayout', saga });
  const [menuOpen, setMenuOpen] = useState(false);
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

  const menu = (
    <React.Fragment>
      <SidebarItem
        onClick={handleChangeRoute('/')}
        selected={optionSelected === '/'}
      >
        <SidebarIcon icon="dashboard" />
        <SidebarItemText>Dashboard</SidebarItemText>
      </SidebarItem>
      <SidebarItem
        onClick={handleChangeRoute('/tickets')}
        selected={optionSelected === '/tickets'}
      >
        <SidebarIcon icon="tickets" />
        <SidebarItemText>Tickets</SidebarItemText>
      </SidebarItem>
      <SidebarItem
        onClick={handleChangeRoute('/facturas')}
        selected={optionSelected === '/facturas'}
      >
        <SidebarIcon icon="facturas" />
        <SidebarItemText>Facturas</SidebarItemText>
      </SidebarItem>
      <SidebarItem
        onClick={handleChangeRoute('/usuarios')}
        selected={optionSelected === '/usuarios'}
      >
        <SidebarIcon icon="usuarios" />
        <SidebarItemText>Usuarios</SidebarItemText>
      </SidebarItem>
    </React.Fragment>
  );

  return (
    <MainContainer>
      <TopBarContainer>
        <AlignVertical>
          <Logo>
            <LayersIcon style={{ ...iconStyle }} />
          </Logo>
          <Suppdesk>Suppdesk</Suppdesk>
        </AlignVertical>
        <AlignVertical>
          <NotificationsIcon style={{ ...iconStyle, color: '#637381' }} />
          <Avatar src="https://lasillarotarm.blob.core.windows.net/images/2019/06/09/lafotoineditadejosejosequegeneracontroversiaporestarenlacamacondosmujeres-focus-0-0-983-557.jpg" />
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
