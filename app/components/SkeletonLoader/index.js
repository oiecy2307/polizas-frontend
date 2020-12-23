/**
 *
 * SkeletonLoader
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';
import { times } from 'lodash';
import Skeleton from '@material-ui/lab/Skeleton';

function SkeletonLoader({ bars }) {
  return (
    <div>
      {times(bars, i => (
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

SkeletonLoader.propTypes = {
  bars: PropTypes.number,
};

SkeletonLoader.defaultProps = {
  bars: 10,
};

export default memo(SkeletonLoader);
