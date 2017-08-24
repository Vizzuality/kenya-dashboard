import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Utils
import { setIndicatorsWidgetsList } from 'utils/indicators';

// Components
import Icon from 'components/ui/icon';
import DashboardList from 'components/ui/dashboard-list';
import SelectCustom from 'components/ui/select-custom';


export default class AreaIndicators extends React.Component {
  constructor(props) {
    super(props);

    // Bindings
    this.onRemoveArea = this.onRemoveArea.bind(this);
    this.onSetRegion = this.onSetRegion.bind(this);
    this.onRemoveWidget = this.onRemoveWidget.bind(this);
  }

  onRemoveArea(id) {
    this.props.onRemoveArea(id);
  }

  onSetRegion(region) {
    this.props.onSelectRegion(region, this.props.id, this.props.url);
  }

  onRemoveWidget(widgetId, areaId) {
    this.props.onRemoveWidget(widgetId, areaId, this.props.url);
  }

  render() {
    const { id, className, indicators, numOfAreas, regions, selectedRegion, dates, removedWidgets } = this.props;
    const classNames = classnames(
      'c-area-indicators',
      { [className]: !!className }
    );

    return (
      <article className={classNames}>
        <header className="area-indicators-header">
          <div className="location-select-container">
            {/* Region select */}
            <SelectCustom
              label="Location"
              name="regions"
              type="slider"
              list={regions}
              setValue={this.onSetRegion}
              selected={[selectedRegion]}
            />
          </div>
          <div className="tools">
            {numOfAreas > 1 &&
              <button className="btn btn-toggle" onClick={e => this.props.onToggleAccordionItem(e, id)}>
                <Icon name="icon-expand" className="" />
              </button>
            }
            {numOfAreas > 1 &&
              <button className="btn btn-remove" onClick={() => this.onRemoveArea(id)}>
                <Icon name="icon-cross" className="" />
              </button>
            }
          </div>
        </header>
        <section>
          <DashboardList
            groupId={id}
            layout="grid"
            withGrid={numOfAreas === 1}
            list={setIndicatorsWidgetsList(indicators.list, false, removedWidgets)}
            region={selectedRegion}
            dates={dates}
            remove
            onSetDate={this.props.onSetDate}
            onRemoveItem={this.onRemoveWidget}
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
  // Actions
  onRemoveArea: PropTypes.func,
  onToggleAccordionItem: PropTypes.func,
  onSelectRegion: PropTypes.func,
  onSetDate: PropTypes.func
};

AreaIndicators.defaultProps = {
};
