import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import Media from 'components/responsive/media';
import Icon from 'components/ui/icon';

// Constants
import { FILTERS_BAR_LABELS } from 'constants/filters';

const FILTER_TITLES = {
  regions: 'Location',
  topics: 'Topics',
  sort: 'Sort by'
};


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
          <span className="filter-label">{FILTERS_BAR_LABELS[key] || key}:</span>
          {selected[key].map((item, j) => (
            <div key={j} className="filter-value-container">
              <span className="filter-value">{item.name}</span>
              {this.props.removeFilter && item.name !== 'Kenya' &&
                <button className="btn-remove" onClick={() => this.onRemoveFilter(key, item.id)}>
                  <Icon name="icon-cross" className="-medium" />
                </button>
              }
            </div>
          ))}
        </div> : ''
    ));
  }

  getSelectedFilters() {
    const { selected } = this.props;

    return Object.keys(selected).filter(key => selected[key].length).map(key => (
      <div className="selected-filters">
        <h1 className="selected-title">{FILTER_TITLES[key]}</h1>
        <span className="c-badge">{selected[key].length}</span>
      </div>
    ));
  }

  render() {
    const { className, title } = this.props;
    const classNames = classnames(
      'c-filters-selected-bar',
      { [className]: !!className }
    );

    return (
      <nav className={classNames}>
        <Media device="device">
          <div className="selected-filters-container">
            <span className="label">Current viewing:</span>
            {this.getSelectedFilters()}
          </div>
        </Media>

        <Media device="desktop">
          <span className="bar-label">{title}</span>
          {this.getFilters()}
        </Media>
      </nav>
    );
  }
}

FiltersSelectedBar.propTypes = {
  className: PropTypes.string,
  selected: PropTypes.object,
  title: PropTypes.string,
  // Actions
  removeFilter: PropTypes.func
};

FiltersSelectedBar.defaultProps = {
  title: 'You are currently viewing: '
};
