import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import { CSSTransitionGroup } from 'react-transition-group';
import Sticky from 'react-stickynode';


export default class Accordion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      status: 0,
      headerHeight: 0
    };
  }

  componentDidMount() {
    const header = document !== undefined && document.getElementsByClassName('c-header');
    const headerHeight = header && header.length ? header[0].offsetHeight - 18 : 0;
    this.setState({ headerHeight });
  }

  getSections(section) {
    if (section.type === 'dynamic') {
      const { status, headerHeight } = this.state;

      return section.sticky ?
        <div className="accordion-section -dynamic" key={section.key}>
          <CSSTransitionGroup
            transitionName="item"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
          >
            <Sticky
              enabled
              innerZ={section.zIndex || 600}
              top={headerHeight}
              onStateChange={(pr) => { this.setState({ status: pr.status }); }}
            >
              <nav className={status === 2 ? 'bar -fixed' : 'bar'}>
                {section.items}
              </nav>
            </Sticky>
          </CSSTransitionGroup>
        </div> :
        <div className="accordion-section -dynamic" key={section.key}>
          <CSSTransitionGroup
            transitionName="item"
            transitionEnterTimeout={500}
            transitionLeaveTimeout={300}
          >
            {section.items}
          </CSSTransitionGroup>
        </div>;
    }
    return (
      <div className="accordion-section -static" key={section.key}>
        {section.items}
      </div>
    );
  }

  render() {
    const { className, sections } = this.props;

    const classNames = classnames({
      'c-accordion': true,
      [className]: !!className
    });

    return (
      <div className={classNames}>
        {sections.map(sec => this.getSections(sec)
          // sec.type === 'dynamic' ?
          //   <div className="accordion-section -dynamic" key={i}>
          //     <CSSTransitionGroup
          //       transitionName="item"
          //       transitionEnterTimeout={500}
          //       transitionLeaveTimeout={300}
          //     >
          //       {sec.items}
          //     </CSSTransitionGroup>
          //   </div> :
          //   <div className="accordion-section -static" key={i}>
          //     {sec.items}
          //   </div>
        )}
      </div>
    );
  }
}

Accordion.propTypes = {
  className: PropTypes.string,
  numOfDivisions: PropTypes.number,
  sections: PropTypes.array
};

Accordion.defaultProps = {
};
