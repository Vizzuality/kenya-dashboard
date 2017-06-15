import React from 'react';
import PropTypes from 'prop-types';

// Constants
import { TABS_OPERATORS_DETAIL } from 'constants/operators-detail';

// Redux
import withRedux from 'next-redux-wrapper';
import { store } from 'store';
import { getOperator } from 'modules/operators-detail';

// Components
import Page from 'components/layout/page';
import Layout from 'components/layout/layout';
import StaticHeader from 'components/ui/static-header';
import Tabs from 'components/ui/tabs';
import Spinner from 'components/ui/spinner';

// Operator Details Tabs
import OperatorsDetailOverview from 'components/operators-detail/overview';
import OperatorsDetailDocumentation from 'components/operators-detail/documentation';
import OperatorsDetailObservations from 'components/operators-detail/observations';
import OperatorsDetailFMUs from 'components/operators-detail/fmus';

class OperatorsDetail extends Page {

  /**
   * HELPERS
   * - getTabOptions
  */
  getTabOptions() {
    // TODO: handle with documentation percentage
    const operatorsDetail = this.props.operatorsDetail.data;

    return TABS_OPERATORS_DETAIL.map((tab) => {
      const tabData = operatorsDetail[tab.value];

      return {
        ...tab,
        number: (tabData) ? tabData.length : null
      };
    });
  }

  /**
   * COMPONENT LIFECYCLE
  */
  componentDidMount() {
    const { url } = this.props;

    this.props.getOperator(url.query.id);
  }


  render() {
    const { url, session, operatorsDetail } = this.props;
    const id = url.query.id;
    const tab = url.query.tab || 'overview';

    return (
      <Layout
        title={operatorsDetail.data.name || '-'}
        description="Forest operator's name description..."
        url={url}
        session={session}
      >
        <Spinner isLoading={operatorsDetail.loading} className="-fixed" />

        <StaticHeader
          title={operatorsDetail.data.name || '-'}
          background="/static/images/static-header/bg-operator-detail.jpg"
        />

        <Tabs
          href={{
            pathname: url.pathname,
            query: { id },
            as: `/operators/${id}`
          }}
          options={this.getTabOptions()}
          defaultSelected={tab}
          selected={tab}
        />

        {tab === 'overview' &&
          <OperatorsDetailOverview
            operatorsDetail={operatorsDetail}
            url={url}
          />
        }

        {tab === 'documentation' &&
          <OperatorsDetailDocumentation
            url={url}
          />
        }

        {tab === 'observations' &&
          <OperatorsDetailObservations
            url={url}
          />
        }

        {tab === 'fmus' &&
          <OperatorsDetailFMUs
            url={url}
          />
        }

      </Layout>
    );
  }

}

OperatorsDetail.propTypes = {
  url: PropTypes.object.isRequired,
  session: PropTypes.object.isRequired
};

export default withRedux(
  store,
  state => ({
    operatorsDetail: state.operatorsDetail
  }),
  { getOperator }
)(OperatorsDetail);