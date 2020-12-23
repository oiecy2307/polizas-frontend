/**
 *
 * DashboardBackoffice
 *
 */

import React, { memo, useState, useEffect, useContext } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { createStructuredSelector } from 'reselect';
import { compose } from 'redux';
import { get, times } from 'lodash';
import { PieChart, Pie, Tooltip } from 'recharts';
import { GlobalValuesContext } from 'contexts/global-values';
import { LoggedUser } from 'contexts/logged-user';
import { Link } from 'react-router-dom';

import LayersIcon from '@material-ui/icons/Layers';
import DoneIcon from '@material-ui/icons/Done';
import ContactIcon from '@material-ui/icons/Build';
import WarningIcon from '@material-ui/icons/ErrorOutlined';
import CloseIcon from '@material-ui/icons/Close';
import Money from '@material-ui/icons/AttachMoney';
import Skeleton from '@material-ui/lab/Skeleton';
import Popover from '@material-ui/core/Popover';

import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';
import { wsGetDashboardInformation } from 'services/dashboard';
import { getStatusLabel, getFullName, formatToFolio } from 'utils/helper';
import PieChartItem from 'components/PieChartItem';
import Avatar from 'components/Avatar';
import EmptyState from 'components/EmptyState';
import TimeTracker from 'components/TimeTracker';

import makeSelectDashboardBackoffice from './selectors';
import {
  Content,
  Paper,
  TechnicalCheckbox,
  PersonalInfo,
  Label,
  IconGreen,
  ItemMessage,
  ItemCompany,
  ItemMainInfo,
  TodayTicketsSection,
  PopoverContent,
} from './styledComponents';

const getIcon = ticket => {
  if (ticket.status === 'closed' && !ticket.paid) {
    return <Money />;
  }
  switch (ticket.status) {
    case 'new':
      return <WarningIcon />;
    case 'assigned':
      return <ContactIcon />;
    case 'closed':
      return <DoneIcon />;
    case 'cancelled':
      return <CloseIcon />;
    default:
      return <LayersIcon />;
  }
};

