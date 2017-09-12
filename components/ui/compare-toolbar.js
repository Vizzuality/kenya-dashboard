import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Modules
import {
  addIndicator,
  removeIndicator,
  setIndicatorsParamsUrl
} from 'modules/indicators';

import {
  addArea,
  addAreaWithRegion,
  selectRegion,
  removeArea,
  setAreasParamsUrl
} from 'modules/maps';

// Selectors
import { getIndicatorsWithWidgets } from 'selectors/indicators';

// Libraries
import classnames from 'classnames';
import isEqual from 'lodash/isEqual';

// Services
import modal from 'services/modal';

// Components
import Media from 'components/responsive/media';
import IndicatorsList from 'components/modal-contents/indicators-list';
import AddArea from 'components/modal-contents/add-area';

class CompareToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      modalContent: null
    };

    this.url = props.url;

    // Bindings
    this.onAddArea = this.onAddArea.bind(this);
    this.onOpenAddAreaModal = this.onOpenAddAreaModal.bind(this);
    this.onOpenAddIndicatorModal = this.onOpenAddIndicatorModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { url, modalOpened, indicatorsFilterList } = this.props;

    if (!isEqual(url.query, nextProps.url.query)) {
      this.url = nextProps.url;
    }

    // Update modal content props for Add area
    if (modalOpened && nextProps.modalOpened && this.state.modalContent === 'AddArea' &&
      !isEqual(this.props.url.query, nextProps.url.query)) {
      const opts = {
        children: AddArea,
        childrenProps: {
          regions: nextProps.regions,
          areas: nextProps.areas,
          url: nextProps.url,
          addAreaWithRegion: nextProps.addAreaWithRegion,
          removeArea: nextProps.removeArea,
          selectRegion: nextProps.selectRegion,
          closeModal: modal.toggleModal
        }
      };
      modal.setModalOptions(opts);
    }

    // Update modal content props for Indicators list
    if (modalOpened && nextProps.modalOpened && this.state.modalContent === 'IndicatorsList' &&
      (!isEqual(this.props.url.query, nextProps.url.query) ||
      this.props.indicatorsList !== nextProps.indicatorsList.length)) {
      const opts = {
        children: IndicatorsList,
        childrenProps: {
          indicators: indicatorsFilterList,
          activeIndicators: nextProps.indicatorsList.map(ind => ind.id),
          url: nextProps.url,
          addIndicator: this.props.addIndicator,
          removeIndicator: this.props.removeIndicator,
          closeModal: modal.toggleModal
        }
      };
      modal.setModalOptions(opts);
    }
  }

  /* Add area */
  onAddArea() {
    Object.keys(this.props.areas).length < 3 &&
      this.props.addArea(this.props.url);
  }

  onOpenAddAreaModal() {
    const { regions, areas, url } = this.props;
    const opts = {
      children: AddArea,
      childrenProps: {
        regions,
        areas,
        url,
        addAreaWithRegion: this.props.addAreaWithRegion,
        removeArea: this.props.removeArea,
        selectRegion: this.props.selectRegion,
        closeModal: modal.toggleModal
      }
    };

    this.setState({ modalContent: 'AddArea' });
    modal.toggleModal(true, opts);
  }

  onOpenAddIndicatorModal() {
    const { indicatorsFilterList, indicatorsList, url } = this.props;
    const opts = {
      children: IndicatorsList,
      childrenProps: {
        indicators: indicatorsFilterList,
        activeIndicators: indicatorsList.map(ind => ind.id),
        url,
        addIndicator: this.props.addIndicator,
        removeIndicator: this.props.removeIndicator,
        closeModal: modal.toggleModal
      }
    };

    this.setState({ modalContent: 'IndicatorsList' });
    modal.toggleModal(true, opts);
  }

  render() {
    const { className, areas } = this.props;

    const classNames = classnames(
      'c-compare-toolbar',
      { [className]: !!className }
    );

    const addAreaClass = classnames(
      'c-button btn-add-area',
      { '-disabled': Object.keys(areas).length === 3 }
    );

    return (
      <div className={classNames}>
        <div className="actions-container">
          <button className="c-button btn-add-indicator" onClick={this.onOpenAddIndicatorModal}>Add Indicator</button>
          <Media device="device">
            <button className="c-button btn-add-area" onClick={this.onOpenAddAreaModal}>Add Location</button>
          </Media>
          <Media device="desktop">
            <button className={addAreaClass} onClick={this.onAddArea}>Add Location</button>
          </Media>
        </div>
      </div>
    );
  }
}

CompareToolbar.propTypes = {
  className: PropTypes.string,
  indicatorsFilterList: PropTypes.object,
  indicatorsList: PropTypes.array,
  areas: PropTypes.object,
  regions: PropTypes.array,
  url: PropTypes.object,
  modalOpened: PropTypes.bool,
  // Actions
  addIndicator: PropTypes.func,
  removeIndicator: PropTypes.func,
  addArea: PropTypes.func,
  addAreaWithRegion: PropTypes.func,
  removeArea: PropTypes.func,
  selectRegion: PropTypes.func
};

export default connect(
  state => ({
    allIndicators: state.indicators.list,
    indicatorsFilterList: getIndicatorsWithWidgets(state),
    indicatorsList: state.indicators.specific.list,
    areas: state.maps.areas,
    modalOpened: state.modal.opened,
    regions: state.filters.options.regions
  }),
  dispatch => ({
    // Area
    addArea(url) {
      dispatch(addArea());
      dispatch(setAreasParamsUrl(url));
    },
    addAreaWithRegion(region, area, url) {
      dispatch(addAreaWithRegion(region, area));
      dispatch(setAreasParamsUrl(url));
    },
    selectRegion(region, area, url) {
      dispatch(selectRegion(region, area));
      dispatch(setAreasParamsUrl(url));
    },
    removeArea(id, url) {
      dispatch(removeArea(id));
      dispatch(setAreasParamsUrl(url));
    },
    // Indicators
    addIndicator(id, url) {
      dispatch(addIndicator(id));
      dispatch(setIndicatorsParamsUrl(id, url));
    },
    removeIndicator(id, url) {
      dispatch(removeIndicator(id));
      dispatch(setIndicatorsParamsUrl(id, url));
    }
  })
)(CompareToolbar);
