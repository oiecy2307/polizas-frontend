/**
 *
 * TicketsAdmin
 *
 */

import React, { memo, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { get } from 'lodash';
import moment from 'moment/min/moment-with-locales';
import { LoggedUser } from 'contexts/logged-user';

import { wsGetTicketsByStatus, wsGetDatesWithTickets } from 'services/tickets';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import CalendarIcon from '@material-ui/icons/CalendarToday';
import FormControlLabel from '@material-ui/core/FormControlLabel';
import Checkbox from '@material-ui/core/Checkbox';

import Calendar from 'components/SelectableCalendar';
import Fab from 'components/Fab';
import CreateEditTicket from 'components/CreateEditTicket';
import { useInjectSaga } from 'utils/injectSaga';
import { useInjectReducer } from 'utils/injectReducer';
import { TabButton } from 'utils/globalStyledComponents';
import TicketsList from './privateComponents/ticketsList';
import makeSelectTicketsAdmin from './selectors';
import reducer from './reducer';
import saga from './saga';
import {
  Content,
  LeftSection,
  ColorsExplanation,
  IconCalendarContainer,
  Explanation,
} from './styledComponents';

export function TicketsAdmin({ dispatch }) {
  useInjectReducer({ key: 'ticketsAdmin', reducer });
  useInjectSaga({ key: 'ticketsAdmin', saga });
  const currentUser = useContext(LoggedUser);

  const [isTechnical] = useState(get(currentUser, 'role', '') === 'technical');
  const [optionSelected, setOptionSelected] = useState('new');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tickets, setTickets] = useState([]);
  const [selectedDateMonth, setSelectedDateMonth] = useState(
    moment(new Date(), 'DD-MM-YYYY').format(),
  );
  const [selectedDate, setSelectedDate] = useState(
    moment(new Date(), 'DD-MM-YYYY').format(),
  );
  // const [lastDatesSearch, setLastDatesSearch] = useState('');
  const [debtDates, setDebtDates] = useState([]);
  const [onTimeDates, setOnTimeDates] = useState([]);
  const [idTechnical, setIdTechnical] = useState(null);
  const [idTechnicalFirstTime, setIdTechnicalFirstTime] = useState(true);
  const [isClient] = useState(get(currentUser, 'role', '') === 'client');

  const dates = [
    ...debtDates.map(date => ({ value: date, type: 'warning' })),
    ...onTimeDates.map(date => ({ value: date, type: 'success' })),
  ];

  useEffect(() => {
    fetchTickets(optionSelected, selectedDate);
  }, [optionSelected, selectedDate]);

  useEffect(() => {
    fetchDatesWithTickets(selectedDateMonth);
  }, [selectedDateMonth]);

  useEffect(() => {
    if (idTechnicalFirstTime) {
      setIdTechnicalFirstTime(false);
      return;
    }
    fetchTickets(optionSelected, selectedDate);
    fetchDatesWithTickets(selectedDateMonth);
  }, [idTechnical]);

  async function fetchTickets(status, date) {
    try {
      dispatch(aSetLoadingState(true));
      const ldate = moment(date).format();
      let rTickets = null;
      if (isClient) {
        rTickets = await wsGetTicketsByStatus(status, ldate, currentUser.id);
      } else {
        rTickets = await wsGetTicketsByStatus(status, ldate, null, idTechnical);
      }
      if (rTickets.error) {
        dispatch(aOpenSnackbar('Error al consultar tickets', 'error'));
      } else {
        setTickets(get(rTickets, 'data.rows', []));
      }
    } catch (e) {
      dispatch(aOpenSnackbar('Error al consultar tickets', 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  }

  async function fetchDatesWithTickets(date) {
    try {
      console.log('fetchDatesWithTickets', date, selectedDateMonth);
      const momentDate = moment(date);
      const month = momentDate.month() + 1;
      const year = momentDate.year();
      // const monthYearString = `${month}-${year}`;
      // if (monthYearString === lastDatesSearch) return;
      let rDatesWTickets = null;
      if (isClient) {
        rDatesWTickets = await wsGetDatesWithTickets(
          month,
          year,
          currentUser.id,
        );
      } else {
        rDatesWTickets = await wsGetDatesWithTickets(
          month,
          year,
          null,
          idTechnical,
        );
      }
      if (rDatesWTickets.error) return;
      setDebtDates(get(rDatesWTickets, 'data.onDebt', []));
      setOnTimeDates(get(rDatesWTickets, 'data.onTime', []));
      // setLastDatesSearch(monthYearString);
    } catch (e) {
      console.error(e);
    }
  }

  const handleSelectOption = option => () => {
    setOptionSelected(option);
  };

  const handleCallback = () => {
    setDialogOpen(false);
    fetchTickets(optionSelected, selectedDate);
    fetchDatesWithTickets(selectedDateMonth);
  };

  return (
    <div>
      <Helmet>
        <title>Tickets</title>
        <meta name="description" content="Description of TicketsAdmin" />
      </Helmet>
      <div>
        <TabButton
          selected={optionSelected === 'new'}
          onClick={handleSelectOption('new')}
        >
          Por asignar
        </TabButton>
        <TabButton
          selected={optionSelected === 'assigned'}
          onClick={handleSelectOption('assigned')}
        >
          Abiertos
        </TabButton>
        {/* <TabButton
          selected={optionSelected === 'in-progress'}
          onClick={handleSelectOption('in-progress')}
        >
          En progreso
        </TabButton> */}
        {/* <TabButton
          selected={optionSelected === 'finished'}
          onClick={handleSelectOption('finished')}
        >
          Terminados
        </TabButton> */}
        <TabButton
          selected={optionSelected === 'closed'}
          onClick={handleSelectOption('closed')}
        >
          Cerrados
        </TabButton>
        {/* <TabButton
          selected={optionSelected === 'cancelled'}
          onClick={handleSelectOption('cancelled')}
        >
          Cancelado
        </TabButton> */}
      </div>
      <Content>
        <LeftSection>
          <TicketsList tickets={tickets} date={selectedDate} />
        </LeftSection>
        <div>
          {isTechnical && (
            <ColorsExplanation style={{ margin: '0 0 24px' }}>
              <FormControlLabel
                control={
                  <Checkbox
                    checked={Boolean(idTechnical)}
                    onChange={() =>
                      setIdTechnical(idTechnical ? null : currentUser.id)
                    }
                    value="idTechnical"
                    color="primary"
                  />
                }
                label="Solo mis tickets asignados"
              />
            </ColorsExplanation>
          )}
          <Calendar
            responsive
            maxResponsive={1190}
            dates={dates}
            onMonthChange={date => setSelectedDateMonth(date)}
            onChange={date => setSelectedDate(date)}
          />
          <ColorsExplanation>
            <Explanation>
              <IconCalendarContainer background="#FBEAE5" color="#DE3618">
                <CalendarIcon />
              </IconCalendarContainer>
              <span>Ticket(s) con pendiente de pago</span>
            </Explanation>
            <Explanation>
              <IconCalendarContainer background="#E3F1DF" color="#108043">
                <CalendarIcon />
              </IconCalendarContainer>
              <span>Ticket(s) sin adeudo</span>
            </Explanation>
          </ColorsExplanation>
        </div>
      </Content>
      <Fab onClick={() => setDialogOpen(true)} />
      <CreateEditTicket
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        dispatch={dispatch}
        callback={handleCallback}
        isClient={isClient}
      />
    </div>
  );
}

TicketsAdmin.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  ticketsAdmin: makeSelectTicketsAdmin(),
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
)(TicketsAdmin);
