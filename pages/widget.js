import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';
import { setUser } from 'modules/user';

// Libraries
import { Deserializer } from 'jsonapi-serializer';
import fetch from 'isomorphic-fetch';
import classnames from 'classnames';
import lowerCase from 'lodash/lowerCase';

// utils
import { decode, setBasicQueryHeaderHeaders } from 'utils/general';
import isEmpty from 'lodash/isEmpty';

// Components
import { Router } from 'routes';
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';
import Icon from 'components/ui/icon';
import Chart from 'components/ui/chart';

// Constants
import { TOPICS_ICONS_SRC } from 'constants/filters';

const DESERIALIZER = new Deserializer();

class WidgetPage extends Page {
  static async getInitialProps({ req, store, query, isServer, asPath, pathname }) {
    const { options, token } = query;
    const url = { asPath, pathname, query };
    let { user } = isServer ? req : store.getState();
    if (!user && isServer && token) user = { auth_token: token };
    if (isServer) store.dispatch(setUser(user));
    return { user, isServer, options: decode(options), url };
  }

  constructor(props) {
    super(props);
    this.state = {
      info: null,
      lastDate: ''
    };

    // Bindings
    this.setLastDate = this.setLastDate.bind(this);
  }

  componentWillMount() {
    if (!this.props.isServer && isEmpty(this.props.user)) Router.pushRoute('home');
  }

  componentDidMount() {
    this.getIndicator(this.props.options.indicator);
  }

  getIndicator(id) {
    const { user } = this.props;
    const headers = setBasicQueryHeaderHeaders({ Authorization: user.auth_token });

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
      });
  }

  setLastDate(date) {
    const index = date.indexOf('T');
    const parsedDate = new Date(date.slice(0, index));
    const lastDate = `${parsedDate.getFullYear()}/${parsedDate.getMonth() + 1}/${parsedDate.getDate()}`;
    this.setState({ lastDate });
  }

  render() {
    const { info } = this.state;
    const { className, url, options } = this.props;
    const { dates, region } = options;
    const classNames = classnames('c-dashboard-item -print', { [className]: !!className });
    const typeClass = info ? lowerCase(info.topic.name).split(' ').join('_') : '';

    return (
      <Layout
        title="Widget"
        description="Widget description..."
        url={url}
        hasHeader={false}
        hasFooter={false}
        className="p-widget"
        logged
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
                info={info}
                dates={dates}
                region={region}
              />
            </section>

            {/* Footer */}
            <footer className="item-footer">
              <div className="info">
                <div className="topic">
                  <Icon name={`icon-${TOPICS_ICONS_SRC[typeClass]}`} className="-big" />
                  <span className="">{info.topic.name}</span>
                </div>
                <span className="update">Last update: {this.state.lastDate}</span>
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
  user: PropTypes.object,
  options: PropTypes.object,
  isServer: PropTypes.bool
};

const mapStateToProps = state => ({
  user: state.user
});

// const mapDispatchToProps = dispatch => ({
//   getAgencies: bindActionCreators(userToken => getAgencies(userToken), dispatch)
// });

export default withRedux(initStore, mapStateToProps)(WidgetPage);
