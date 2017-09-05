import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';
import flatten from 'lodash/flatten';

// Components
import Media from 'components/responsive/media';
import Icon from 'components/ui/icon';
import SelectCustom from 'components/ui/select-custom';


export default class AreaToolbar extends React.Component {
  constructor(props) {
    super(props);

    // Bindings
    this.onRemoveArea = this.onRemoveArea.bind(this);
    this.onSetRegion = this.onSetRegion.bind(this);
    this.onToggleAccordionItem = this.onToggleAccordionItem.bind(this);
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

  /**
   * HELPERS
   * - getRegionName
  */
  getRegionName() {
    const { regions, selectedRegion } = this.props;

    if (regions && regions.length) {
      // TODO: don't loop through all the entities, it would be better to do an API call
      const region = flatten(regions.map(r => r.list)).find(r => +r.id === +selectedRegion);
      return (region && region.name) || 'Location';
    }

    return 'Location';
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

    const regionName = this.getRegionName();

    return (
      <div className={classNames}>
        <div className="location-select-container">
          {/* TODO: Open add location modal */}
          <Media device="device">
            <h1>{regionName}</h1>
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
  numOfAreas: PropTypes.number,
  sliderArrowsControl: PropTypes.string,
  regions: PropTypes.array,
  selectedRegion: PropTypes.any,
  // Actions
  onToggleAccordionItem: PropTypes.func,
  onSetRegion: PropTypes.func,
  onPreviousSlider: PropTypes.func,
  onNextSlider: PropTypes.func,
  onRemoveArea: PropTypes.func
};
