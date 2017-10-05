import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';
import flatten from 'lodash/flatten';

// Utils
import { setIndicatorsWidgetsList } from 'utils/indicators';

// Components
import Media from 'components/responsive/media';
import DashboardList from 'components/ui/dashboard-list';
import AreaToolbar from 'components/ui/area-toolbar';


export default class AreaIndicators extends React.Component {
  constructor(props) {
    super(props);

    // Bindings
    this.onRemoveArea = this.onRemoveArea.bind(this);
    this.onSetRegion = this.onSetRegion.bind(this);
    this.onRemoveIndicator = this.onRemoveIndicator.bind(this);
    this.onSetIndicatorDate = this.onSetIndicatorDate.bind(this);
  }

  onRemoveArea(id) {
    this.props.onRemoveArea(id);
  }

  onSetRegion(region) {
    this.props.onSelectRegion(region, this.props.id, this.props.url);
  }

  onRemoveIndicator(indicatorId) {
    this.props.onRemoveIndicator(indicatorId, this.props.url);
  }

  onSetIndicatorDate(indicator, dates) {
    this.props.onSetDate(indicator, dates, this.props.id, this.props.url);
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
      id,
      className,
      indicators,
      numOfAreas,
      regions,
      selectedRegion,
      dates,
      removedWidgets
    } = this.props;
    const classNames = classnames(
      'c-area-indicators',
      { [className]: !!className }
    );

    return (
      <article className={classNames}>
        <section>
          <DashboardList
            groupId={id}
            layout="grid"
            withGrid={numOfAreas === 1}
            list={setIndicatorsWidgetsList(indicators.list, false, removedWidgets)}
            region={selectedRegion}
            dates={dates}
            remove
            onSetDate={this.onSetIndicatorDate}
            onRemoveItem={this.onRemoveIndicator}
          />
        </section>
      </article>
    );
  }
}

AreaIndicators.propTypes = {
  className: PropTypes.string,
  url: PropTypes.object,
  id: PropTypes.string,
  indicators: PropTypes.object,
  regions: PropTypes.array,
  dates: PropTypes.object,
  selectedRegion: PropTypes.any,
  numOfAreas: PropTypes.number,
  removedWidgets: PropTypes.array,
  // Actions
  onRemoveArea: PropTypes.func,
  onSelectRegion: PropTypes.func,
  onSetDate: PropTypes.func,
  onRemoveIndicator: PropTypes.func
};

AreaIndicators.defaultProps = {
};
