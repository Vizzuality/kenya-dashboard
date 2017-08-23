import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { store } from 'store';

// Modules
import { setUser } from 'modules/user';

// Libraries
import { Deserializer } from 'jsonapi-serializer';
import fetch from 'isomorphic-fetch';
import classnames from 'classnames';
import lowerCase from 'lodash/lowerCase';

// utils
import { decode, setBasicQueryHeaderHeaders } from 'utils/general';
import { get } from 'utils/request';

// Components
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';
import Icon from 'components/ui/icon';
// Widget types
import TableType from 'components/charts/table-type';
import TrendType from 'components/charts/trend-type';
import ExtremesType from 'components/charts/extremes-type';
import PieType from 'components/charts/pie-type';
import LineType from 'components/charts/line-type';
import BarsType from 'components/charts/bars-type';
import BarsLineType from 'components/charts/bars-line-type';

// Constants
import { TOPICS_ICONS_SRC } from 'constants/filters';

const DESERIALIZER = new Deserializer();


class WidgetPage extends Page {
  constructor(props) {
    super(props);

    this.state = {
      info: null,
      data: null
    };

    // Bindings
    this.setData = this.setData.bind(this);
  }

  componentDidMount() {
    this.options = typeof window !== 'undefined' ? decode(this.props.url.query.options) : {};

    // Set user
    if (localStorage.token && localStorage.token !== '') {
      this.props.setUser({ auth_token: localStorage.token });
    }

    this.getIndicator(this.options.indicator);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.user.logged) {
      window.location.pathname = '/';
    }
  }

  getIndicator(id) {
    const headers = setBasicQueryHeaderHeaders({ Authorization: localStorage.getItem('token') });

    fetch(`${process.env.KENYA_API}/indicators/${id}?include=topic,widgets&page[size]=999$`, headers)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((data) => {
        DESERIALIZER.deserialize(data, (err, dataParsed) => {
          const info = dataParsed.widgets &&
            dataParsed.widgets.find(w => w.id === this.props.url.query.id);
          const parsedInfo = { ...info, ...{ topic: dataParsed.topic } };
          this.setState({ info: parsedInfo }, () => this.getData(parsedInfo));
        });
      })
      .catch(() => {
        window.location.pathname = '/';
      });
  }

  setData(data) {
    this.setState({
      data: data && data.rows && data.rows.length ? data.rows[0] : null
    });
  }

  getData(data) {
    const { dates, region } = this.options;
    if (data) {
      const token = localStorage.getItem('token');
      // token, widget_id, region, start_date, end_date
      const url = 'https://cdb.resilienceatlas.org/user/kenya/api/v2/sql';
      // Params
      let params = `'${token}', ${data.id}`;
      params += region && region !== '' ? `, '${region}'` : ", '779'";

      if (dates) {
        const start = `${dates.start.year}-${dates.start.month}-${dates.start.day}`;
        const end = `${dates.end.year}-${dates.end.month}-${dates.end.day}`;
        params += `, '${start}', '${end}'`;
      }

      const query = `select * from get_widget(${params})`;

      get({
        url: `${url}?q=${query}`,
        onSuccess: this.setData,
        onError: this.setData
      });
    } else {
      this.setState({ data: null });
    }
  }

  getItemType() {
    const { data, info } = this.state;

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
        default: return 'No type';
      }
    }
    return <p className="no-data">No data available</p>;
  }

  render() {
    const { info } = this.state;
    const { className, url, session, user } = this.props;
    const classNames = classnames({
      'c-dashboard-item': true,
      [className]: !!className
      // [this.options.threshold]: this.options ? this.options.threshold : false
    });
    const typeClass = info ? lowerCase(info.topic.name).split(' ').join('_') : '';
    const content = this.getItemType();

    return (
      <Layout
        title="Widget"
        description="Widget description..."
        url={url}
        session={session}
        hasHeader={false}
        hasFooter={false}
        logged={user.logged}
      >
        {info ?
          <article className={classNames}>
            {/* Header */}
            <header className="item-header">
              <h1 className="item-title">{info && info.title}</h1>
            </header>

            {/* Indicator type detail - Content */}
            <section className="type-detail">
              {this.state.data !== undefined && content}
            </section>

            {/* Footer */}
            <footer className="item-footer">
              <div className="info">
                <div>
                  <Icon name={`icon-${TOPICS_ICONS_SRC[typeClass]}`} clasName="-small" />
                  <span className="">{info.topic.name}</span>
                </div>
                <span className="update">Last update: {info.updatedAt}</span>
              </div>
            </footer>
          </article> : ''
        }
      </Layout>
    );
  }
}

WidgetPage.propTypes = {
  url: PropTypes.object,
  session: PropTypes.object
};

export default withRedux(
  store,
  state => ({
    user: state.user
  }),
  dispatch => ({
    // User
    setUser(user) { dispatch(setUser(user)); }
  })
)(WidgetPage);
