import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Utils
// import { getThreshold } from 'utils/general';

// Components
import { Link } from 'routes';
import ItemTools from 'components/ui/item-tools';
import Icon from 'components/ui/icon';
import TopicIcon from 'components/ui/topic-icon';
import Chart from 'components/ui/chart';


export default class DashboardItem extends React.Component {
  constructor(props) {
    super(props);

    // Bindings
    this.onSetDate = this.onSetDate.bind(this);
  }


  onSetDate(start, end) {
    const dates = start && end ? { start, end } : null;
    this.props.onSetDate(this.props.info['indicator-id'], dates);
  }

  // getThresholdQualification() {
  //   const { info } = this.props;
  //   const { data } = this.state;
  //
  //   if (data && data.data && info['json-config'] &&
  //     info['json-config'].type && info['json-config'].threshold) {
  //     const threshold = info['json-config'].threshold.y;
  //
  //     switch (info['json-config'].type.visual) {
  //       case 'table': case 'pie': case 'bars': case 'barsLine': {
  //         const values = data.data.map(v => v.y);
  //         const value = threshold.direction === 'asc' ? Math.min(...values) : Math.max(...values);
  //         return getThreshold(value, threshold['break-points']);
  //       }
  //       case 'line': {
  //         const value = data.data[data.data.length - 1].y;
  //         return getThreshold(value, threshold['break-points']);
  //       }
  //       default: return 'default';
  //     }
  //   }
  //   return null;
  // }

  render() {
    const { info, className, dates, region, remove, groupId } = this.props;
    // const threshold = this.getThresholdQualification();

    const classNames = classnames({
      'c-dashboard-item': true,
      [className]: !!className
      // [threshold]: threshold
    });

    return (
      <article className={classNames}>
        {/* Header */}
        <header className="item-header">
          <h1 className="item-title">{info && info.title}</h1>
          <div className="item-tools">
            <ItemTools
              groupId={groupId}
              info={info}
              dates={dates}
              remove={remove}
              options={{ dates, region, indicator: info['indicator-id'] }}
              onSetDate={this.onSetDate}
              onRemoveItem={this.props.onRemoveItem}
            />
          </div>
        </header>

        {/* Indicator type detail - Content */}
        <section className="type-detail">
          <Chart
            info={this.props.info}
            dates={dates}
            region={region}
          />
        </section>

        {/* Footer */}
        <footer className="item-footer">
          <div className="info">
            <TopicIcon topic={info.topic ? info.topic.name : ''} tooltip={info.topic && !!info.topic.name} />
            <span className="update">Last update: {info.updatedAt}</span>
          </div>
          <div className="">
            <Link route="compare" params={{ indicators: info.indicator_id }}>
              <a className="item-link">
                <Icon name="icon-arrow_next2" className="-smaller" />
              </a>
            </Link>
          </div>
        </footer>
      </article>
    );
  }
}

DashboardItem.propTypes = {
  className: PropTypes.string,
  info: PropTypes.object,
  region: PropTypes.string,
  dates: PropTypes.object,
  remove: PropTypes.bool,
  // Actions
  onSetDate: PropTypes.func
};

DashboardItem.defaultProps = {
  info: {}
};
