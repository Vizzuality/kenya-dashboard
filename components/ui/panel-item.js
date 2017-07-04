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
import { THRESHOLD } from 'constants/indicators';


export default class PanelItem extends React.Component {
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
      this.setState({ data: null });
    }
  }

  setData(data) {
    this.setState({ data });
  }

  getItemType() {
    switch (this.props.info.type) {
      case 1: return <TableType data={this.state.data} />;
      case 2: return <ArcType data={this.state.data} />;
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

  render() {
    const { info, className, isLink } = this.props;
    const classNames = classnames({
      'c-panel-item': true,
      [className]: !!className,
      '-link': isLink,
      [`-${THRESHOLD[info.threshold]}`]: !!info.threshold
    });
    const content = this.getContent();

    return (
      <div className={classNames}>
        {isLink ?
          <Link route="indicator" params={{ indicator: info.slug }}>
            <a>
              {content}
            </a>
          </Link> :
          content
        }
      </div>
    );
  }
}

PanelItem.propTypes = {
  info: PropTypes.object,
  isLink: PropTypes.bool,
  className: PropTypes.string
};

PanelItem.defaultProps = {
  info: {}
};
