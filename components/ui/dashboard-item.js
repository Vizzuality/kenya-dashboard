import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';

// Utils
import { get } from 'utils/request';
import { getThreshold } from 'utils/general';

// Components
import { Link } from 'routes';
import ItemTools from 'components/ui/item-tools';
import Spinner from 'components/ui/spinner';
import Icon from 'components/ui/icon';
import TopicIcon from 'components/ui/topic-icon';
// Widget types
import TableType from 'components/charts/table-type';
import TrendType from 'components/charts/trend-type';
import ExtremesType from 'components/charts/extremes-type';
import PieType from 'components/charts/pie-type';
import LineType from 'components/charts/line-type';
import BarsType from 'components/charts/bars-type';
import BarsLineType from 'components/charts/bars-line-type';


export default class DashboardItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: undefined,
      date: ''
    };

    // Bindings
    this.setData = this.setData.bind(this);
    this.onSetDate = this.onSetDate.bind(this);
  }

  componentWillMount() {
    this.getIndicatorData();
  }

  /* Set widget date */
  onSetDate(e) {
    // const value = e.currentTarget.value;
    // this.setState({ date: value });
    // this.getIndicatorData();
  }

  getIndicatorData() {
    // const { region } = this.props;

    if (this.props.info) {
      const token = localStorage.getItem('token');
      // token, widget_id, region, start_date, end_date
      const url = 'https://cdb.resilienceatlas.org/user/kenya/api/v2/sql';
      const query = `select * from get_widget('${token}',
        ${this.props.info.id})`;
        // End date ?

      get({
        url: `${url}?q=${query}`,
        onSuccess: this.setData,
        onError: this.setData
      });
    } else {
      this.setState({ data: {} });
    }
  }

  setData(data) {
    this.setState({
      data: data && data.rows && data.rows.length ? data.rows[0] : {}
    });
  }

  getItemType() {
    const { info } = this.props;
    const { data } = this.state;

    if (data && data.data && info['json-config'] &&
      info['json-config'].type && info['json-config'].threshold) {
      const threshold = info['json-config'].threshold;
      const y2Axis = info['json-config'].type['secondary-axe'];

      switch (info['json-config'].type.visual) {
        case 'table': return (
          <TableType
            data={data.data}
            threshold={threshold}
            axis={info['json-config'].axes}
          />
        );
        case 'trend': return (
          <TrendType
            data={data.data}
            threshold={threshold}
            axis={info['json-config'].axes}
          />
        );
        case 'extremes': return (
          <ExtremesType
            data={data.data}
            threshold={threshold}
            axis={info['json-config'].axes}
          />
        );
        case 'pie': return (
          <PieType data={data.data} threshold={threshold} />
        );
        case 'line': return (
          <LineType
            data={data.data}
            threshold={threshold}
            y2Axis={y2Axis}
          />
        );
        case 'bars': return (
          <BarsType
            data={data.data}
            threshold={threshold}
            y2Axis={y2Axis}
          />
        );
        case 'barsLine': return (
          <BarsLineType
            data={data.data}
            threshold={threshold}
            y2Axis={y2Axis}
          />
        );
        default: return '';
      }
    }
    return '';
  }

  getThresholdQualification() {
    const { info } = this.props;
    const { data } = this.state;

    if (data && data.data && info['json-config'] &&
      info['json-config'].type && info['json-config'].threshold) {
      const threshold = info['json-config'].threshold.y;

      switch (info['json-config'].type.visual) {
        case 'table': case 'pie': case 'bars': case 'barsLine': {
          const values = data.data.map(v => v.y);
          const value = threshold.direction === 'asc' ? Math.min(...values) : Math.max(...values);
          return getThreshold(value, threshold['break-points']);
        }
        case 'line': {
          const value = data.data[data.data.length - 1].y;
          return getThreshold(value, threshold['break-points']);
        }
        default: return 'default';
      }
    }
    return null;
  }

  render() {
    const { info, className } = this.props;
    const threshold = this.getThresholdQualification();

    const classNames = classnames({
      'c-dashboard-item': true,
      [className]: !!className,
      [threshold]: threshold
    });

    return (
      <article className={classNames}>
        {/* Header */}
        <header className="item-header">
          <h1 className="item-title">{this.props.info && this.props.info.title}</h1>
          <div className="item-tools">
            <ItemTools info={info} setDate={this.onSetDate} />
          </div>
        </header>

        {/* Indicator type detail - Content */}
        <section className="type-detail">
          <Spinner isLoading={this.state.data === undefined} />
          {this.state.data !== undefined && !isEmpty(this.state.data) &&
            this.getItemType()}
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
                <Icon name="icon-arrow_next" className="-smaller" />
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
  region: PropTypes.string
};

DashboardItem.defaultProps = {
  info: {}
};
