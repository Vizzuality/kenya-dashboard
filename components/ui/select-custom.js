import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import TetherComponent from 'react-tether';


export default class SelectCustom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    // Bindiings
    this.onToggleTooltip = this.onToggleTooltip.bind(this);
  }

  onToggleTooltip() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { className, label, selectContent } = this.props;
    const classNames = classnames(
      'c-select-custom',
      {
        [className]: !!className
      }
    );

    return (
      <div className={classNames}>
        <TetherComponent
          attachment="top center"
          targetAttachment="bottom center"
          constraints={[{
            to: 'window',
            pin: true
          }]}
          offset="0 0"
        >
          <button className="btn-tooltip" onClick={this.onToggleTooltip}>
            <h1 className="label">{label}</h1>
          </button>
          {this.state.open &&
            <div ref={(node) => { this.el = node; }} className="c-tooltip -arrow-top">
              {selectContent}
            </div>
          }
        </TetherComponent>
      </div>
    );
  }
}

SelectCustom.propTypes = {
  className: PropTypes.string,
  label: PropTypes.string,
  selectContent: PropTypes.any
};
