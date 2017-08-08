import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import Icon from 'components/ui/icon';

export default function Checkbox({ className, checked }) {
  const classNames = classnames(
    'c-checkbox',
    {
      [className]: !!className,
      '-checked': checked
    }
  );

  return (
    <div className={classNames}>
      <input type="checkbox" checked={checked} />
      <span className="fake-checkbox">
        {checked && <Icon name="icon-check" className="-smaller" />}
      </span>
    </div>
  );
}

Checkbox.propTypes = {
  className: PropTypes.string,
  checked: PropTypes.bool
};
