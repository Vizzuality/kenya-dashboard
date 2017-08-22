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

// Components
import Page from 'components/layout/page';
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
      widget: null,
      data: null
    };
  }

  componentDidMount() {
    const { url } = this.props;

    // Set user
    if (localStorage.token && localStorage.token !== '') {
      this.props.setUser({ auth_token: localStorage.token });
    }

    this.getIndicator(url.query.id);
  }

  componentWillReceiveProps(nextProps) {
    if (!nextProps.user.logged) {
      window.location.pathname = '/';
    }
  }

  getIndicator(id) {
    const headers = setBasicQueryHeaderHeaders({ Authorization: localStorage.getItem('token') });

    fetch(`${process.env.KENYA_API}/indicators/${id}?include=topic,widgets,agency&page[size]=999$`, headers)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((data) => {
        DESERIALIZER.deserialize(data, (err, dataParsed) => {
          const widget = dataParsed.widgets && dataParsed.widgets.find(w => w.default);
          this.setState({ widget });
        });
      })
      .catch(() => {
        window.location.pathname = '/';
      });
  }

  getData() {
    // const options = decode(this.props.url.query.filters);
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
    return <p className="no-data">No data available</p>;
  }

  render() {
    const { widget } = this.state;
    const { className } = this.props;
    const options = decode(this.props.url.query.filters);
    const classNames = classnames({
      'c-dashboard-item': true,
      [className]: !!className,
      [options.threshold]: options.threshold
    });
    const typeClass = widget ? lowerCase(widget.topic).split(' ').join('_') : '';

    return (
      <div>
        {widget &&
          <article className={classNames}>
            {/* Header */}
            <header className="item-header">
              <h1 className="item-title">{widget && widget.title}</h1>
            </header>

            {/* Indicator type detail - Content */}
            <section className="type-detail">
              {this.state.data !== undefined && this.getItemType()}
            </section>

            {/* Footer */}
            <footer className="item-footer">
              <div className="info">
                <Icon name={`icon-${TOPICS_ICONS_SRC[typeClass]}`} clasName="" />
                <div className="c-tooltip">{widget.topic}</div>
                <span className="update">Last update: {widget.updatedAt}</span>
              </div>
            </footer>
          </article>
        }
      </div>
    );
  }
}

WidgetPage.propTypes = {
  url: PropTypes.object
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