export function DashboardBackoffice({ dispatch }) {
  const [initialLoading, setInitialLoading] = useState(true);
  const [ticketStatusCount, setTicketStatusCount] = useState([]);
  const [technicalsWork, setTechnicalsWork] = useState([]);
  const [technicalsActivity, setTechnicalsActivity] = useState([]);
  const [todayTickets, setTodayTickets] = useState([]);
  const [openTickets, setOpenTickets] = useState([]);
  const [clientTickets, setClientTickets] = useState([]);
  const [ticketsByCompany, setTicketsByCompany] = useState([]);
  const [ticketsPopover, setTicketsPopover] = useState(null);
  const [ticketsPopoverAnchorEl, setTicketsPopoverAnchorEl] = useState(null);
  const { isResponsiveXs } = useContext(GlobalValuesContext);
  const currentUser = useContext(LoggedUser);

  const isAdmin =
    currentUser.role === 'admin' || currentUser.role === 'salesman';
  const isTechnical = currentUser.role === 'technical';
  const isClient = currentUser.role === 'client';

  useEffect(() => {
    fetchDashboardInformation();
  }, []);

  const fetchDashboardInformation = async () => {
    try {
      dispatch(aSetLoadingState(true));
      const response = await wsGetDashboardInformation();
      if (response) {
        const statuses = get(response, 'data.ticketStatusCount', []);
        const technicals = get(response, 'data.technicalsWork', []);
        const technicalsOfDay = get(response, 'data.technicalsWorkOfDay', []);
        const lTodayTickets = get(response, 'data.todayTickets', []);
        const lOpenTickets = get(response, 'data.openTickets', []);
        const lClientTickets = get(response, 'data.clientTickets', []);
        const lTicketsByCompany = get(response, 'data.ticketCompanyCount', []);
        setTicketStatusCount(
          statuses.map(status => ({
            name: getStatusLabel(status.status),
            label: getStatusLabel(status.status),
            value: status.count,
          })),
        );
        setTechnicalsWork(
          technicals.map(t => ({
            name: getFullName(t.technical),
            label: get(t, 'technical.name', ''),
            value: t.count,
          })),
        );
        setTicketsByCompany(
          lTicketsByCompany.map(t => ({
            name: t.companyName || 'Anónimos',
            label: t.companyName || 'Anónimos',
            value: t.count,
          })),
        );
        setTechnicalsActivity(technicalsOfDay);
        setTodayTickets(lTodayTickets);
        setOpenTickets(lOpenTickets);
        setClientTickets(lClientTickets);
      }
      setInitialLoading(false);
    } catch (e) {
      const error = (get(e, 'data.message', '') || '').toString();
      dispatch(aOpenSnackbar(error, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  };

  const handleOpenTechnicalsTicketsPopover = (event, technical) => {
    event.preventDefault(); // Evita evento del link
    setTicketsPopoverAnchorEl(event.currentTarget);
    setTicketsPopover(get(technical, 'technicalTickets', false) || []);
  };

  const handleCloseTicketsPopover = () => {
    setTicketsPopoverAnchorEl(null);
    setTicketsPopover(null);
  };

  if (initialLoading) {
    return (
      <div>
        <Helmet>
          <title>Inicio</title>
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
      </div>
    );
  }

  return (
    <Content>
      <Helmet>
        <title>Inicio</title>
      </Helmet>
      {(isAdmin || isTechnical) && (
        <Paper>
          <h3>Actividad actual de técnicos</h3>
          {technicalsActivity.map(technical => (
            <Link to={`/perfil/${technical.id}`} key={technical.id}>
              <TechnicalCheckbox key={technical.id}>
                {!isResponsiveXs && (
                  <Avatar src={technical.image} name={technical.name} />
                )}
                <PersonalInfo>
                  <div className="name text-ellipsis">
                    {getFullName(technical)}
                  </div>
                  <div className="email text-ellipsis">{technical.email}</div>
                </PersonalInfo>
                {get(technical, 'technicalTickets', []).length > 0 ? (
                  <Label
                    onClick={event =>
                      handleOpenTechnicalsTicketsPopover(event, technical)
                    }
                    background="#FBEAE5"
                    color="#DE3618"
                  >
                    {`${get(technical, 'technicalTickets', []).length} ${
                      get(technical, 'technicalTickets', []).length === 1
                        ? 'ticket'
                        : 'tickets'
                    }`}
                  </Label>
                ) : (
                  <Label onClick={event => event.preventDefault()}>Libre</Label>
                )}
              </TechnicalCheckbox>
            </Link>
          ))}
        </Paper>
      )}
      {(isAdmin || isTechnical) && (
        <Paper>
          <h3>Tickets abiertos</h3>
          {!openTickets.length && (
            <EmptyState small message="¡Felicidades, estás al día!" />
          )}
          <TodayTicketsSection>
            {openTickets.map(ticket => (
              <div className="item" key={ticket.id}>
                <IconGreen
                  isRed={
                    (ticket.status === 'closed' && !ticket.paid) ||
                    ticket.status === 'cancelled'
                  }
                >
                  {getIcon(ticket)}
                </IconGreen>
                <ItemMainInfo>
                  <Link to={`/tickets/${ticket.id}`}>
                    <ItemMessage>{ticket.shortName}</ItemMessage>
                    <div className="formal-name">
                      <span style={{ color: '#108043' }}>
                        Folio #{formatToFolio(get(ticket, 'number', ''))}
                      </span>
                    </div>
                    <div className="formal-name">
                      {get(ticket, 'client.company.name', 'Ticket anónimo')}
                    </div>
                  </Link>
                  <TimeTracker
                    ticket={ticket}
                    dispatch={dispatch}
                    onTimeChanged={() => {}}
                  />
                  {/*
                  <ItemCompany>
                    {get(ticket, 'client.company.name', '-')}
                  </ItemCompany>
                  */}
                </ItemMainInfo>
              </div>
            ))}
          </TodayTicketsSection>
        </Paper>
      )}
      {(isAdmin || isTechnical) && (
        <Paper>
          <h3>Tickets del día</h3>
          {!todayTickets.length && (
            <EmptyState small message="Aún sin tickets" />
          )}
          <TodayTicketsSection>
            {todayTickets.map(ticket => (
              <div className="item" key={ticket.id}>
                <IconGreen
                  isRed={
                    (ticket.status === 'closed' && !ticket.paid) ||
                    ticket.status === 'cancelled'
                  }
                >
                  {getIcon(ticket)}
                </IconGreen>
                <ItemMainInfo>
                  <Link to={`/tickets/${ticket.id}`}>
                    <ItemMessage>{ticket.shortName}</ItemMessage>
                    <div className="formal-name">
                      Folio #{formatToFolio(get(ticket, 'number', ''))}
                    </div>
                  </Link>
                  <ItemCompany>
                    {get(ticket, 'client.company.name', '-')}
                  </ItemCompany>
                </ItemMainInfo>
              </div>
            ))}
          </TodayTicketsSection>
        </Paper>
      )}
      {isClient && (
        <Paper>
          <h3>Últimos tickets abiertos</h3>
          {!clientTickets.length && (
            <EmptyState small message="Aún sin tickets" />
          )}
          <TodayTicketsSection>
            {clientTickets.map(ticket => (
              <div className="item" key={ticket.id}>
                <IconGreen isRed={ticket.status === 'closed' && !ticket.paid}>
                  {getIcon(ticket)}
                </IconGreen>
                <ItemMainInfo>
                  <Link to={`/tickets/${ticket.id}`}>
                    <ItemMessage>{ticket.shortName}</ItemMessage>
                  </Link>
                  <ItemCompany>
                    {get(ticket, 'client.company.name', '-')}
                  </ItemCompany>
                </ItemMainInfo>
              </div>
            ))}
          </TodayTicketsSection>
        </Paper>
      )}
      {isAdmin && (
        <React.Fragment>
          <Paper>
            <h3>Tickets por estatus (últimos 30 días)</h3>
            <PieChart width={660} height={280}>
              <Pie
                dataKey="value"
                isAnimationActive={false}
                data={ticketStatusCount}
                outerRadius={80}
                cx={330}
                fill="#108043"
                label={payload => <PieChartItem {...payload} />}
              />
              <Tooltip />
            </PieChart>
          </Paper>
          <Paper>
            <h3>Tickets cerrados por técnico (últimos 30 días)</h3>
            <PieChart width={660} height={280}>
              <Pie
                dataKey="value"
                isAnimationActive={false}
                data={technicalsWork}
                outerRadius={80}
                cx={330}
                fill="#108043"
                label={payload => <PieChartItem {...payload} />}
              />
              <Tooltip />
            </PieChart>
          </Paper>
          <Paper>
            <h3>Tickets por empresa (últimos 30 días)</h3>
            <PieChart width={660} height={280}>
              <Pie
                dataKey="value"
                isAnimationActive={false}
                data={ticketsByCompany}
                outerRadius={80}
                cx={330}
                fill="#108043"
                label={payload => <PieChartItem {...payload} />}
              />
              <Tooltip />
            </PieChart>
          </Paper>
        </React.Fragment>
      )}
      <Popover
        id="tickets-popover"
        open={Boolean(ticketsPopoverAnchorEl)}
        anchorEl={ticketsPopoverAnchorEl}
        onClose={handleCloseTicketsPopover}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'center',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'center',
        }}
      >
        {Array.isArray(ticketsPopover) && (
          <PopoverContent>
            <h3>Tickets abiertos</h3>
            {ticketsPopover.map(ticket => (
              <div className="item" key={ticket.id}>
                <IconGreen
                  isRed={
                    (ticket.status === 'closed' && !ticket.paid) ||
                    ticket.status === 'cancelled'
                  }
                >
                  {getIcon(ticket)}
                </IconGreen>
                <ItemMainInfo>
                  <Link to={`/tickets/${ticket.id}`}>
                    <ItemMessage>{ticket.shortName}</ItemMessage>
                    <div className="formal-name">
                      Folio #{formatToFolio(get(ticket, 'number', ''))}
                    </div>
                  </Link>
                  <ItemCompany>
                    {get(ticket, 'client.company.name', '-')}
                  </ItemCompany>
                </ItemMainInfo>
              </div>
            ))}
          </PopoverContent>
        )}
      </Popover>
    </Content>
  );
}

DashboardBackoffice.propTypes = {
  dispatch: PropTypes.func.isRequired,
};

const mapStateToProps = createStructuredSelector({
  dashboardBackoffice: makeSelectDashboardBackoffice(),
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
)(DashboardBackoffice);
