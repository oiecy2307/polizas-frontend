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
  MenuItem,
} from './styledComponents';

const iconStyle = {
  color: '#108043',
  fontSize: 24,
  cursor: 'pointer',
};

export function MainLayout() {
  useInjectReducer({ key: 'mainLayout', reducer });
  useInjectSaga({ key: 'mainLayout', saga });

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
          <MenuItem active>
            Ejemplo de un item
          </MenuItem>
        </LeftMenu>
      </Flex>
    </MainContainer>
  );
}

MainLayout.propTypes = {
  dispatch: PropTypes.func.isRequired,
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
