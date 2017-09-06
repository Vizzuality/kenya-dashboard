import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';
import isEqual from 'lodash/isEqual';
import isArray from 'lodash/isArray';

// Utils
// import { getRegionName } from 'utils/areas';
import { getValueMatchFromCascadeList } from 'utils/general';

// Components
import SelectAccordion from 'components/ui/select-accordion';
import Icon from 'components/ui/icon';

export default class FiltersModal extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      activeList: null
    };


    // Bindings
    // this.onSetAreaValue = this.onSetAreaValue.bind(this);
    // this.onSetNewAreaValue = this.onSetNewAreaValue.bind(this);
    // this.onRemoveArea = this.onRemoveArea.bind(this);
    // this.onToggleArea = this.onToggleArea.bind(this);
    this.onToggleItem = this.onToggleItem.bind(this);
    this.onSetFilter = this.onSetFilter.bind(this);
    this.onSetDashboardLayout = this.onSetDashboardLayout.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    // if (!isEqual(Object.keys(nextProps.areas), Object.keys(nextProps.areas))) {
    // }
  }
  //
  // onSetAreaValue(value, id) {
  //   this.props.selectRegion(value, id, this.props.url);
  // }
  //
  // onSetNewAreaValue(value, id) {
  //   this.setState({ active: null });
  //   this.props.addAreaWithRegion(value, id, this.props.url);
  // }
  //
  // onRemoveArea(id) {
  //   Object.keys(this.props.areas).length > 1 && this.props.removeArea(id, this.props.url);
  // }
  //
  // onToggleArea(id) {
  //   const { active } = this.state;
  //   this.setState({ active: active === id ? null : id });
  // }
  onToggleItem(id) {
    this.setState({ activeList: this.state.activeList === id ? null : id });
  }

  onSetFilter(opts, key) {
    let newOpts = isArray(opts) ? opts.slice() : [opts];

    if (key === 'topics' && opts.includes('all')) {
      newOpts = this.props.options.topics.map(t => t.id);
    } else if (key === 'topics' && !opts.includes('all') && this.props.selected.topics.includes('all')) {
      newOpts = [];
    }
    const newFilters = {
      ...this.props.selected,
      [key]: newOpts
    };
    this.props.onSetFilters(newFilters);
  }

  onSetDashboardLayout(e) {
    const layout = e.currentTarget.getAttribute('data-layout');
    this.props.onSetDashboardLayout(layout);
  }

  render() {
    const { activeList } = this.state;
    const { className, selected, options, layout } = this.props;
    const classNames = classnames('c-filters-modal', { [className]: !!className });
    const btnGridClasses = classnames('btn btn-grid', { '-active': layout === 'grid' });
    const btnListClasses = classnames('btn btn-list', { '-active': layout === 'list' });
    const region = selected.regions.length ?
      getValueMatchFromCascadeList(options.regions, selected.regions[0]) : null;
    const topics = [];
    options.topics.forEach((t) => {
      if (selected.topics.includes(t.id)) topics.push(t);
    });
    const sort = selected.sort.length ? options.sort.find(s => s.id === selected.sort[0]) : null;

    return (
      <div className={classNames}>
        <header className="list-header">
          <h1 className="title">
            Filter by
            {/* <span className="c-badge">{Object.keys(areas).length}</span> */}
          </h1>
        </header>

        <section className="list-content">
          <div className="layout-type">
            <span className="layout-label">View type</span>
            {/* Set layout buttons */}
            <button className={btnGridClasses} data-layout="grid" onClick={this.onSetDashboardLayout}>
              <Icon name="icon-grid" className="-big" />
            </button>

            <button className={btnListClasses} data-layout="list" onClick={this.onSetDashboardLayout}>
              <Icon name="icon-list" className="-big" />
            </button>
          </div>

          {/* Region select */}
          <SelectAccordion
            active={activeList === 'regions'}
            id="regions"
            label={region ? `Location: ${region.name}` : 'Location'}
            name="regions"
            type="accordion"
            list={options.regions}
            remove={false}
            selected={selected.regions || ['779']}
            setValue={this.onSetFilter}
            toggleItem={this.onToggleItem}
          />
          <SelectAccordion
            active={activeList === 'topics'}
            id="topics"
            multi
            cascade={false}
            listType="checkbox"
            label={topics.length ? `Topics: ${topics[0].name}${topics.length > 1 ? '...' : ''}` : 'Topics'}
            name="topics"
            type="accordion"
            list={options.topics}
            remove={false}
            selected={selected.topics}
            setValue={this.onSetFilter}
            toggleItem={this.onToggleItem}
          />
          <SelectAccordion
            active={activeList === 'sort'}
            id="sort"
            label={sort ? `Sort by: ${sort.name}` : 'Sort by'}
            name="sort"
            cascade={false}
            type="accordion"
            list={options.sort}
            remove={false}
            selected={selected.sort}
            setValue={this.onSetFilter}
            toggleItem={this.onToggleItem}
          />
          <footer className="actions-container">
            <button className="c-button btn-add-indicator" onClick={() => this.props.closeModal(false)}>
              Apply filters
            </button>
          </footer>
        </section>
      </div>
    );
  }
}

FiltersModal.propTypes = {
  // regions: PropTypes.array,
  // areas: PropTypes.object,
  className: PropTypes.string,
  // url: PropTypes.object,
  options: PropTypes.object,
  selected: PropTypes.object,
  layout: PropTypes.string,
  // Actions
  onSetFilters: PropTypes.func,
  onSetDashboardLayout: PropTypes.func,
  closeModal: PropTypes.func
};
