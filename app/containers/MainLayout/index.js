/**
 *
 * MainLayout
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';

import LayersIcon from '@material-ui/icons/Layers';
import NotificationsIcon from '@material-ui/icons/NotificationsOutlined';

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
  const optionSelected = children.props.location.pathname;

  const handleChangeRoute = route => () => {
    history.push(`${route}`);
  };

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
      <Flex>
        <LeftMenu>
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
        </LeftMenu>
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
