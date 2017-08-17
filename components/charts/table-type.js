import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Utils
import { getThreshold } from 'utils/general';

// Components
import Icon from 'components/ui/icon';


export default function TableType(props) {
  const { threshold, className, axis, data } = props;
  const classNames = classnames(
    'c-table-type',
    { [className]: !!className }
  );
  const titlesValues = Object.values(axis);

  return (
    <div className={classNames}>
      <table>
        <thead>
          <tr>
            {titlesValues.map((spec, i) => <th key={i}>{spec.title}</th>)}
          </tr>
        </thead>
        <tbody>
          {data.map((row, i) => (
            <tr key={i}>
              {Object.values(row).map((value, j) => {
                const thresholdValue = getThreshold(value, threshold.y['break-points']);
                return (
                  <td key={j} className={j !== 0 ? `-${thresholdValue}` : ''}>
                    {value}
                    {j !== 0 && <Icon name="icon-arrow-down" />}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

TableType.propTypes = {
  className: PropTypes.string,
  data: PropTypes.array,
  threshold: PropTypes.object,
  axis: PropTypes.object
};
