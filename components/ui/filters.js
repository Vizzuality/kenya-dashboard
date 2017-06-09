import React from 'react';
import PropTypes from 'prop-types';
import Select from 'react-select';
import 'react-select/dist/react-select.css';


// Provisional
// const options = {
//   type: [{ label: 'type1', value: 'type1' }, { label: 'type2', value: 'type2' }],
//   country: [{ label: 'country1', value: 'country1' }, { label: 'country2', value: 'country2' }]
// };


export default class Filters extends React.Component {
  setFilter(opts, key) {
    const filter = {};
    filter[key] = opts.map(opt => opt.value || opt);
    this.props.setFilters(filter);
  }

  renderFiltersSelects() {
    const { options, filters } = this.props;

    return this.props.filtersRefs.map((f, i) => {
      const value = options[f.key] ?
        options[f.key].filter(opt => filters[f.key] ?
          filters[f.key].includes(opt.value) :
          false) :
        [];

      return (
        <div key={i} className="field">
          <h3 className="title">{f.name}</h3>
          <Select
            instanceId={f.key}
            name={f.key}
            options={options[f.key]}
            multi
            className={value.length ? '-filled' : ''}
            value={value}
            placeholder={`All ${f.plural}`}
            onChange={opts => this.setFilter(opts, f.key)}
          />
        </div>
      );
    });
  }

  render() {
    return (
      <aside className="c-filters">
        <div className="filters-content">
          <h2 className="c-title -light">Filter by</h2>
          {this.renderFiltersSelects()}
        </div>
      </aside>
    );
  }
}

Filters.propTypes = {
  filters: PropTypes.object,
  filtersRefs: PropTypes.array,
  options: PropTypes.object,
  // Actions
  onChange: PropTypes.any,
  setFilters: PropTypes.func
};

Filters.defaultProps = {
  options: {}
};
