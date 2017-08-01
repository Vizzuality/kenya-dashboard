import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import TetherComponent from 'react-tether';
import Icon from 'components/ui/icon';
import SelectSlider from 'components/ui/select-slider';


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

  getContent() {
    switch (this.props.type) {
      case 'slider': return (
        <SelectSlider
          list={this.props.list}
          selected={this.props.selected}
          setValue={this.props.setValue}
          onToggleTooltip={this.onToggleTooltip}
        />
      );
      default: return null;
    }
  }

  render() {
    const { className, label } = this.props;
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
          classes={{
            element: 'c-tooltip -arrow-top'
          }}
          offset="-8px 0"
        >
          <button className="btn-tooltip" onClick={this.onToggleTooltip}>
            <h1 className="label">{label}</h1>
            <Icon name="icon-arrow-down" className="-smaller" />
          </button>
          {this.state.open &&
            <div ref={(node) => { this.el = node; }} className="tooltip-container">
              {this.getContent()}
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
  type: PropTypes.any,
  list: PropTypes.array,
  selected: PropTypes.array,
  // Actions
  setValue: PropTypes.func
};
