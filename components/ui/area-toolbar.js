import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';
import flatten from 'lodash/flatten';

// Components
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
      selectedRegion
    } = this.props;

    const classNames = classnames(
      'c-area-toolbar area-indicators-header',
      { [className]: !!className }
    );

    return (
      <div className={classNames}>
        <div className="location-select-container">
          {/* Region select */}
          <SelectCustom
            label={this.getRegionName()}
            name="regions"
            type="slider"
            list={regions}
            setValue={this.onSetRegion}
            selected={[selectedRegion]}
          />
        </div>
        <div className="tools">
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
        </div>
      </div>
    );
  }
}

AreaToolbar.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  numOfAreas: PropTypes.number,
  regions: PropTypes.array,
  selectedRegion: PropTypes.any,
  // Actions
  onToggleAccordionItem: PropTypes.func,
  onSetRegion: PropTypes.func,
  onRemoveArea: PropTypes.func
};
