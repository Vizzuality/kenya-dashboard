import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isArray from 'lodash/isArray';

// Components
import Select from 'react-select';
import Icon from 'components/ui/icon';


export default class Filters extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      showBy: 'county'
    };

    // Bindings
    this.onSetDashboardLayout = this.onSetDashboardLayout.bind(this);
  }

  /**
    UI events
  */
  onSetDashboardLayout(e) {
    const layout = e.currentTarget.getAttribute('data-layout');
    this.props.onSetDashboardLayout(layout);
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
    const { className, options, selected, layout } = this.props;
    const { showBy } = this.state;
    const classNames = classnames(
      'c-filters',
      { [className]: !!className }
    );

    const btnGridClasses = classnames(
      'btn-grid',
      { '-active': layout === 'grid' }
    );

    const btnListClasses = classnames(
      'btn-list',
      { '-active': layout === 'list' }
    );

    return (
      <div className={classNames}>
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
          placeholder="Sort"
          options={options.sort || []}
          value={options.sort ?
            options.sort.find(opt => selected.sort === opt.value) : {}}
          onChange={opts => this.setFilters(opts, 'sort')}
        />

        {/* Set layout buttons */}
        <button className={btnGridClasses} data-layout="grid" onClick={this.onSetDashboardLayout}>
          <Icon name="icon-grid" className="-small" />
        </button>

        <button className={btnListClasses} data-layout="list" onClick={this.onSetDashboardLayout}>
          <Icon name="icon-list" className="-small" />
        </button>

      </div>
    );
  }
}

Filters.propTypes = {
  className: PropTypes.string,
  options: PropTypes.object,
  selected: PropTypes.object,
  layout: PropTypes.string,
  // Actions
  onSetFilters: PropTypes.func,
  onSetDashboardLayout: PropTypes.func
};

Filters.defaultProps = {
};
