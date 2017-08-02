import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';
import isArray from 'lodash/isArray';

// Components
import Icon from 'components/ui/icon';
import SelectCustom from 'components/ui/select-custom';


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
    const newFilters = {
      ...this.props.selected,
      [key]: isArray(opts) ? opts.map(o => o) : [opts]
    };
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
        {/* Areas select */}
        <SelectCustom
          label="Areas"
          name="areas"
          type="slider"
          list={options.areas}
          setValue={this.setFilters}
          selected={selected.areas}
        />

        {/* Categories select */}
        <SelectCustom
          label="Topics"
          name="categories"
          type="checkbox"
          list={options.categories}
          setValue={this.setFilters}
          selected={selected.categories}
          multi
        />

        {/* Sort by select */}
        <SelectCustom
          label="Sort"
          name="sort"
          list={options.sort}
          setValue={this.setFilters}
          selected={selected.sort}
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
