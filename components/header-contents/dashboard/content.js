import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { store } from 'store';

// Modules
import { getFiltersOptions, setSelectedFilters, setFiltersUrl } from 'modules/filters';

// Libraries
import isEmpty from 'lodash/isEmpty';

// Utils
import { decode } from 'utils/general';

// Components
import Filters from 'components/ui/filters';


class DashboardHeaderContent extends React.Component {
  componentWillMount() {
    if (isEmpty(this.props.filters.options)) {
      this.props.getFiltersOptions();
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
        onSetFilters={this.props.setSelectedFilters}
      />
    );
  }
}

DashboardHeaderContent.propTypes = {
  filters: PropTypes.object,
  url: PropTypes.object,
  // Actions
  getFiltersOptions: PropTypes.func,
  setSelectedFilters: PropTypes.func
};

export default withRedux(
  store,
  state => ({
    filters: state.filters
  }),
  dispatch => ({
    getFiltersOptions() { dispatch(getFiltersOptions()); },
    setSelectedFilters(filters) {
      dispatch(setSelectedFilters(filters));
      dispatch(setFiltersUrl());
    }
  })
)(DashboardHeaderContent);
