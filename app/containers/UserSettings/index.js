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
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Skeleton from '@material-ui/lab/Skeleton';

import Button from 'components/Button';
import Input from 'components/InputText';

import CompanyInfo from './forms/companyInfo';

import {
  Container,
  ConfigSection,
  DomainItem,
  SaveSection,
  DayItem,
} from './styledComponents';

const days = [
  'Lunes',
  'Martes',
  'Miércoles',
  'Jueves',
  'Viernes',
  'Sábado',
  'Domingo',
];

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
  const [optionSelected, setOptionSelected] = useState(0);
  const [notificationsSettings, setNotificationsSettings] = useState({
    emailsEnabled: false,
    notificationsEnabled: false,
  });
  const [monday, setMonday] = useState(0);
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
      <CompanyInfo dispatch={dispatch} />
      <Paper>
        <ConfigSection>
          <h3>Precio por servicio</h3>
          <div className="description">
            Define los precios correspondientes a cada fracción de tiempo
          </div>
          <Input type="number" label="1 hora" />
          <Input type="number" label="1/2 hora" />
          <Input type="number" label="< 1/2 hora" />
          <ButtonRight />
        </ConfigSection>
      </Paper>
      <Paper>
        <ConfigSection>
          <h3>Popup</h3>
          <div className="description">
            Configura el contenido que mostraremos en tu Popup de tickets
          </div>
          <Input type="text" label="Texto en modo minimizado" />
          <Input type="text" label="Título" />
          <Input type="text" label="Texto introductorio" />
          <Input type="text" label="Texto de confirmación" />
          <div className="description">
            Activa o desactiva los campos que quieres solicitar a tus clientes
          </div>
          <div>
            <FormControlLabel
              control={<Checkbox name="checkedB" color="primary" />}
              label="Nombre"
            />
          </div>
          <div>
            <FormControlLabel
              control={<Checkbox name="checkedB" color="primary" />}
              label="Correo electrónico"
            />
          </div>
          <div>
            <FormControlLabel
              control={<Checkbox name="checkedB" color="primary" />}
              label="Número de teléfono"
            />
          </div>
          <div>
            <FormControlLabel
              control={<Checkbox name="checkedB" color="primary" />}
              label="Título del problema"
            />
          </div>
          <div>
            <FormControlLabel
              control={<Checkbox name="checkedB" color="primary" />}
              label="Descripción del problema"
            />
          </div>
          <div>
            <FormControlLabel
              control={<Checkbox name="checkedB" color="primary" />}
              label="Evidencia (archivos, imágenes, etc)"
            />
          </div>
          <Divider size="32" />
          <ButtonRight />
        </ConfigSection>
      </Paper>
      <Paper>
        <ConfigSection>
          <h3>Dominios</h3>
          <div className="description">
            Ingresa los dominios habilitados para usar el Popup de tickets
          </div>
          <div>
            <DomainItem>
              <div className="name">https://tecint.mx</div>
              <div className="actions">
                <DeleteOutlinedIcon className="action-icon" />
                <CreateOutlinedIcon className="action-icon" />
              </div>
            </DomainItem>
            <DomainItem>
              <div className="name">https://tecint.mx</div>
              <div className="actions">
                <DeleteOutlinedIcon className="action-icon" />
                <CreateOutlinedIcon className="action-icon" />
              </div>
            </DomainItem>
            <DomainItem>
              <div className="name">https://tecint.mx</div>
              <div className="actions">
                <DeleteOutlinedIcon className="action-icon" />
                <CreateOutlinedIcon className="action-icon" />
              </div>
            </DomainItem>
            <Button variant="contained" fullWidth color="primary">
              Agregar dominio
            </Button>
          </div>
        </ConfigSection>
      </Paper>
      <Paper>
        <ConfigSection>
          <h3>Horario</h3>
          <div className="description">
            Esta información se mostrará en tu perfil en Suppdesk
          </div>
          {days.map(day => (
            <DayItem key={day}>
              <h4>
                {day}
                <Checkbox
                  name="monday-active"
                  color="primary"
                  className="checkbox-day"
                />
              </h4>
              <div className="schedule-item">
                <div className="selects-section">
                  <FormControl variant="filled" className="select-schedule">
                    <InputLabel id="monday-label">Abre</InputLabel>
                    <Select
                      labelId="monday-label"
                      id="monday-select"
                      value={monday}
                      onChange={event => setMonday(event.target.value)}
                    >
                      <MenuItem value={0}>00:00</MenuItem>
                      <MenuItem value={30}>00:30</MenuItem>
                      <MenuItem value={60}>01:00</MenuItem>
                      <MenuItem value={90}>01:30</MenuItem>
                    </Select>
                  </FormControl>
                  <span className="separator">-</span>
                  <FormControl variant="filled" className="select-schedule">
                    <InputLabel id="tuesday-label">Cierra</InputLabel>
                    <Select
                      labelId="tuesday-label"
                      id="tuesday-select"
                      value={monday}
                    >
                      <MenuItem value={0}>00:00</MenuItem>
                      <MenuItem value={30}>00:30</MenuItem>
                      <MenuItem value={60}>01:00</MenuItem>
                      <MenuItem value={90}>01:30</MenuItem>
                    </Select>
                  </FormControl>
                </div>
              </div>
            </DayItem>
          ))}
          <Divider size="32" />
          <ButtonRight />
        </ConfigSection>
      </Paper>
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
