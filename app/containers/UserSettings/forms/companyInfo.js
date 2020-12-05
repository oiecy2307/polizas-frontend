import React from 'react';
import PropTypes from 'prop-types';

import { Paper, Divider } from 'utils/globalStyledComponents';
import Input from 'components/InputText';
import Button from 'components/Button';

import { ConfigSection, SaveSection } from '../styledComponents';

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

function CompanyInfo({ dispatch }) {
  console.log('dispatch', dispatch);
  return (
    <Paper>
      <ConfigSection>
        <h3>Información de empresa</h3>
        <div className="description">
          Mostraremos esta información en tu perfil
        </div>
        <Input type="url" label="Link de página" />
        <Input type="text" label="Nombre" />
        <Input type="tel" label="Teléfono" />
        <Input type="email" label="Dirección de correo" />
        <Input type="text" label="Dirección" />
        <h4>Coordenadas (ubicación de mapa)</h4>
        <div className="input-pair">
          <Input type="text" label="Latitud" />
          <Input type="text" label="Longitud" />
        </div>
        <Divider size="8" />
        <input type="file" label="Logo" />
        <Divider size="32" />
        <ButtonRight />
      </ConfigSection>
    </Paper>
  );
}

CompanyInfo.propTypes = {
  dispatch: PropTypes.func,
};

export default CompanyInfo;
