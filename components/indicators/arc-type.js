import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';


export default class ArcType extends React.Component {
  render() {
    const { threshold, className } = this.props;
    const classNames = classnames({
      'c-table-type': true,
      [className]: !!className,
      [`-${threshold}`]: !!threshold
    });

    return (
      <div className={classNames}>
        <p>Arc type</p>
      </div>
    );
  }
}

ArcType.propTypes = {
  data: PropTypes.object,
  threshold: PropTypes.string,
  className: PropTypes.string
};

ArcType.defaultProps = {
  data: {}
};
