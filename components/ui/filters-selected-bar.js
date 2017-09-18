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

    this.state = {
      open: false
    };

    // Bindings
    this.onRemoveFilter = this.onRemoveFilter.bind(this);
    this.onToggleFilters = this.onToggleFilters.bind(this);
  }

  onRemoveFilter(type, value) {
    this.props.removeFilter(type, value);
  }

  onToggleFilters() {
    this.setState({ open: !this.state.open });
  }

  getSelectedFilters(labels) {
    const { selected } = this.props;

    return Object.keys(selected).map(key => (
      selected[key] && selected[key].length ?
        <div className="filters-type-container" key={key}>
          {labels && <span className="filter-label">{FILTERS_BAR_LABELS[key] || key}:</span>}
          {selected[key].map(item => (
            <div key={`${item.name}_${item.id}`} className="filter-value-container">
              <span className="filter-value">{item.name}</span>
              {this.props.removeFilter && item.name !== 'Kenya' &&
                <button className="btn-remove" onClick={() => this.onRemoveFilter(key, item.id)}>
                  <Icon name="icon-cross" className={labels ? '-medium' : '-small'} />
                </button>
              }
            </div>
          ))}
        </div> : ''
    ));
  }

  /* Device selected filters bar */
  getSelectedFiltersDevice() {
    const { selected } = this.props;

    return Object.keys(selected).filter(key => selected[key].length).map(key => (
      <div key={key} className="selected-filters">
        <h1 className="selected-title">{FILTER_TITLES[key]}</h1>
        <span className="c-badge">{selected[key].length}</span>
      </div>
    ));
  }

  render() {
    const { className, title, print } = this.props;
    const classNames = classnames(
      'c-filters-selected-bar',
      { [className]: !!className }
    );

    return (
      <nav className={classNames}>
        {!print &&
          <Media device="device">
            <div className="selected-filters-container">
              <span className="label">Current viewing:</span>
              {this.getSelectedFiltersDevice()}
              <button className="btn btn-toggle" onClick={this.onToggleFilters}>
                <Icon name={`icon-arrow-${this.state.open ? 'up' : 'down'}`} className="-smaller" />
              </button>
            </div>
          </Media>
        }
        {!print &&
          <Media device="device">
            <div className="full-selected-list">
              {this.state.open && this.getSelectedFilters()}
            </div>
          </Media>
        }
        {!print &&
          <Media device="desktop">
            <span className="bar-label">{title}</span>
            {this.getSelectedFilters(true)}
          </Media>
        }

        {/* Print */}
        {print &&
          <div>
            <span className="bar-label">{title}</span>
            {this.getSelectedFilters(true)}
          </div>
        }
      </nav>
    );
  }
}

FiltersSelectedBar.propTypes = {
  className: PropTypes.string,
  selected: PropTypes.object,
  print: PropTypes.bool,
  title: PropTypes.string,
  // Actions
  removeFilter: PropTypes.func
};

FiltersSelectedBar.defaultProps = {
  title: 'You are currently viewing: ',
  print: false
};
