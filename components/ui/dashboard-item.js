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
import TableType from 'components/indicators/table-type';
import ArcType from 'components/indicators/arc-type';
import LineType from 'components/indicators/line-type';

// Constants
import { EXAMPLE_QUERY_DATA } from 'constants/indicators';


export default class DashboardItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: undefined
    };

    // Bindings
    this.setData = this.setData.bind(this);
  }

  componentWillMount() {
    this.getIndicatorData();
  }

  getIndicatorData() {
    const { query } = this.props.info;
    if (query && query !== '') {
      get({
        url: query,
        onSuccess: this.setData,
        onError: this.setData
      });
    } else {
      // TODO Provisional query data
      this.setState({ data: EXAMPLE_QUERY_DATA });

      // this.setState({ data: null });
    }
  }

  setData() {
    // TODO Provisional query data
    this.setState({ data: EXAMPLE_QUERY_DATA });

    // this.setState({ data });
  }

  getItemType() {
    const { info } = this.props;
    switch (info.widget_type) {
      case 'table': return <TableType data={this.state.data} />;
      case 'arc': return (
        <ArcType
          data={this.state.data}
          threshold={info.json_config.threshold}
        />
      );
      case 'line': return <LineType data={this.state.data} />;
      default: return '';
    }
  }

  render() {
    const { info, className } = this.props;
    const { data } = this.state;
    const widgetThreshold = this.props.info.json_config.threshold;
    const threshold = data && data.threshold ?
      getThreshold(data.threshold, info.json_config.threshold) :
      null;

    const classNames = classnames({
      'c-dashboard-item': true,
      [className]: !!className,
      [`-${threshold || 'default'}`]: !!widgetThreshold && !isEmpty(widgetThreshold) && !!data && !!data.threshold
    });

    return (
      <article className={classNames}>
        {/* Header */}
        <header className="item-header">
          <h1 className="item-title">{info.title}</h1>
          <div className="item-tools">
            <ItemTools info={info} />
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
            <TopicIcon topic={info.topic} tooltip />
            <span className="update">Last update: {info.updatedAt}</span>
          </div>
          <div className="">
            <Link route="compare" params={{ indicators: info.id }}>
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
  info: PropTypes.object,
  className: PropTypes.string
};

DashboardItem.defaultProps = {
  info: {}
};
