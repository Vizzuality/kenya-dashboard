import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';


export default class SwitchLabels extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      left: props.defaultPos
    };

    // Bindings
    this.onToggle = this.onToggle.bind(this);
  }

  onToggle() {
    this.setState({ left: !this.state.left });
    this.props.onChange();
  }

  render() {
    const { left } = this.state;
    const { className, leftLabel, rightLabel } = this.props;
    const classNames = classnames(
      `c-switch-labels ${left ? '-left' : '-right'}`,
      { [className]: !!className }
    );

    return (
      <div className={classNames}>
        <div className="labels-container">
          <button className="label -left" onClick={this.onToggle}>{leftLabel}</button>
          <button className="label -right" onClick={this.onToggle}>{rightLabel}</button>
        </div>
        <div className="dot">
          <span className="dot-label">{left ? leftLabel : rightLabel }</span>
        </div>
      </div>
    );
  }
}

SwitchLabels.propTypes = {
  className: PropTypes.string,
  defaultPos: PropTypes.bool,
  leftLabel: PropTypes.string,
  rightLabel: PropTypes.string,
  // Actions
  onChange: PropTypes.func
};

SwitchLabels.defaultProps = {
  defaultPos: true
};
