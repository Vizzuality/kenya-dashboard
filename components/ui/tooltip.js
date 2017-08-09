import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import TetherComponent from 'react-tether';


export default class Tooltip extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    // Bindings
    this.onMouse = this.onMouse.bind(this);
  }

  onMouse(open) {
    this.setState({ open });
  }

  render() {
    const { className, target, content } = this.props;
    const classNames = classnames(
      'c-tooltip',
      { [className]: !!className }
    );

    return (
      <TetherComponent
        attachment="bottom center"
        targetAttachment="bottom center"
        constraints={[{
          to: 'window',
          pin: true
        }]}
        offset="10px 0"
        classes={{
          element: classNames
        }}
      >
        <div
          className="target"
          onMouseEnter={() => this.onMouse(true)}
          onMouseLeave={() => this.onMouse(false)}
        >
          {target}
        </div>
        {this.state.open && <div className="tooltip">{content}</div>}
      </TetherComponent>
    );
  }
}

Tooltip.propTypes = {
  className: PropTypes.string,
  target: PropTypes.element,
  content: PropTypes.element
};
