import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import Icon from 'components/ui/icon';

export default class FitBoundsControl extends React.Component {
  constructor(props) {
    super(props);

    // Bindings
    this.onFitBounds = this.onFitBounds.bind(this);
  }

  onFitBounds() {
    this.props.fitAreaBounds();
  }

  render() {
    const { className } = this.props;
    const classNames = classnames({
      [className]: !!className
    });

    return (
      <button className={classNames} onClick={this.onFitBounds}>
        <Icon name="icon-location" className="" />
      </button>
    );
  }
}

FitBoundsControl.propTypes = {
  className: PropTypes.string,
  // Actions
  fitAreaBounds: PropTypes.func
};
