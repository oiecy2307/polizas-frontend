/**
 *
 * UserSettings
 *
 */

import React, { memo, useState } from 'react';
// import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';

import { TabButton, Paper } from 'utils/globalStyledComponents';
import Checkbox from '@material-ui/core/Checkbox';

import { Container, ConfigSection } from './styledComponents';

export function UserSettings() {
  const [optionSelected, setOptionSelected] = useState(0);
  const [emailNotifications, setEmailNotifications] = useState(false);

  return (
    <Container>
      <Helmet>
        <title>Ajustes</title>
      </Helmet>
      <div>
        <TabButton
          selected={optionSelected === 0}
          onClick={() => setOptionSelected(0)}
        >
          Personal
        </TabButton>
        <TabButton
          selected={optionSelected === 1}
          onClick={() => setOptionSelected(1)}
        >
          Instancia
        </TabButton>
      </div>
      <Paper>
        <ConfigSection>
          <h3>Notificaciones</h3>
          <div className="description">
            Activa o desactiva las notificaciones
          </div>
          <div className="item">
            <span>Correos</span>
            <Checkbox
              checked={emailNotifications}
              onChange={event => setEmailNotifications(event.target.checked)}
              name="emailNotifications"
              color="primary"
            />
          </div>
          <div className="item">
            <span>Notificaciones push</span>
            <Checkbox
              checked={emailNotifications}
              onChange={event => setEmailNotifications(event.target.checked)}
              name="emailNotifications"
              color="primary"
            />
          </div>
        </ConfigSection>
      </Paper>
    </Container>
  );
}

UserSettings.propTypes = {
  // dispatch: PropTypes.func.isRequired,
};

function mapDispatchToProps(dispatch) {
  return {
    dispatch,
  };
}

const withConnect = connect(
  null,
  mapDispatchToProps,
);

export default compose(
  withConnect,
  memo,
)(UserSettings);
