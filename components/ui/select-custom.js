import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import TetherComponent from 'react-tether';
import Icon from 'components/ui/icon';
import SelectSlider from 'components/ui/select-slider';
import SelectList from 'components/ui/select-list';


export default class SelectCustom extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    // Bindiings
    this.onToggleDropdown = this.onToggleDropdown.bind(this);
  }

  /**
    Lifecycle
  */
  componentDidMount() {
    this.handleDropdownOpening();
  }

  /**
   UI events
  */
  onToggleDropdown() {
    this.setState({ open: !this.state.open });
  }

  getContent() {
    switch (this.props.type) {
      case 'slider': return (
        <SelectSlider
          name={this.props.name}
          list={this.props.list}
          selected={this.props.selected}
          setValue={this.props.setValue}
          onToggleDropdown={this.onToggleDropdown}
        />
      );
      case 'checkbox': return (
        <SelectList
          type="checkbox"
          className="-checkbox"
          name={this.props.name}
          list={this.props.list}
          selected={this.props.selected}
          setValue={this.props.setValue}
          multi={this.props.multi}
        />
      );
      default: return (
        <SelectList
          name={this.props.name}
          list={this.props.list}
          selected={this.props.selected}
          setValue={this.props.setValue}
          onToggleDropdown={this.onToggleDropdown}
        />
      );
    }
  }

  // Close dropdown when clicking outside
  handleDropdownOpening() {
    window.addEventListener('click', (e) => {
      const el = e.target;
      const isNotDropdownOrChild = this.el && el !== this.el && !this.el.contains(el);
      const isNotDropdownBtn = el !== this.btn && !this.btn.contains(el);

      if (isNotDropdownOrChild && isNotDropdownBtn && this.state.open) {
        this.setState({ open: false });
      }
    }, false);
  }

  render() {
    const { className, label } = this.props;
    const classNames = classnames(
      'c-select-custom',
      { [className]: !!className }
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
            element: 'c-dropdown -arrow-top'
          }}
          offset="-14px 0"
        >
          <button className="btn-dropdown" onClick={this.onToggleDropdown} ref={(node) => { this.btn = node; }}>
            <h1 className="label">{label}</h1>
            <Icon name="icon-arrow-down" className="-smaller" />
          </button>
          {this.state.open &&
            <div ref={(node) => { this.el = node; }} className="dropdown-container">
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
  name: PropTypes.string,
  type: PropTypes.any,
  list: PropTypes.array,
  selected: PropTypes.array,
  multi: PropTypes.bool,
  // Actions
  setValue: PropTypes.func
};
