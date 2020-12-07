import React, { useState, useEffect } from 'react';
import PropTypes from 'prop-types';
import { get, cloneDeep } from 'lodash';

import { wsUpdateInstanceSettings } from 'services/instances';
import { aSetLoadingState, aOpenSnackbar } from 'containers/App/actions';

import Select from '@material-ui/core/Select';
import FormControl from '@material-ui/core/FormControl';
import InputLabel from '@material-ui/core/InputLabel';
import MenuItem from '@material-ui/core/MenuItem';
import Checkbox from '@material-ui/core/Checkbox';

import { Paper, Divider } from 'utils/globalStyledComponents';
import Button from 'components/Button';

import { ConfigSection, DayItem, SaveSection } from '../styledComponents';

const hourItems = [
  {
    value: '00:00 AM',
  },
  {
    value: '00:30 AM',
  },
  {
    value: '01:00 AM',
  },
  {
    value: '01:30 AM',
  },
  {
    value: '02:00 AM',
  },
  {
    value: '02:30 AM',
  },
  {
    value: '03:00 AM',
  },
  {
    value: '03:30 AM',
  },
  {
    value: '04:00 AM',
  },
  {
    value: '04:30 AM',
  },
  {
    value: '05:00 AM',
  },
  {
    value: '05:30 AM',
  },
  {
    value: '06:00 AM',
  },
  {
    value: '06:30 AM',
  },
  {
    value: '07:00 AM',
  },
  {
    value: '07:30 AM',
  },
  {
    value: '08:00 AM',
  },
  {
    value: '08:30 AM',
  },
  {
    value: '09:00 AM',
  },
  {
    value: '09:30 AM',
  },
  {
    value: '10:00 AM',
  },
  {
    value: '10:30 AM',
  },
  {
    value: '11:00 AM',
  },
  {
    value: '11:30 AM',
  },
  {
    value: '12:00 PM',
  },
  {
    value: '12:30 PM',
  },
  {
    value: '01:00 PM',
  },
  {
    value: '01:30 PM',
  },
  {
    value: '02:00 PM',
  },
  {
    value: '02:30 PM',
  },
  {
    value: '03:00 PM',
  },
  {
    value: '03:30 PM',
  },
  {
    value: '04:00 PM',
  },
  {
    value: '04:30 PM',
  },
  {
    value: '05:00 PM',
  },
  {
    value: '05:30 PM',
  },
  {
    value: '06:00 PM',
  },
  {
    value: '06:30 PM',
  },
  {
    value: '07:00 PM',
  },
  {
    value: '07:30 PM',
  },
  {
    value: '08:00 PM',
  },
  {
    value: '08:30 PM',
  },
  {
    value: '09:00 PM',
  },
  {
    value: '09:30 PM',
  },
  {
    value: '10:00 PM',
  },
  {
    value: '10:30 PM',
  },
  {
    value: '11:00 PM',
  },
  {
    value: '11:30 PM',
  },
];

const ButtonRight = ({ disabled, onClick }) => (
  <SaveSection>
    <Button disabled={disabled} onClick={onClick}>
      Guardar
    </Button>
  </SaveSection>
);

ButtonRight.propTypes = {
  disabled: PropTypes.bool,
  onClick: PropTypes.func,
};

function ValidOrigins({ dispatch, instance }) {
  const [initialDays, setInitialDays] = useState([]);
  const [days, setDays] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    setDays(cloneDeep(get(instance, 'schedule', false) || []));
    setInitialDays(cloneDeep(get(instance, 'schedule', false) || []));
  }, [get(instance, 'schedule', false) || []]);

  const handleUpdateDays = async () => {
    try {
      setIsSubmitting(true);
      dispatch(aSetLoadingState(true));
      await wsUpdateInstanceSettings({
        type: 'schedule',
        data: days,
      });
      dispatch(aOpenSnackbar('Cambios guardados', 'success'));
      setInitialDays(cloneDeep(days));
    } catch (e) {
      const errorMessage =
        get(e, 'data.message', '') || 'Ocurrió un error, intente de nuevo';
      dispatch(aOpenSnackbar(errorMessage, 'error'));
    } finally {
      dispatch(aSetLoadingState(false));
      setIsSubmitting(false);
    }
  };

  const handleUpdateDaysObj = (index, field, value) => {
    setDays(_days => {
      const sDays = [..._days];
      sDays[index][field] = value;
      return sDays;
    });
  };

  const disabled = (() => {
    try {
      return JSON.stringify(initialDays) === JSON.stringify(days);
    } catch (e) {
      return true;
    }
  })();

  return (
    <Paper>
      <ConfigSection>
        <h3>Horario</h3>
        <div className="description">
          Esta información se mostrará en tu perfil en Suppdesk
        </div>
        {days.map((day, index) => (
          <DayItem key={get(day, 'day', '')}>
            <h4>
              {get(day, 'day', '')}
              <Checkbox
                name={`${get(day, 'day', '')}-active`}
                checked={get(day, 'active', false)}
                color="primary"
                className="checkbox-day"
                onChange={e =>
                  handleUpdateDaysObj(index, 'active', e.target.checked)
                }
              />
            </h4>
            <div className="schedule-item">
              <div className="selects-section">
                <FormControl variant="filled" className="select-schedule">
                  <InputLabel id={`${get(day, 'day', '')}-label-open`}>
                    Abre
                  </InputLabel>
                  <Select
                    labelId={`${get(day, 'day', '')}-label-open`}
                    id={`${get(day, 'day', '')}-select-open`}
                    value={get(day, 'open', false) || '00:00 AM'}
                    onChange={e =>
                      handleUpdateDaysObj(index, 'open', e.target.value)
                    }
                    disabled={!get(day, 'active', false)}
                  >
                    {hourItems.map(hour => (
                      <MenuItem value={hour.value}>{hour.value}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
                <span className="separator">-</span>
                <FormControl variant="filled" className="select-schedule">
                  <InputLabel id={`${get(day, 'day', '')}-label-close`}>
                    Cierra
                  </InputLabel>
                  <Select
                    labelId={`${get(day, 'day', '')}-label-close`}
                    id={`${get(day, 'day', '')}-select-close`}
                    value={get(day, 'close', false) || '00:00 AM'}
                    onChange={e =>
                      handleUpdateDaysObj(index, 'close', e.target.value)
                    }
                    disabled={!get(day, 'active', false)}
                  >
                    {hourItems.map(hour => (
                      <MenuItem value={hour.value}>{hour.value}</MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </div>
            </div>
          </DayItem>
        ))}
        <Divider size="32" />
        <ButtonRight
          disabled={disabled || isSubmitting}
          onClick={handleUpdateDays}
        />
      </ConfigSection>
    </Paper>
  );
}

ValidOrigins.propTypes = {
  dispatch: PropTypes.func,
  instance: PropTypes.object,
};

export default ValidOrigins;
