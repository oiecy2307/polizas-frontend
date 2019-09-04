/**
 *
 * PorAsignar
 *
 */

import React from 'react';
import ExpandableItem from 'components/ExpandableItem';
import {
  DateDetailContainer,
  DateText,
  IconPurple,
  ItemMessage,
  ItemCompany,
  LabelPurple,
  ItemMainInfo,
} from '../styledComponents';

export function PorAsignar() {
  return (
    <div>
      <DateDetailContainer>
        <DateText>Hoy (12 de junio 2019)</DateText>
        <ExpandableItem
          header={
            <React.Fragment>
              <IconPurple />
              <ItemMainInfo>
                <ItemMessage>Error en carga de datos</ItemMessage>
                <ItemCompany>ProAgro</ItemCompany>
              </ItemMainInfo>
              <LabelPurple>Por asignar</LabelPurple>
            </React.Fragment>
          }
          content={<div>Hola</div>}
        />
        <ExpandableItem
          header={
            <React.Fragment>
              <IconPurple />
              <ItemMainInfo>
                <ItemMessage>Borrado de información</ItemMessage>
                <ItemCompany>Grupo Premier</ItemCompany>
              </ItemMainInfo>
              <LabelPurple>Por asignar</LabelPurple>
            </React.Fragment>
          }
          content={<div>Hola</div>}
        />
        <ExpandableItem
          header={
            <React.Fragment>
              <IconPurple />
              <ItemMainInfo>
                <ItemMessage>No puedo guardar archivos</ItemMessage>
                <ItemCompany>Grupo Coseco</ItemCompany>
              </ItemMainInfo>
              <LabelPurple>Por asignar</LabelPurple>
            </React.Fragment>
          }
          content={<div>Hola</div>}
        />
        <ExpandableItem
          header={
            <React.Fragment>
              <IconPurple />
              <ItemMainInfo>
                <ItemMessage>No puedo guardar archivos</ItemMessage>
                <ItemCompany>Grupo Coseco</ItemCompany>
              </ItemMainInfo>
              <LabelPurple>Por asignar</LabelPurple>
            </React.Fragment>
          }
          content={<div>Hola</div>}
        />
      </DateDetailContainer>
      <DateDetailContainer>
        <DateText>Hoy (12 de junio 2019)</DateText>
        <ExpandableItem
          header={
            <React.Fragment>
              <IconPurple />
              <ItemMainInfo>
                <ItemMessage>Error en carga de datos</ItemMessage>
                <ItemCompany>ProAgro</ItemCompany>
              </ItemMainInfo>
              <LabelPurple>Por asignar</LabelPurple>
            </React.Fragment>
          }
          content={<div>Hola</div>}
        />
        <ExpandableItem
          header={
            <React.Fragment>
              <IconPurple />
              <ItemMainInfo>
                <ItemMessage>Borrado de información</ItemMessage>
                <ItemCompany>Grupo Premier</ItemCompany>
              </ItemMainInfo>
              <LabelPurple>Por asignar</LabelPurple>
            </React.Fragment>
          }
          content={<div>Hola</div>}
        />
        <ExpandableItem
          header={
            <React.Fragment>
              <IconPurple />
              <ItemMainInfo>
                <ItemMessage>No puedo guardar archivos</ItemMessage>
                <ItemCompany>Grupo Coseco</ItemCompany>
              </ItemMainInfo>
              <LabelPurple>Por asignar</LabelPurple>
            </React.Fragment>
          }
          content={<div>Hola</div>}
        />
        <ExpandableItem
          header={
            <React.Fragment>
              <IconPurple />
              <ItemMainInfo>
                <ItemMessage>No puedo guardar archivos</ItemMessage>
                <ItemCompany>Grupo Coseco</ItemCompany>
              </ItemMainInfo>
              <LabelPurple>Por asignar</LabelPurple>
            </React.Fragment>
          }
          content={<div>Hola</div>}
        />
      </DateDetailContainer>
    </div>
  );
}

PorAsignar.propTypes = {};

export default PorAsignar;
