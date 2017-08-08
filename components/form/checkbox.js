import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import Icon from 'components/ui/icon';

export default class Checkbox extends React.Component {
  constructor(props) {
    super(props);

    // Bindings
    this.triggerChange = this.triggerChange.bind(this);
  }

  /**
  * UI EVENTS
  * - triggerChange
  */
  triggerChange(evt) {
    this.props.onChange && this.props.onChange({
      checked: evt.currentTarget.checked
    });
  }

  render() {
    const { className, checked, properties } = this.props;
    const classNames = classnames(
      'c-checkbox',
      {
        [className]: !!className,
        '-checked': checked
      }
    );

    return (
      <div className={classNames}>
        <input
          type="checkbox"
          checked={checked}
          onChange={this.triggerChange}
          {...properties}
        />
        <span className="fake-checkbox">
          {checked && <Icon name="icon-check" className="-smaller" />}
        </span>
      </div>
    );
  }
}

Checkbox.propTypes = {
  className: PropTypes.string,
  checked: PropTypes.bool,
  properties: PropTypes.object,
  // Actions
  onChange: PropTypes.func
};
