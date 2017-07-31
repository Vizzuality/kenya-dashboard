import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';
import isArray from 'lodash/isArray';

// Components
import Select from 'react-select';
import Icon from 'components/ui/icon';
import SelectCustom from 'components/ui/select-custom';
import SelectSlider from 'components/ui/select-slider';


export default class Filters extends React.Component {
  constructor(props) {
    super(props);

    // Bindings
    this.onSetDashboardLayout = this.onSetDashboardLayout.bind(this);
    this.setFilters = this.setFilters.bind(this);
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
    newFilter[key] = isArray(opts) ? opts.map(o => o) : [opts];
    const newFilters = Object.assign({}, this.props.selected, newFilter);
    this.props.onSetFilters(newFilters);
  }

  render() {
    const { className, options, selected, layout } = this.props;
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
        {/* Areas */}
        <SelectCustom
          label="Areas"
          selectContent={
            <SelectSlider list={options.areas} setValue={this.setFilters} />
          }
        />

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
