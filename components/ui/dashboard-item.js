import React from 'react';
import PropTypes from 'prop-types';

// Services
import modal from 'services/modal';

// Libraries
import classnames from 'classnames';
import truncate from 'lodash/truncate';

// Components
import { Router } from 'routes';
import Media from 'components/responsive/media';
import ItemTools from 'components/ui/item-tools';
import Icon from 'components/ui/icon';
import TopicIcon from 'components/ui/topic-icon';
import Chart from 'components/ui/chart';
import IndicatorInfo from 'components/modal-contents/indicator-info';

// constants
import { FAKE_DESCRIPTION } from 'constants/general';

let GA;
if (typeof window !== 'undefined') {
  /* eslint-disable global-require */
  GA = require('react-ga');
  /* eslint-enable global-require */
}


export default class DashboardItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      lastDate: '',
      minMaxDates: null
    };

    // Bindings
    this.onSetDate = this.onSetDate.bind(this);
    this.setLastDate = this.setLastDate.bind(this);
    this.setMinMaxDates = this.setMinMaxDates.bind(this);
    this.onToggleModal = this.onToggleModal.bind(this);
    this.onLink = this.onLink.bind(this);
  }


  onSetDate(start, end) {
    const dates = start && end ? { start, end } : null;
    this.props.onSetDate(this.props.info['indicator-id'], dates);
  }

  onToggleModal() {
    const parsedInfo = { ...this.props.info, ...{ lastDate: this.state.lastDate } };

    const opts = {
      children: IndicatorInfo,
      childrenProps: {
        info: parsedInfo
      }
    };
    modal.toggleModal(true, opts);

    GA.event({
      category: window.location.pathname,
      action: 'Open infowindow',
      label: this.props.info.title
    });
  }

  onLink(id) {
    GA.event({
      category: 'Dashboard',
      action: 'Click to view Indicator detail',
      label: this.props.info.title
    });

    Router.pushRoute(`compare?indicators=${id}`);
  }

  setLastDate(date) {
    const index = date.indexOf('T');
    const parsedDate = new Date(date.slice(0, index));
    const lastDate = `${parsedDate.getFullYear()}/${parsedDate.getMonth() + 1}/${parsedDate.getDate()}`;
    this.setState({ lastDate });
  }

  setMinMaxDates(dates) {
    this.setState({ minMaxDates: { min: dates.min, max: dates.max } });
  }

  getDescription() {
    const { info } = this.props;
    const description = truncate(info.description || FAKE_DESCRIPTION, {
      length: 250,
      separator: ' '
    });
    return description;
  }

  getDatesLabel() {
    const { minMaxDates } = this.state;

    const rawMinDate = minMaxDates && minMaxDates.min ? new Date(minMaxDates.min) : null;
    const rawMaxDate = minMaxDates && minMaxDates.max ? new Date(minMaxDates.max) : null;

    if (!rawMinDate || !rawMaxDate) {
      return '';
    }

    const minDate = rawMinDate ? `${rawMinDate.getDate()}/${rawMinDate.getMonth() + 1}/${rawMinDate.getFullYear()}` : '';
    const maxDate = rawMaxDate ? `${rawMaxDate.getDate()}/${rawMaxDate.getMonth() + 1}/${rawMaxDate.getFullYear()}` : '';

    if (minDate === maxDate) {
      return rawMinDate.getFullYear();
    }

    return `${minDate} - ${maxDate}`;
  }

  render() {
    const { info, className, dates, region, remove, groupId, layout } = this.props;

    const classNames = classnames(
      `c-dashboard-item -${layout}`,
      {
        [className]: !!className
      }
    );
    const parsedInfo = { ...info, ...{ lastDate: this.state.lastDate } };
    const description = info.description || FAKE_DESCRIPTION;
    const dateLabel = this.getDatesLabel();
    const agency = info.agency || {};

    return (
      // Grid layout
      layout === 'grid' ?
        <article className={classNames}>
          {/* Header */}
          <header className="item-header">
            <h1 className="item-title">{info && info.title}</h1>
            {!remove && <p className="item-dates">{dateLabel}</p>}
            <div className="item-tools">
              <ItemTools
                groupId={groupId}
                info={parsedInfo}
                dates={dates}
                minMaxDates={this.state.minMaxDates}
                remove={remove}
                options={{ dates, region, indicator: info['indicator-id'] }}
                onSetDate={this.onSetDate}
                onRemoveItem={this.props.onRemoveItem}
              />
            </div>
            {/* Global value */}
            <div className="general-value">
              <p />
            </div>
          </header>

          {/* Indicator type detail - Content */}
          <section className="type-detail">
            <Chart
              info={this.props.info}
              dates={dates}
              region={region}
              setLastDate={this.setLastDate}
              setMinMaxDates={this.setMinMaxDates}
            />
          </section>

          {/* Footer */}
          <footer className="item-footer">
            <div className="info">
              <TopicIcon topic={info.topic ? info.topic.name : ''} />
              <span className="update">Last update: {this.state.lastDate}</span>
              <span className="logo">
                <img src={`${process.env.KENYA_PATH}/${agency.logo}`} alt={agency.name} />
              </span>
            </div>
            {!remove &&
              <div className="">
                <button className="item-link" onClick={() => this.onLink(info.indicator_id)}>
                  <Icon name="icon-arrow-right" className="-smaller" />
                </button>
              </div>
            }
          </footer>
        </article> :
        // List layout
        <article className={classNames}>
          <Media device="mobile">
            <button className="full-link" onClick={() => this.onLink(info.indicator_id)}>
              <div className="row collapse">
                <div className="column small-12">
                  <div className="item-metadata content-container">
                    {/* Header */}
                    <header className="item-header">
                      <h1 className="item-title">{info && info.title}</h1>
                      {!remove && <p className="item-dates">{dateLabel}</p>}
                    </header>
                  </div>
                </div>

                {/* Global value */}
                {/* <div className="column small-6">
                  <div className="content-container">
                    <p>{info.globalValue || ''}</p>
                  </div>
                </div> */}
              </div>
            </button>
          </Media>
          <Media device="desktop+">
            <div className="row collapse">
              <div className="column small-12 medium-6">
                <div className="item-metadata content-container">
                  {/* Header */}
                  <header className="item-header">
                    <h1 className="item-title">{info && info.title}</h1>
                    {!remove && <p className="item-dates">{dateLabel}</p>}
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
                      <p
                        dangerouslySetInnerHTML={{ __html: this.getDescription() }}
                      />
                      {description.length > 250 &&
                        <button className="btn btn-more" onClick={this.onToggleModal}>
                          View more
                        </button>
                      }
                    </div>
                  </header>

                  {/* Footer */}
                  <footer className="item-footer">
                    <div className="info">
                      <TopicIcon topic={info.topic ? info.topic.name : ''} tooltip={info.topic && !!info.topic.name} />
                      <span className="update">Last update: {this.state.lastDate}</span>
                      <span className="logo">
                        <img src={`${process.env.KENYA_PATH}/${agency.logo}`} alt={agency.name} />
                      </span>
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
                  <button className="item-link" onClick={() => this.onLink(info.indicator_id)}>
                    <Icon name="icon-arrow-right" className="-smaller" />
                  </button>
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
