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
    this.onToggle = this.onToggle.bind(this);
  }

  onToggle(open) {
    this.setState({ open });
  }

  render() {
    const { className } = this.props;
    const classNames = classnames(
      'c-tooltip',
      { [className]: !!className }
    );

    return (
      <TetherComponent
        attachment="bottom left"
        targetAttachment="top left"
        offset="5px 0px"
        constraints={[{
          to: 'window',
          pin: true
        }]}
        classes={{
          element: classNames
        }}
      >
        <div
          className="target"
          onMouseEnter={() => this.onToggle(true)}
          onMouseLeave={() => this.onToggle(false)}
        >
          {this.props.children[0]}
        </div>

        {this.state.open &&
          <div className="tooltip">{
            this.props.children[1]
          }</div>
        }
      </TetherComponent>
    );
  }
}

Tooltip.propTypes = {
  className: PropTypes.string,
  children: PropTypes.array
};
