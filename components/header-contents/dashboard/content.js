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

// Services
import modal from 'services/modal';

// Libraries
import isEmpty from 'lodash/isEmpty';
import isEqual from 'lodash/isEqual';

// Utils
import { decode } from 'utils/general';

// Components
import Media from 'components/responsive/media';
import Filters from 'components/ui/filters';
import FiltersModal from 'components/modal-contents/filters-modal';
import Icon from 'components/ui/icon';


class DashboardHeaderContent extends React.Component {
  constructor(props) {
    super(props);

    // Bindings
    this.onOpenFiltersModal = this.onOpenFiltersModal.bind(this);
  }

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

  componentWillReceiveProps(nextProps) {
    const { modalOpened, url, filters } = this.props;

    // Update modal content props for Filters
    if (modalOpened && nextProps.modalOpened &&
      (!isEqual(url.query, nextProps.url.query) || filters.layout !== nextProps.filters.layout)) {
      const opts = {
        children: FiltersModal,
        childrenProps: {
          options: nextProps.filters.options,
          selected: nextProps.filters.selected,
          layout: nextProps.filters.layout,
          onSetFilters: this.props.setSelectedFilters,
          onSetDashboardLayout: this.props.setDashboardLayout,
          closeModal: modal.toggleModal
        }
      };

      modal.setModalOptions(opts);
    }
  }

  onOpenFiltersModal() {
    const { filters } = this.props;
    const opts = {
      children: FiltersModal,
      childrenProps: {
        options: filters.options,
        selected: filters.selected,
        layout: filters.layout,
        onSetFilters: this.props.setSelectedFilters,
        onSetDashboardLayout: this.props.setDashboardLayout,
        closeModal: modal.toggleModal
      }
    };

    modal.toggleModal(true, opts);
  }

  render() {
    const { filters } = this.props;

    return (
      <div>
        <Media device="device">
          <button className="" onClick={this.onOpenFiltersModal}>
            <Icon name="icon-plus" className="-medium" />
          </button>
        </Media>

        <Media device="desktop">
          <Filters
            options={filters.options}
            selected={filters.selected}
            layout={filters.layout}
            onSetFilters={this.props.setSelectedFilters}
            onSetDashboardLayout={this.props.setDashboardLayout}
          />
        </Media>
      </div>
    );
  }
}

DashboardHeaderContent.propTypes = {
  filters: PropTypes.object,
  url: PropTypes.object,
  modalOpened: PropTypes.bool,
  // Actions
  getTopicsOptions: PropTypes.func,
  getRegionsOptions: PropTypes.func,
  setSelectedFilters: PropTypes.func,
  setDashboardLayout: PropTypes.func
};

export default connect(
  state => ({
    filters: state.filters,
    modalOpened: state.modal.opened
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
