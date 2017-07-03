import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Components
import TableType from 'components/indicators/table-type';
import ArcType from 'components/indicators/arc-type';

// Utils
import { getCartoData } from 'utils/request';

// Constants
import { THRESHOLD } from 'constants/indicators';

export default class PanelItem extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      data: {}
    };
  }

  componentWillMount() {
    const data = getCartoData(this.props.info.query);
    this.setState({ data });
  }

  getItemType() {
    switch (this.props.info.type) {
      case 1: return <TableType data={this.state.data} />;
      case 2: return <ArcType data={this.state.data} />;
      default: return '';
    }
  }

  render() {
    const { info, className } = this.props;
    const classNames = classnames({
      'c-panel-item': true,
      [className]: !!className,
      [`-${THRESHOLD[info.threshold]}`]: !!info.threshold
    });

    return (
      <div className={classNames}>
        <h2>{info.category}</h2>
        <h3>{info.name}</h3>

        {/* Indicator type */}
        {this.getItemType()}

        <p><span>{info.source}</span>/ <span>{info.updatedAt}</span></p>
      </div>
    );
  }
}

PanelItem.propTypes = {
  info: PropTypes.object,
  className: PropTypes.string
};

PanelItem.defaultProps = {
  info: {}
};
