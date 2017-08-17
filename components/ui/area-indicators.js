import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Utils
import { setIndicatorsWidgetsList } from 'utils/indicators';

// Components
import Icon from 'components/ui/icon';
import DashboardList from 'components/ui/dashboard-list';


export default class AreaIndicators extends React.Component {
  constructor(props) {
    super(props);

    // Bindings
    this.onRemoveArea = this.onRemoveArea.bind(this);
  }

  onRemoveArea(id) {
    this.props.onRemoveArea(id);
  }

  render() {
    const { id, className, indicators, numOfAreas } = this.props;

    const classNames = classnames(
      'c-area-indicators',
      { [className]: !!className }
    );

    return (
      <article className={classNames}>
        <header className="area-indicators-header">
          <div className="location-seletct-container">
            {/* <Select /> */}
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
            list={setIndicatorsWidgetsList(indicators.list, false)}
            layout="grid"
            withGrid={numOfAreas === 1}
          />
        </section>
      </article>
    );
  }
}

AreaIndicators.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  indicators: PropTypes.object,
  numOfAreas: PropTypes.number,
  onRemoveArea: PropTypes.func,
  onToggleAccordionItem: PropTypes.func
};

AreaIndicators.defaultProps = {
};
