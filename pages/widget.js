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

// Components
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';
import Icon from 'components/ui/icon';
import Chart from 'components/ui/chart';

// Constants
import { TOPICS_ICONS_SRC } from 'constants/filters';

const DESERIALIZER = new Deserializer();

class WidgetPage extends Page {
  static async getInitialProps({ req, store, isServer }) {
    let { user } = isServer ? req : store.getState();
    if (!user && isServer && req.query.token) user = { auth_token: req.query.token };
    if (isServer) store.dispatch(setUser(user));
    return { user, isServer };
  }

  constructor(props) {
    super(props);
    this.state = {
      info: null
    };
  }

  componentDidMount() {
    this.options = typeof window !== 'undefined' ? decode(this.props.url.query.options) : {};
    this.getIndicator(this.options.indicator);
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

  render() {
    const { info } = this.state;
    const { className, url, user } = this.props;
    const classNames = classnames('c-dashboard-item -print', { [className]: !!className });
    const typeClass = info ? lowerCase(info.topic.name).split(' ').join('_') : '';

    return (
      <Layout
        title="Widget"
        description="Widget description..."
        url={url}
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
  user: PropTypes.object
};

const mapStateToProps = state => ({
  user: state.user
});

// const mapDispatchToProps = dispatch => ({
//   getAgencies: bindActionCreators(userToken => getAgencies(userToken), dispatch)
// });

export default withRedux(initStore, mapStateToProps)(WidgetPage);
