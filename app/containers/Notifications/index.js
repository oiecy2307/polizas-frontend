/**
 *
 * Notifications
 *
 */

import React, { memo, useState } from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import { Helmet } from 'react-helmet';
import { compose } from 'redux';
import { get } from 'lodash';
import moment from 'moment/min/moment-with-locales';

import InfiniteScroll from 'react-infinite-scroller';
import { Divider } from 'utils/globalStyledComponents';
import Skeleton from '@material-ui/lab/Skeleton';
import LayersIcon from '@material-ui/icons/Layers';
import DoneIcon from '@material-ui/icons/Done';
import ContactIcon from '@material-ui/icons/ContactMail';

import {
  wsGetNotifications,
  wsMarkNotificationsAsSeen,
} from 'services/notifications';
import { aSetLoadingState } from 'containers/App/actions';

import { Container, NotificationItem } from './styledComponents';

const getIcon = key => {
  switch (key) {
    case 'assigned':
      return <ContactIcon />;
    case 'finished':
      return <DoneIcon />;
    default:
      return <LayersIcon />;
  }
};

export function Notifications({ history, dispatch }) {
  const [notifications, setNotifications] = useState([]);
  const [inited, setInited] = useState(false);
  const [hasMore, setHasMore] = useState(true);

  const fetchNotifications = async offset => {
    try {
      dispatch(aSetLoadingState(true));
      setHasMore(false);
      const response = await wsGetNotifications(offset);
      if (!response.error) {
        const rNotifications = get(response, 'data', []) || [];
        setNotifications(notis => [...notis, ...rNotifications]);
        setHasMore(rNotifications.length === 10);
        const haveUnseen = rNotifications.some(n => !n.seen);
        if (haveUnseen) handleMarkNotificitaionsAsSeen();
      }
    } finally {
      dispatch(aSetLoadingState(false));
      setInited(true);
    }
  };

  const handleLoadMore = page => {
    const offset = (page - 1) * 10;
    fetchNotifications(offset);
  };

  const handleMarkNotificitaionsAsSeen = async () => {
    try {
      await wsMarkNotificationsAsSeen();
    } catch (e) {
      // TODO: IS NECESSARY TO DO SOMETHING?
    }
  };

  const handleGoToRoute = url => {
    history.push(url);
  };

  return (
    <Container>
      <Helmet>
        <title>Notificaciones</title>
      </Helmet>
      <InfiniteScroll
        pageStart={0}
        loadMore={handleLoadMore}
        hasMore={hasMore}
        loader={
          <div className="loading-text" key={0}>
            Cargando más...
          </div>
        }
      >
        {inited ? (
          <React.Fragment>
            {notifications.map(notification => (
              <NotificationItem
                key={notification.id}
                onClick={() => handleGoToRoute(notification.urlRedirect)}
                isNew={!notification.seen}
              >
                <div className="icon-container">
                  {getIcon(notification.icon)}
                </div>
                <div className="content">
                  <div className="title">{notification.title}</div>
                  <div className="body">{notification.body}</div>
                  <div className="date">
                    {moment(notification.createdAt).fromNow()}
                  </div>
                </div>
              </NotificationItem>
            ))}
            {notifications.length === 0 && (
              <div style={{ padding: 16 }}>Sin notificaciones</div>
            )}
          </React.Fragment>
        ) : (
          <div style={{ padding: 16 }}>
            <Skeleton variant="rect" width="100%" height={86} />
            <Divider size={8} />
            <Skeleton variant="rect" width="100%" height={86} />
            <Divider size={8} />
            <Skeleton variant="rect" width="100%" height={86} />
          </div>
        )}
      </InfiniteScroll>
    </Container>
  );
}

Notifications.propTypes = {
  dispatch: PropTypes.func.isRequired,
  history: PropTypes.object,
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
)(Notifications);
