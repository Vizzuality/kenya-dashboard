import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import { CSSTransitionGroup } from 'react-transition-group';


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
          <CSSTransitionGroup
            transitionName="item"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
          >
            {top}
          </CSSTransitionGroup>
        </div>
      }
      {middle &&
        <div className="accordion-section -middle">
          {middle}
        </div>
      }
      {bottom &&
        <div className="accordion-section -bottom">
          <CSSTransitionGroup
            transitionName="item"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
          >
            {bottom}
          </CSSTransitionGroup>
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
