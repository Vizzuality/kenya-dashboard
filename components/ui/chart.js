import React from 'react';
import PropTypes from 'prop-types';

// Redux
import { connect } from 'react-redux';

// Libraries
import classnames from 'classnames';
import isEqual from 'lodash/isEqual';

// utils
import { get } from 'utils/request';

// Components
import Spinner from 'components/ui/spinner';
import TableType from 'components/charts/table-type';
import TrendType from 'components/charts/trend-type';
import ExtremesType from 'components/charts/extremes-type';
import PieType from 'components/charts/pie-type';
import LineType from 'components/charts/line-type';
import BarsType from 'components/charts/bars-type';
import BarsLineType from 'components/charts/bars-line-type';

class Chart extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: undefined
    };

    // Bindings
    this.setData = this.setData.bind(this);
  }

  componentDidMount() {
    const { info, region, dates, user } = this.props;
    const attr = { info, region, dates };
    if (user && info && info.id) this.getData(attr, this.setData, this.setData);
  }

  componentWillReceiveProps(nextProps) {
    const { info, region, dates } = nextProps;
    const attr = { info, region, dates };

    if ((info && info.id && !isEqual(this.props.info, info)) ||
      this.props.region !== nextProps.region ||
      !isEqual(this.props.dates, nextProps.dates)) {
      this.getData(attr, this.setData, this.setData);
    }
  }

  getItemType() {
    const { data } = this.state;
    const { info } = this.props;

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

  setData(data) {
    this.setState({
      data: data && data.rows && data.rows.length ? data.rows[0] : null
    });
  }

  getData(attr, onSuccess, onError) {
    const { info, dates, region } = attr;
    const { user } = this.props;
    if (info) {
      const token = user.auth_token;
      // token, widget_id, region, start_date, end_date
      const url = 'https://cdb.resilienceatlas.org/user/kenya/api/v2/sql';
      // Params
      let params = `'${token}', ${info.id}`;
      params += region && region !== '' ? `, '${region}'` : ", '779'";

      if (dates) {
        const start = `${dates.start.year}-${dates.start.month}-${dates.start.day}`;
        const end = `${dates.end.year}-${dates.end.month}-${dates.end.day}`;
        params += `, '${start}', '${end}'`;
      }

      const query = `select * from get_widget(${params})`;

      get({
        url: `${url}?q=${query}`,
        onSuccess,
        onError
      });
    } else {
      this.setState({ data: null });
    }
  }

  render() {
    const { className } = this.props;
    const classNames = classnames(
      'c-chart',
      { [className]: !!className }
    );
    const content = this.getItemType();

    return (
      <div className={classNames}>
        <Spinner isLoading={this.state.data === undefined} />
        {content}
      </div>
    );
  }
}

Chart.propTypes = {
  user: PropTypes.object,
  className: PropTypes.string,
  info: PropTypes.object,
  region: PropTypes.string,
  dates: PropTypes.object,
  // Actions
  onPrint: PropTypes.func
};

const mapStateToProps = state => ({
  user: state.user
});

export default connect(mapStateToProps, null)(Chart);
