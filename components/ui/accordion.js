import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default function Accordion(props) {
  const { className, top, middle, bottom } = props;

  const classNames = classnames({
    'c-accordion': true,
    [className]: !!className
  });

  return (
    <div className={classNames}>
      {top &&
        <div className="accordion-section -top">
          {top}
        </div>
      }
      {middle &&
        <div className="accordion-section -middle">
          {middle}
        </div>
      }
      {bottom &&
        <div className="accordion-section -bottom">
          {bottom}
        </div>
      }
    </div>
  );
}

Accordion.propTypes = {
  className: PropTypes.string,
  top: PropTypes.any,
  middle: PropTypes.any,
  bottom: PropTypes.any
};

Accordion.defaultProps = {
};
