import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import isEmpty from 'lodash/isEmpty';

// Components
import { Link } from 'routes';
import TableType from 'components/indicators/table-type';
import ArcType from 'components/indicators/arc-type';
import Spinner from 'components/ui/spinner';

// Utils
import { get } from 'utils/request';

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

  setData(data) {
    // TODO Provisional query data
    this.setState({ data: EXAMPLE_QUERY_DATA });

    // this.setState({ data });
  }

  getItemType() {
    switch (this.props.info.type) {
      case 'A': return <TableType data={this.state.data} />;
      case 'B': return <ArcType data={this.state.data} />;
      default: return '';
    }
  }

  getContent() {
    const { info } = this.props;

    return (
      <div>
        <h2>{info.category}</h2>
        <h3>{info.name}</h3>

        {/* Indicator type detail */}
        <div className="type-detail">
          <Spinner isLoading={this.state.data === undefined} />
          {this.state.data !== undefined && !isEmpty(this.state.data) &&
            this.getItemType()}
        </div>

        <p><span>{info.source}</span>/ <span>{info.updatedAt}</span></p>
      </div>
    );
  }

  getThreshold(thresholdVal) {
    let currentThreshold;

    Object.keys(this.props.info.threshold).forEach((key) => {
      if (+thresholdVal > +this.props.info.threshold[key]) {
        currentThreshold = key;
      }
    });

    return currentThreshold;
  }

  render() {
    const { info, className } = this.props;
    const { data } = this.state;
    const threshold = data && data.threshold ? this.getThreshold(data.threshold) : null;

    const classNames = classnames({
      'c-dashboard-item': true,
      [className]: !!className,
      [`-${threshold || 'default'}`]: !!info.threshold && !isEmpty(info.threshold) && !!data && !!data.threshold
    });
    const content = this.getContent();

    return (
      <div className={classNames}>
        <Link route="indicator" params={{ indicators: info.id }}>
          <a>
            {content}
          </a>
        </Link>
      </div>
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
