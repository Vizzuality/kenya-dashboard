import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Modules
import {
  getTopicsOptions,
  getRegionsOptions,
  setSelectedFilters,
  setFiltersUrl,
  setDashboardLayout
} from 'modules/filters';

// Libraries
import isEmpty from 'lodash/isEmpty';

// Utils
import { decode } from 'utils/general';

// Components
import Filters from 'components/ui/filters';


class DashboardHeaderContent extends React.Component {
  componentWillMount() {
    if (isEmpty(this.props.filters.options.topics)) {
      this.props.getTopicsOptions();
    }

    if (isEmpty(this.props.filters.options.regions)) {
      this.props.getRegionsOptions();
    }
  }

  componentDidMount() {
    const { filters } = this.props.url.query;

    if (filters) {
      this.props.setSelectedFilters(decode(filters));
    }
  }

  render() {
    const { filters } = this.props;

    return (
      <Filters
        options={filters.options}
        selected={filters.selected}
        layout={filters.layout}
        onSetFilters={this.props.setSelectedFilters}
        onSetDashboardLayout={this.props.setDashboardLayout}
      />
    );
  }
}

DashboardHeaderContent.propTypes = {
  filters: PropTypes.object,
  url: PropTypes.object,
  // Actions
  getTopicsOptions: PropTypes.func,
  getRegionsOptions: PropTypes.func,
  setSelectedFilters: PropTypes.func,
  setDashboardLayout: PropTypes.func
};

export default connect(
  state => ({
    filters: state.filters
  }),
  dispatch => ({
    getTopicsOptions() { dispatch(getTopicsOptions()); },
    getRegionsOptions() { dispatch(getRegionsOptions()); },
    setSelectedFilters(filters) {
      dispatch(setSelectedFilters(filters));
      dispatch(setFiltersUrl());
    },
    setDashboardLayout(layout) { dispatch(setDashboardLayout(layout)); }
  })
)(DashboardHeaderContent);
