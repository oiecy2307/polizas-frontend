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

import { TabButton, Paper, Divider } from 'utils/globalStyledComponents';
import Checkbox from '@material-ui/core/Checkbox';
import DeleteOutlinedIcon from '@material-ui/icons/DeleteOutlined';
import CreateOutlinedIcon from '@material-ui/icons/CreateOutlined';
import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';

import Button from 'components/Button';
import Input from 'components/InputText';

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

const ButtonRight = () => (
  <SaveSection>
    <Button>Guardar</Button>
  </SaveSection>
);

export function UserSettings() {
  const [optionSelected, setOptionSelected] = useState(1);
  const [emailNotifications, setEmailNotifications] = useState(false);
  const [monday, setMonday] = useState(0);

  const personalContent = (
    <React.Fragment>
      <h3>Notificaciones</h3>
      <div className="description">Activa o desactiva las notificaciones</div>
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
      <Divider size="32" />
      <ButtonRight />
    </React.Fragment>
  );

  const instanceContent = (
    <React.Fragment>
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
        <Button variant="outlined" fullWidth>
          Agregar dominio
        </Button>
      </div>
      <h3>Precio por servicio</h3>
      <div className="description">
        Define los precios correspondientes a cada fracción de tiempo
      </div>
      <Input type="number" label="1 hora" />
      <Input type="number" label="1/2 hora" />
      <Input type="number" label="< 1/2 hora" />
      <ButtonRight />
      <h3>Horario</h3>
      <div className="description">
        Esta información se mostrará en tu perfil en Suppdesk
      </div>
      {days.map(day => (
        <DayItem>
          <h4>{day}</h4>
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
            <Checkbox
              name="monday-active"
              color="primary"
              className="checkbox-day"
            />
          </div>
        </DayItem>
      ))}
      <Divider size="32" />
      <ButtonRight />
      <h3>Popup</h3>
      <div className="description">
        Configura el contenido que mostraremos en tu Popup de tickets
      </div>
      <Input type="text" label="Saludo" />
      <Input type="text" label="Entrada" />
      <Input type="text" label="Texto de botón" />
      <h1>Aquí van los checkbox</h1>
      <Divider size="32" />
      <ButtonRight />
      <h3>Información personal</h3>
      <div className="description">
        Mostraremos esta información en tu perfil
      </div>
      <Input type="url" label="Website" />
      <Input type="text" label="Nombre" />
      <Input type="tel" label="Teléfono" />
      <Input type="text" label="Dirección" />
      <Input type="file" label="Logo" />
      <Divider size="32" />
      <ButtonRight />
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
      <Paper>
        <ConfigSection>
          {optionSelected === 0 && personalContent}
          {optionSelected === 1 && instanceContent}
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
