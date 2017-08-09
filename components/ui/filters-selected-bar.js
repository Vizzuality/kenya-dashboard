import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import Icon from 'components/ui/icon';

// Constants
import { FILTERS_BAR_LABELS } from 'constants/filters';


export default class FiltersSelectedBar extends React.Component {
  constructor(props) {
    super(props);

    // Bindings
    this.onRemoveFilter = this.onRemoveFilter.bind(this);
  }

  onRemoveFilter(type, value) {
    this.props.removeFilter(type, value);
  }

  getFilters() {
    const { selected } = this.props;

    return Object.keys(selected).map((key, i) => (
      selected[key] && selected[key].length ?
        <div className="filters-type-container" key={i}>
          <span className="filter-label">{FILTERS_BAR_LABELS[key]}:</span>
          {selected[key].map((item, j) => (
            <div key={j} className="filter-value-container">
              <span className="filter-value">{item.name}</span>
              <button className="btn-remove" onClick={() => this.onRemoveFilter(key, item.id)}>
                <Icon name="icon-cross" className="-medium" />
              </button>
            </div>
          ))}
        </div> : ''
    ));
  }

  render() {
    const { className } = this.props;
    const classNames = classnames(
      'c-filters-selected-bar',
      { [className]: !!className }
    );

    return (
      <nav className={classNames}>
        <span className="bar-label">You are currently viewing: </span>
        {/* <div className="bar-filters"> */}
          {this.getFilters()}
        {/* </div> */}
      </nav>
    );
  }
}

FiltersSelectedBar.propTypes = {
  className: PropTypes.string,
  selected: PropTypes.object,
  // Actions
  removeFilter: PropTypes.func
};
