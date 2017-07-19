import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import { CSSTransitionGroup } from 'react-transition-group';


export default function Accordion(props) {
  const { className, sections } = props;

  const classNames = classnames({
    'c-accordion': true,
    [className]: !!className
  });

  return (
    <div className={classNames}>
      {sections.map((sec, i) => (
        sec.type === 'dynamic' ?
          <div className="accordion-section -dynamic" key={i}>
            <CSSTransitionGroup
              transitionName="item"
              transitionEnterTimeout={500}
              transitionLeaveTimeout={300}
            >
              {sec.items}
            </CSSTransitionGroup>
          </div> :
          <div className="accordion-section -static" key={i}>
            {sec.items}
          </div>
      ))}
    </div>
  );
}

Accordion.propTypes = {
  className: PropTypes.string,
  sections: PropTypes.array
};

Accordion.defaultProps = {
};
