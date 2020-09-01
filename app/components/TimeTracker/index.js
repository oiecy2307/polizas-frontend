/**
 *
 * TimeTracker
 *
 */

import React, { memo, useEffect, useState } from 'react';
import PropTypes from 'prop-types';
import { get } from 'lodash';
import moment from 'moment/min/moment-with-locales';

import { wsCreateTimeTracker, wsPauseTimeTracker } from 'services/tickets';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';

import PlayIcon from '@material-ui/icons/PlayCircleFilledOutlined';
import PauseIcon from '@material-ui/icons/PauseCircleFilledOutlined';

import { Container, Span } from './styledComponents';

const getTrackersSum = items => {
  if (!items.length) return 0;
  const timeInSeconds = items.reduce((total, item) => {
    const pauseTime = item.pauseTime || new Date();
    const diff = moment(pauseTime).diff(item.startTime, 'seconds');
    return total + diff;
  }, 0);
  return timeInSeconds;
};

function TimeTracker({ ticket, dispatch }) {
  const [time, setTime] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [lastTimeSaved, setLastTimeSaved] = useState(null);

  useEffect(() => {
    const times = get(ticket, 'ticketTimes', null) || [];
    const timeTracker = getTrackersSum(times);
    setTime(timeTracker);
    const isAnyRunning = times.some(tt => !tt.pauseTime);
    if (isAnyRunning) setIsRunning(true);
  }, [get(ticket, 'ticketTimes', null)]);

  useEffect(() => {
    const interval = setInterval(() => {
      setTime(_time => (isRunning ? _time + 1 : _time));
    }, 1000);
    return () => clearInterval(interval);
  }, [isRunning]);

  useEffect(() => {
    window.addEventListener('focus', onFocus);
    window.addEventListener('blur', onBlur);
    return () => {
      window.removeEventListener('focus', onFocus);
      window.removeEventListener('blur', onBlur);
    };
  }, []);

  const onFocus = () => {
    if (!isRunning) return;
    setTime(_time => {
      const diff = moment(new Date()).diff(lastTimeSaved, 'seconds');
      return _time + diff;
    });
  };

  const onBlur = () => {
    setLastTimeSaved(new Date());
  };

  const handleClickAction = async () => {
    try {
      dispatch(aSetLoadingState(true));

      if (isRunning) {
        await wsPauseTimeTracker({ pauseTime: new Date() }, ticket.id);
      } else {
        await wsCreateTimeTracker({ startTime: new Date() }, ticket.id);
      }
      setIsRunning(_isRunning => !_isRunning);
    } catch (e) {
      const errorMessage = get(
        e,
        'data.message',
        'No se pudo iniciar el cronómetro',
      );
      dispatch(aOpenSnackbar(errorMessage, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
    }
  };

  const formatedTime = new Date(time * 1000).toISOString().substr(11, 8);

  return (
    <Container>
      {formatedTime}
      <Span onClick={handleClickAction} className="action">
        {isRunning ? <PauseIcon /> : <PlayIcon />}
      </Span>
    </Container>
  );
}

TimeTracker.propTypes = {
  ticket: PropTypes.object,
  dispatch: PropTypes.func,
};

export default memo(TimeTracker);
