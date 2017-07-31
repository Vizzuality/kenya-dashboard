import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import TetherComponent from 'react-tether';


export default class Tooltip extends React.Component {
  render() {
    const { className, children } = this.props;
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
      >
        <div ref={(node) => { this.el = node; }} className={classNames}>
          {children}
        </div>
      </TetherComponent>
    );
  }
}

Tooltip.propTypes = {
  className: PropTypes.string,
  children: PropTypes.any,
  open: PropTypes.bool
};
