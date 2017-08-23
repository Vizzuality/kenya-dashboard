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
import Layout from 'components/layout/layout';
import Icon from 'components/ui/icon';
import Chart from 'components/ui/chart';

// Constants
import { TOPICS_ICONS_SRC } from 'constants/filters';

const DESERIALIZER = new Deserializer();


class WidgetPage extends Page {
  constructor(props) {
    super(props);

    this.state = {
      info: null
    };

    // Bindings
    this.onPrint = this.onPrint.bind(this);
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
          this.setState({ info: parsedInfo });
        });
      })
      .catch(() => {
        window.location.pathname = '/';
      });
  }

  onPrint() {
    window.print();
    window.history.back();
  }

  render() {
    const { info } = this.state;
    const { className, url, session, user } = this.props;
    const classNames = classnames(
      'c-dashboard-item -print',
      { [className]: !!className }
      // [this.options.threshold]: this.options ? this.options.threshold : false
    );
    const typeClass = info ? lowerCase(info.topic.name).split(' ').join('_') : '';

    return (
      <Layout
        title="Widget"
        description="Widget description..."
        url={url}
        session={session}
        hasHeader={false}
        hasFooter={false}
        logged={user.logged}
        className="p-widget"
      >
        {info ?
          <article className={classNames}>
            {/* Header */}
            <header className="item-header">
              <h1 className="item-title">{info && info.title}</h1>
            </header>

            {/* Indicator type detail - Content */}
            <section className="type-detail">
              <Chart
                info={this.state.info}
                dates={this.options.dates}
                region={this.options.region}
                onPrint={this.onPrint}
              />
            </section>

            {/* Footer */}
            <footer className="item-footer">
              <div className="info">
                <div className="topic">
                  <Icon name={`icon-${TOPICS_ICONS_SRC[typeClass]}`} className="-big" />
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
