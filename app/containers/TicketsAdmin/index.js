/**
 *
 * TicketsAdmin
 *
 */

import React, { memo, useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { get } from 'lodash';
import moment from 'moment';

import { wsGetTicketsByStatus } from 'services/tickets';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';

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
import { Content, LeftSection } from './styledComponents';

export function TicketsAdmin({ dispatch }) {
  useInjectReducer({ key: 'ticketsAdmin', reducer });
  useInjectSaga({ key: 'ticketsAdmin', saga });
  const [optionSelected, setOptionSelected] = useState('new');
  const [dialogOpen, setDialogOpen] = useState(false);
  const [tickets, setTickets] = useState([]);

  useEffect(() => {
    fetchTickets(optionSelected);
  }, [optionSelected]);

  async function fetchTickets(status) {
    try {
      dispatch(aSetLoadingState(true));
      const date = moment(new Date(), 'DD-MM-YYYY').format();
      const rTickets = await wsGetTicketsByStatus(status, date);
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

  const handleSelectOption = option => () => {
    setOptionSelected(option);
  };

  const handleCallback = () => {
    setDialogOpen(false);
    // TODO: fetch tickets again to refresh info
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
        <TabButton
          selected={optionSelected === 'in-progress'}
          onClick={handleSelectOption('in-progress')}
        >
          En progreso
        </TabButton>
        <TabButton
          selected={optionSelected === 'finished'}
          onClick={handleSelectOption('finished')}
        >
          Terminados
        </TabButton>
        <TabButton
          selected={optionSelected === 'closed'}
          onClick={handleSelectOption('closed')}
        >
          Cerrados
        </TabButton>
        <TabButton
          selected={optionSelected === 'cancelled'}
          onClick={handleSelectOption('cancelled')}
        >
          Cancelado
        </TabButton>
      </div>
      <Content>
        <LeftSection>
          <TicketsList tickets={tickets} />
        </LeftSection>
        <Calendar responsive maxResponsive={1190} />
      </Content>
      <Fab onClick={() => setDialogOpen(true)} />
      <CreateEditTicket
        open={dialogOpen}
        onClose={() => setDialogOpen(false)}
        dispatch={dispatch}
        callback={handleCallback}
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
