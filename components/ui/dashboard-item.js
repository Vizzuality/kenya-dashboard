import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Utils
// import { getThreshold } from 'utils/general';

// Components
import { Link } from 'routes';
import Media from 'components/responsive/media';
import ItemTools from 'components/ui/item-tools';
import Icon from 'components/ui/icon';
import TopicIcon from 'components/ui/topic-icon';
import Chart from 'components/ui/chart';

const fakeDescription = 'Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat.';
const globalValue = '';

export default class DashboardItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lastDate: ''
    };

    // Bindings
    this.onSetDate = this.onSetDate.bind(this);
    this.setLastDate = this.setLastDate.bind(this);
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

  setLastDate(date) {
    const index = date.indexOf('T');
    const parsedDate = new Date(date.slice(0, index));
    const lastDate = `${parsedDate.getFullYear()}/${parsedDate.getMonth() + 1}/${parsedDate.getDate()}`;
    this.setState({ lastDate });
  }

  render() {
    const { info, className, dates, region, remove, groupId, layout } = this.props;
    // const threshold = this.getThresholdQualification();

    const classNames = classnames(
      `c-dashboard-item -${layout}`,
      {
        [className]: !!className
      // [threshold]: threshold
      }
    );
    const parsedInfo = { ...info, ...{ lastDate: this.state.lastDate } };

    return (
      layout === 'grid' ?
        <article className={classNames}>
          {/* Header */}
          <header className="item-header">
            <h1 className="item-title">{info && info.title}</h1>
            <div className="item-tools">
              <ItemTools
                groupId={groupId}
                info={parsedInfo}
                dates={dates}
                remove={remove}
                options={{ dates, region, indicator: info['indicator-id'] }}
                onSetDate={this.onSetDate}
                onRemoveItem={this.props.onRemoveItem}
              />
            </div>
            {/* Global value */}
            <div className="general-value">
              <p></p>
            </div>
          </header>

          {/* Indicator type detail - Content */}
          <section className="type-detail">
            <Chart
              info={this.props.info}
              dates={dates}
              region={region}
              setLastDate={this.setLastDate}
            />
          </section>

          {/* Footer */}
          <footer className="item-footer">
            <div className="info">
              <TopicIcon topic={info.topic ? info.topic.name : ''} />
              <span className="update">Last update: {this.state.lastDate}</span>
            </div>
            {!remove &&
              <div className="">
                <Link route="compare" params={{ indicators: info.indicator_id }}>
                  <a className="item-link">
                    <Icon name="icon-arrow_next2" className="-smaller" />
                  </a>
                </Link>
              </div>
            }
          </footer>
        </article> :
        <article className={classNames}>
          <Media device="mobile">
            <Link route="compare" params={{ indicators: info.indicator_id }}>
              <a className="">
                <div className="row collapse">
                  <div className="column small-12">
                    <div className="item-metadata content-container">
                      {/* Header */}
                      <header className="item-header">
                        <h1 className="item-title">{info && info.title}</h1>
                      </header>
                    </div>
                  </div>

                  {/* Global value */}
                  {/* <div className="column small-6">
                    <div className="content-container">
                      <p>{info.globalValue || globalValue}</p>
                    </div>
                  </div> */}
                </div>
              </a>
            </Link>
          </Media>
          <Media device="desktop+">
            <div className="row collapse">
              <div className="column small-12 medium-6">
                <div className="item-metadata content-container">
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
                    <div className="description">
                      <p>{info.description && info.description !== '' ? info.description : fakeDescription}</p>
                    </div>
                  </header>

                  {/* Footer */}
                  <footer className="item-footer">
                    <div className="info">
                      <TopicIcon topic={info.topic ? info.topic.name : ''} tooltip={info.topic && !!info.topic.name} />
                      <span className="update">Last update: {this.state.lastDate}</span>
                    </div>
                  </footer>
                </div>
              </div>

              {/* Indicator type detail - Content */}
              <div className="column small-12 medium-5">
                <section className="type-detail content-container">
                  <div className="content-container">
                    <Chart
                      info={this.props.info}
                      dates={dates}
                      region={region}
                    />
                  </div>
                </section>
              </div>

              {/* <div className="column small-12 medium-3">
                <div className="content-container">
                  <p>{info.globalValue || globalValue}</p>
                </div>
              </div> */}

              <div className="column small-12 medium-1">
                <div className="content-container">
                  <Link route="compare" params={{ indicators: info.indicator_id }}>
                    <a className="item-link">
                      <Icon name="icon-arrow_next2" className="-smaller" />
                    </a>
                  </Link>
                </div>
              </div>
            </div>
          </Media>
        </article>
    );
  }
}

DashboardItem.propTypes = {
  className: PropTypes.string,
  layout: PropTypes.string,
  info: PropTypes.object,
  region: PropTypes.string,
  dates: PropTypes.object,
  groupId: PropTypes.string,
  remove: PropTypes.bool,
  // Actions
  onSetDate: PropTypes.func,
  onRemoveItem: PropTypes.func
};

DashboardItem.defaultProps = {
  info: {}
};
