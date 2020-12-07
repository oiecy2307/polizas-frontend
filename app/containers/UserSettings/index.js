/**
 *
 * UserSettings
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import { get, times } from 'lodash';

import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import { wsGetUsersSettings, wsUpdateUsersSettings } from 'services/users';

import { TabButton, Paper, Divider } from 'utils/globalStyledComponents';
import Checkbox from '@material-ui/core/Checkbox';
import Skeleton from '@material-ui/lab/Skeleton';

import Button from 'components/Button';

import CompanyInfo from './forms/companyInfo';
import CostConfig from './forms/costConfig';
import PopupConfig from './forms/popupConfig';
import ValidOrigins from './forms/validOrigins';
import Schedules from './forms/schedules';

import { Container, ConfigSection, SaveSection } from './styledComponents';

const ButtonRight = ({ disabled, onClick }) => (
  <SaveSection>
    <Button disabled={disabled} onClick={onClick}>
      Guardar
    </Button>
  </SaveSection>
);

ButtonRight.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

export function UserSettings({ dispatch }) {
  const [optionSelected, setOptionSelected] = useState(1);
  const [notificationsSettings, setNotificationsSettings] = useState({
    emailsEnabled: false,
    notificationsEnabled: false,
  });
  const [initialSettings, setInitialSettings] = useState(null);
  const [initialLoading, setInitialLoading] = useState(true);

  useEffect(() => {
    fetchSettings();
  }, []);

  const fetchSettings = async () => {
    try {
      dispatch(aSetLoadingState(true));
      const response = await wsGetUsersSettings();
      const settings = get(response, 'data', null);
      setInitialSettings(settings);
      setNotificationsSettings({
        emailsEnabled: get(settings, 'emailsEnabled', false),
        notificationsEnabled: get(settings, 'notificationsEnabled', false),
      });
      setInitialLoading(false);
    } catch (e) {
      const errorMessage =
        get(e, 'data.message', '') || 'Error al obtener configuración';
      dispatch(aOpenSnackbar(errorMessage, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  };

  const handleSaveNotificationsSettings = async () => {
    try {
      dispatch(aSetLoadingState(true));
      await wsUpdateUsersSettings(notificationsSettings);
      dispatch(aOpenSnackbar('Cambios guardados', 'success'));
      setInitialSettings(_initialSettings => ({
        ..._initialSettings,
        ...notificationsSettings,
      }));
    } catch (e) {
      const errorMessage =
        get(e, 'data.message', '') || 'Ocurrió un error, intente de nuevo';
      dispatch(aOpenSnackbar(errorMessage, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  };

  const handleNotificationsSettingsChange = event => {
    setNotificationsSettings(_notificationsSettings => ({
      ..._notificationsSettings,
      [event.target.name]: event.target.checked,
    }));
  };

  const notificationsButtonDisabled =
    get(initialSettings, 'emailsEnabled', false) ===
      get(notificationsSettings, 'emailsEnabled', false) &&
    get(initialSettings, 'notificationsEnabled', false) ===
      get(notificationsSettings, 'notificationsEnabled', false);

  if (initialLoading) {
    return (
      <Container>
        <Helmet>
          <title>Ajustes</title>
        </Helmet>
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
      </Container>
    );
  }

  const personalContent = (
    <Paper>
      <ConfigSection>
        <h3>Notificaciones</h3>
        <div className="description">Activa o desactiva las notificaciones</div>
        <div className="item">
          <span>Correos</span>
          <Checkbox
            checked={notificationsSettings.emailsEnabled}
            onChange={handleNotificationsSettingsChange}
            name="emailsEnabled"
            color="primary"
          />
        </div>
        <div className="item">
          <span>Notificaciones push</span>
          <Checkbox
            checked={notificationsSettings.notificationsEnabled}
            onChange={handleNotificationsSettingsChange}
            name="notificationsEnabled"
            color="primary"
          />
        </div>
        <Divider size="32" />
        <ButtonRight
          disabled={notificationsButtonDisabled}
          onClick={handleSaveNotificationsSettings}
        />
      </ConfigSection>
    </Paper>
  );

  const instanceContent = (
    <React.Fragment>
      <CompanyInfo
        dispatch={dispatch}
        instance={get(initialSettings, 'instance', {})}
      />
      <CostConfig
        dispatch={dispatch}
        instance={get(initialSettings, 'instance', {})}
      />
      <PopupConfig
        dispatch={dispatch}
        instance={get(initialSettings, 'instance', {})}
      />
      <ValidOrigins
        dispatch={dispatch}
        instance={get(initialSettings, 'instance', {})}
      />
      <Schedules
        dispatch={dispatch}
        instance={get(initialSettings, 'instance', {})}
      />
    </React.Fragment>
  );

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
      <div className="content">
        {optionSelected === 0 && personalContent}
        {optionSelected === 1 && instanceContent}
      </div>
    </Container>
  );
}

UserSettings.propTypes = {
  dispatch: PropTypes.func.isRequired,
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
