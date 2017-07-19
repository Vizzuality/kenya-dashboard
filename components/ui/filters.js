import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isArray from 'lodash/isArray';

// Components
import Select from 'react-select';

// Constants
import { SHOW_BY_OPTION } from 'constants/filters';


export default class Filters extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showBy: 'country'
    };
  }

  setFilters(opts, key) {
    const newFilter = {};
    newFilter[key] = isArray(opts) ? opts.map(o => o.value) : opts.value;
    const newFilters = Object.assign({}, this.props.selected, newFilter);
    this.props.onSetFilters(newFilters);
  }

  setShowBy(option) {
    this.setState({ showBy: option.value }, () => {
      // Reset unselected type filter
      if (option.value === 'countries') {
        this.setFilters([], 'counties');
      } else {
        this.setFilters([], 'countries');
      }
    });
  }

  render() {
    const { options, selected } = this.props;
    const { showBy } = this.state;
    const className = classnames({
      'c-filters': true,
      [this.props.className]: !!this.props.className
    });

    return (
      <div className={className}>
        <Select
          instanceId="showByOptions"
          className="c-select"
          name="showBy"
          placeholder="Show by..."
          options={SHOW_BY_OPTION || []}
          value={showBy}
          onChange={opts => this.setShowBy(opts)}
        />
        {/* country select */}
        {showBy === 'country' &&
          <Select
            instanceId="countriesOptions"
            className="c-select"
            name="countries"
            placeholder="Countries"
            multi
            options={options.countries || []}
            value={options.countries ?
              options.countries.filter(opt => selected.countries.includes(opt.value)) : []}
            onChange={opts => this.setFilters(opts, 'countries')}
          />
        }

        {/* County select */}
        {showBy === 'county' &&
          <Select
            instanceId="countiesOptions"
            className="c-select"
            name="counties"
            placeholder="Counties"
            multi
            options={options.counties || []}
            value={options.counties ?
              options.counties.filter(opt => selected.counties.includes(opt.value)) : []}
            onChange={opts => this.setFilters(opts, 'counties')}
          />
        }

        {/* Categories select */}
        <Select
          instanceId="categoriesOptions"
          className="c-select"
          name="categories"
          placeholder="Categories"
          multi
          options={options.categories || []}
          value={options.categories ?
            options.categories.filter(opt => selected.categories.includes(opt.value)) : []}
          onChange={opts => this.setFilters(opts, 'categories')}
        />

        {/* Sort by select */}
        <Select
          instanceId="sortbyOptions"
          className="c-select"
          name="sort"
          placeholder="Sort By"
          options={options.sort || []}
          value={options.sort ?
            options.sort.find(opt => selected.sort === opt.value) : {}}
          onChange={opts => this.setFilters(opts, 'sort')}
        />

        {/* Dates select */}
        {/* <Select
          instanceId="datesOptions"
          className="c-select"
          name="dates"
          placeholder="Dates"
          multi
          options={options.dates || []}
          value={options.dates ?
            options.dates.filter(opt => selected.dates.includes(opt.value)) : []}
          onChange={opts => this.setFilters(opts, 'dates')}
        /> */}
      </div>
    );
  }
}

Filters.propTypes = {
  className: PropTypes.string,
  options: PropTypes.object,
  selected: PropTypes.object,
  // Actions
  onSetFilters: PropTypes.func
};

Filters.defaultProps = {
};
