/**
 *
 * PieChartItem
 *
 */

import React, { memo } from 'react';
import PropTypes from 'prop-types';

const RADIAN = Math.PI / 180;

function PieChartItem({
  cx,
  cy,
  midAngle,
  innerRadius,
  outerRadius,
  fill,
  label,
}) {
  const radius = innerRadius + (outerRadius - innerRadius) * 1.4;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);
  return (
    <text
      x={x}
      y={y}
      fill="white"
      textAnchor={x > cx ? 'start' : 'end'}
      dominantBaseline="central"
      style={{ fill }}
    >
      {`${(label || '').substring(0, 8)}`}
    </text>
  );
}

PieChartItem.propTypes = {
  cx: PropTypes.any,
  cy: PropTypes.any,
  midAngle: PropTypes.any,
  innerRadius: PropTypes.any,
  outerRadius: PropTypes.any,
  fill: PropTypes.any,
  label: PropTypes.any,
};

export default memo(PieChartItem);
