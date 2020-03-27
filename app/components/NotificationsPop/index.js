/**
 *
 * NotificationsPop
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import moment from 'moment/min/moment-with-locales';
import history from 'utils/history';

import {
  wsGetNotifications,
  wsMarkNotificationsAsSeen,
} from 'services/notifications';

import Popover from '@material-ui/core/Popover';
import Button from 'components/Button';
import LayersIcon from '@material-ui/icons/Layers';

// import messages from './messages';
import { Container, NotificationItem } from './styledComponents';

function NotificationsPop({ anchorEl, onClose, onRefreshCount }) {
  const [notifications, setNotifications] = useState([]);
  const [inited, setInited] = useState(false);

  useEffect(() => {
    if (anchorEl) {
      fetchNotifications();
    }
  }, [anchorEl]);

  const fetchNotifications = async () => {
    try {
      const response = await wsGetNotifications();
      if (!response.error) {
        const rNotifications = get(response, 'data', []) || [];
        setNotifications(rNotifications);
        const haveUnseen = rNotifications.some(n => !n.seen);
        if (haveUnseen) handleMarkNotificitaionsAsSeen();
      }
    } finally {
      setInited(true);
    }
  };

  const handleMarkNotificitaionsAsSeen = async () => {
    try {
      const response = await wsMarkNotificationsAsSeen();
      if (!response.error) onRefreshCount();
    } catch (e) {
      // TODO: IS NECESSARY TO DO SOMETHING?
    }
  };

  const handleGoToRoute = url => {
    history.push(url);
    onClose();
  };

  const open = Boolean(anchorEl);
  const id = 'notifications-pop';
  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'center',
      }}
      transformOrigin={{
        vertical: 'top',
        horizontal: 'center',
      }}
    >
      <Container>
        <div className="top">
          <span>Notificaciones</span>
          <Button variant="text">Ver todas</Button>
        </div>
        <div className="content">
          {inited ? (
            <React.Fragment>
              {notifications.map(notification => (
                <NotificationItem
                  key={notification.key}
                  onClick={() => handleGoToRoute(notification.urlRedirect)}
                >
                  <div className="icon-container">
                    <LayersIcon style={{ color: '#108043', fontSize: 24 }} />
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
            </React.Fragment>
          ) : (
            <div>Cargando</div>
          )}
        </div>
      </Container>
    </Popover>
  );
}

NotificationsPop.propTypes = {
  anchorEl: PropTypes.any,
  onClose: PropTypes.func,
  onRefreshCount: PropTypes.func,
};

export default memo(NotificationsPop);
