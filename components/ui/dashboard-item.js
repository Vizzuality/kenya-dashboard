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
import PieType from 'components/charts/pie-type';
import LineType from 'components/charts/line-type';
import BarsType from 'components/charts/bars-type';

// Constants
import { THRESHOLD_EXAMPLE } from 'constants/general';


export default class DashboardItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: undefined,
      date: ''
    };

    this.defaultWidget = props.info.widgets.find(w => w.default);

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
    const { region } = this.props;
    const token = localStorage.getItem('token');

    if (this.defaultWidget) {
      // token, widget_id, region, start_date, end_date
      const url = 'https://cdb.resilienceatlas.org/user/kenya/api/v2/sql';
      const query = `select * from get_widget('${token}',
        ${this.defaultWidget.id})`;
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
    // const { info } = this.props;

    if (this.state.data && this.state.data.data) {
      // switch (this.defaultWidget['json-config'].type) {
      //   case 'table': return <TableType data={this.state.data} />;
      //   case 'pie': return (
      //     <PieType
              //   data={this.state.data.data}
              //   // threshold={info.json_config.threshold}
              //   threshold={THRESHOLD_EXAMPLE}
              // />
      //   );
      //   case 'line': return (
          //   <LineType
          //     data={this.state.data.data}
          //     // threshold={info.json_config.threshold}
          //     threshold={THRESHOLD_EXAMPLE}
          //   />
          // );
      //   default: return '';
      // }
      return (
        <BarsType
          data={this.state.data.data}
          // threshold={info.json_config.threshold}
          threshold={THRESHOLD_EXAMPLE}
        />
      );
    }
    return '';
  }

  render() {
    const { info, className } = this.props;
    // const { data } = this.state;
    // const widgetThreshold = this.props.info.json_config.threshold;
    // const threshold = data && data.threshold ?
    //   getThreshold(data.threshold, info.json_config.threshold) :
    //   null;

    const classNames = classnames({
      'c-dashboard-item': true,
      [className]: !!className
      // [`-${threshold || 'default'}`]: !!widgetThreshold && !isEmpty(widgetThreshold) && !!data && !!data.threshold
    });
    const modalInfo = {
      ...this.defaultWidget,
      ...{ updatedAt: info.updatedAt, agency: info.agency, topic: info.topic }
    };

    return (
      <article className={classNames}>
        {/* Header */}
        <header className="item-header">
          <h1 className="item-title">{this.defaultWidget && this.defaultWidget.title}</h1>
          <div className="item-tools">
            <ItemTools info={modalInfo} setDate={this.onSetDate} />
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
  className: PropTypes.string,
  info: PropTypes.object,
  region: PropTypes.string
};

DashboardItem.defaultProps = {
  info: {}
};
