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
import { makeStyles } from '@material-ui/core/styles';

import {
  wsGetNotifications,
  wsMarkNotificationsAsSeen,
} from 'services/notifications';

import Popover from '@material-ui/core/Popover';
import Button from 'components/Button';
import LayersIcon from '@material-ui/icons/Layers';
import DoneIcon from '@material-ui/icons/Done';
import ContactIcon from '@material-ui/icons/ContactMail';
import { Divider } from 'utils/globalStyledComponents';
import Skeleton from '@material-ui/lab/Skeleton';

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

const useStyles = makeStyles(() => ({
  root: {
    maxHeight: '80vh',
  },
}));

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
  const classes = useStyles();

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
      className={classes.root}
    >
      <Container>
        <div className="top">
          <span>Notificaciones</span>
          {false && <Button variant="text">Ver todas</Button>}
        </div>
        <div className="content">
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
