/**
 *
 * PorAsignar
 *
 */

import React from 'react';
import ArrowExpandableIcon from '@material-ui/icons/KeyboardArrowDown';
import {
  DateDetailContainer,
  DateText,
  PorAsignarItem,
  IconPurple,
  IconContainer,
  ItemMessage,
  ItemCompany,
  LabelPurple,
  ItemMainInfo,
} from '../styledComponents';

const iconStyle = {
  color: '#919EAB',
  fontSize: 24,
  cursor: 'pointer',
};

export function PorAsignar() {
  return (
    <div>
      <DateDetailContainer>
        <DateText>Hoy (12 de junio 2019)</DateText>
        <PorAsignarItem>
          <IconPurple />
          <ItemMainInfo>
            <ItemMessage>Error en carga de datos</ItemMessage>
            <ItemCompany>ProAgro</ItemCompany>
          </ItemMainInfo>
          <LabelPurple>Por asignar</LabelPurple>
          <IconContainer>
            <ArrowExpandableIcon style={{ ...iconStyle }} />
          </IconContainer>
        </PorAsignarItem>
        <PorAsignarItem>
          <IconPurple />
          <ItemMainInfo>
            <ItemMessage>Borrado de información</ItemMessage>
            <ItemCompany>Grupo Premier</ItemCompany>
          </ItemMainInfo>
          <LabelPurple>Por asignar</LabelPurple>
          <IconContainer>
            <ArrowExpandableIcon style={{ ...iconStyle }} />
          </IconContainer>
        </PorAsignarItem>
        <PorAsignarItem>
          <IconPurple />
          <ItemMainInfo>
            <ItemMessage>No puedo guardar archivos</ItemMessage>
            <ItemCompany>Grupo Coseco</ItemCompany>
          </ItemMainInfo>
          <LabelPurple>Por asignar</LabelPurple>
          <IconContainer>
            <ArrowExpandableIcon style={{ ...iconStyle }} />
          </IconContainer>
        </PorAsignarItem>
        <PorAsignarItem>
          <IconPurple />
          <ItemMainInfo>
            <ItemMessage>No puedo guardar archivos</ItemMessage>
            <ItemCompany>Grupo Coseco</ItemCompany>
          </ItemMainInfo>
          <LabelPurple>Por asignar</LabelPurple>
          <IconContainer>
            <ArrowExpandableIcon style={{ ...iconStyle }} />
          </IconContainer>
        </PorAsignarItem>
      </DateDetailContainer>
    </div>
  );
}

PorAsignar.propTypes = {};

export default PorAsignar;
