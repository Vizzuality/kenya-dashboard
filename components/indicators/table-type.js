import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';


export default class TableType extends React.Component {
  render() {
    const { threshold, className } = this.props;
    const classNames = classnames({
      'c-table-type': true,
      [className]: !!className,
      [`-${threshold}`]: !!threshold
    });

    return (
      <div className={classNames}>
        <p>Table type</p>
      </div>
    );
  }
}

TableType.propTypes = {
  data: PropTypes.object,
  threshold: PropTypes.string,
  className: PropTypes.string
};

TableType.defaultProps = {
  data: {}
};
