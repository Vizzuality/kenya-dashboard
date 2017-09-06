import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Services
import modal from 'services/modal';

// Modules
import {
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

// Utils
import { getRegionName } from 'utils/areas';

// Components
import Media from 'components/responsive/media';
import AddArea from 'components/modal-contents/add-area';
import Icon from 'components/ui/icon';
import SelectCustom from 'components/ui/select-custom';


class AreaToolbar extends React.Component {
  constructor(props) {
    super(props);

    // Bindings
    this.onRemoveArea = this.onRemoveArea.bind(this);
    this.onSetRegion = this.onSetRegion.bind(this);
    this.onToggleAccordionItem = this.onToggleAccordionItem.bind(this);
    this.onOpenAddAreaModal = this.onOpenAddAreaModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { modalOpened } = this.props;

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
  }

  onRemoveArea() {
    this.props.onRemoveArea(this.props.id);
  }

  onSetRegion(region) {
    // this.props.onSetRegion(region, this.props.id, this.props.url);
    this.props.onSetRegion(region);
  }

  onToggleAccordionItem(e) {
    this.props.onToggleAccordionItem(e, this.props.id);
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

  render() {
    const {
      className,
      numOfAreas,
      regions,
      selectedRegion,
      sliderArrowsControl
    } = this.props;

    const classNames = classnames(
      'c-area-toolbar area-indicators-header',
      { [className]: !!className }
    );

    const btnPreviousClasses = classnames(
      'btn btn-prev',
      { '-no-more': sliderArrowsControl === 'noPrevious' }
    );

    const btnNextClasses = classnames(
      'btn btn-next',
      { '-no-more': sliderArrowsControl === 'noNext' }
    );

    const regionName = getRegionName(regions, selectedRegion);

    return (
      <div className={classNames}>
        <div className="location-select-container">
          <Media device="device">
            <button className="btn-area" onClick={this.onOpenAddAreaModal}>
              <h1>{regionName}</h1>
              <Icon name="icon-arrow-down" className="-smaller" />
            </button>
          </Media>

          <Media device="desktop">
            {/* Region select */}
            <SelectCustom
              label={regionName}
              name="regions"
              type="slider"
              list={regions}
              setValue={this.onSetRegion}
              selected={[selectedRegion]}
            />
          </Media>
        </div>
        <div className="tools">
          {numOfAreas > 1 &&
            <Media device="device">
              <button className={btnPreviousClasses} onClick={this.props.onPreviousSlider}>
                <Icon name="icon-arrow-left2" className="" />
              </button>
              <button className={btnNextClasses} onClick={this.props.onNextSlider}>
                <Icon name="icon-arrow-right2" className="" />
              </button>
            </Media>
          }

          <Media device="desktop">
            {numOfAreas > 1 &&
              <button className="btn btn-toggle" onClick={this.onToggleAccordionItem}>
                <Icon name="icon-expand" className="" />
              </button>
            }
            {numOfAreas > 1 &&
              <button className="btn btn-remove" onClick={this.onRemoveArea}>
                <Icon name="icon-cross" className="" />
              </button>
            }
          </Media>
        </div>
      </div>
    );
  }
}

AreaToolbar.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  url: PropTypes.object,
  areas: PropTypes.object,
  numOfAreas: PropTypes.number,
  sliderArrowsControl: PropTypes.string,
  regions: PropTypes.array,
  selectedRegion: PropTypes.any,
  modalOpened: PropTypes.bool,
  // Actions
  onToggleAccordionItem: PropTypes.func,
  onSetRegion: PropTypes.func,
  onPreviousSlider: PropTypes.func,
  onNextSlider: PropTypes.func,
  onRemoveArea: PropTypes.func,

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
    }
  })
)(AreaToolbar);
