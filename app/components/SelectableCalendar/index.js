/**
 *
 * SelectableCalendar
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import ArrowLeftIcon from '@material-ui/icons/KeyboardArrowLeft';
import ArrowRightIcon from '@material-ui/icons/KeyboardArrowRight';
import {
  Container,
  IconContainer,
  Header,
  DaysName,
  DaysContainer,
  DayItem,
} from './styledComponents';
// import styled from 'styled-components';

const iconStyle = {
  color: '#919EAB',
  fontSize: 24,
  cursor: 'pointer',
};

function SelectableCalendar({ responsive, maxResponsive }) {
  return (
    <Container responsive={responsive} maxResponsive={maxResponsive}>
      <Header>
        <IconContainer>
          <ArrowLeftIcon style={iconStyle} />
        </IconContainer>
        <span>12 de junio 2019</span>
        <IconContainer>
          <ArrowRightIcon style={iconStyle} />
        </IconContainer>
      </Header>
      <DaysName>
        <span>D</span>
        <span>L</span>
        <span>M</span>
        <span>M</span>
        <span>J</span>
        <span>V</span>
        <span>S</span>
      </DaysName>
      <DaysContainer>
        <DayItem>
          <span>1</span>
        </DayItem>
        <DayItem>
          <span>2</span>
        </DayItem>
        <DayItem>
          <span>3</span>
        </DayItem>
        <DayItem>
          <span>4</span>
        </DayItem>
        <DayItem selected>
          <span>5</span>
        </DayItem>
        <DayItem>
          <span>6</span>
        </DayItem>
        <DayItem>
          <span>7</span>
        </DayItem>
        <DayItem>
          <span>8</span>
        </DayItem>
        <DayItem>
          <span>9</span>
        </DayItem>
        <DayItem>
          <span>10</span>
        </DayItem>
        <DayItem>
          <span>11</span>
        </DayItem>
        <DayItem>
          <span>12</span>
        </DayItem>
        <DayItem>
          <span>13</span>
        </DayItem>
        <DayItem>
          <span>14</span>
        </DayItem>
        <DayItem>
          <span>15</span>
        </DayItem>
        <DayItem>
          <span>16</span>
        </DayItem>
        <DayItem>
          <span>17</span>
        </DayItem>
        <DayItem>
          <span>18</span>
        </DayItem>
        <DayItem>
          <span>19</span>
        </DayItem>
        <DayItem>
          <span>20</span>
        </DayItem>
        <DayItem>
          <span>21</span>
        </DayItem>
        <DayItem>
          <span>22</span>
        </DayItem>
        <DayItem>
          <span>23</span>
        </DayItem>
        <DayItem>
          <span>24</span>
        </DayItem>
        <DayItem>
          <span>25</span>
        </DayItem>
        <DayItem>
          <span>26</span>
        </DayItem>
        <DayItem>
          <span>27</span>
        </DayItem>
        <DayItem>
          <span>28</span>
        </DayItem>
        <DayItem>
          <span>29</span>
        </DayItem>
        <DayItem>
          <span>30</span>
        </DayItem>
        <DayItem>
          <span>31</span>
        </DayItem>
      </DaysContainer>
    </Container>
  );
}

SelectableCalendar.propTypes = {
  responsive: PropTypes.bool,
  maxResponsive: PropTypes.number,
};

SelectableCalendar.defaultProps = {
  responsive: false,
  maxResponsive: 768,
};

export default memo(SelectableCalendar);
