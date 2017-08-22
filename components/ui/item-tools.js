import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Services
import modal from 'services/modal';

// utils
import { encode } from 'utils/general';

// Components
import { Link } from 'routes';
import IndicatorInfo from 'components/modal-contents/indicator-info';
import Icon from 'components/ui/icon';
import PickDate from 'components/ui/pickdate';


export default class ItemTools extends React.Component {
  constructor(props) {
    super(props);

    // Bindings
    this.onToggleModal = this.onToggleModal.bind(this);
  }

  onToggleModal() {
    const opts = {
      children: IndicatorInfo,
      childrenProps: {
        info: this.props.info
      }
    };
    modal.toggleModal(true, opts);
  }

  render() {
    const { info, className, dates, options, remove } = this.props;
    const classNames = classnames(
      'c-item-tools',
      { [className]: !!className }
    );
    const encodedFilters = encode(options);

    return (
      <div className={classNames}>
        {info.granularity !== null &&
          <div className="select-date">
            <PickDate dates={dates} onChange={this.props.onSetDate} />
          </div>
        }
        <div className="other-tools">
          <button className="btn" onClick={this.onToggleModal}>
            <Icon name="icon-info" className="-smaller" />
          </button>
          <Link route={`/widget/${info['indicator-id']}?options=${encodedFilters}`}>
            <a className="btn">
              <Icon name="icon-download" className="-smaller" />
            </a>
          </Link>
          {remove &&
            <button className="btn">
              <Icon name="icon-remove" className="-smaller" />
            </button>
          }
        </div>
      </div>
    );
  }
}

ItemTools.propTypes = {
  className: PropTypes.string,
  info: PropTypes.object,
  options: PropTypes.object,
  dates: PropTypes.object,
  remove: PropTypes.bool,
  // Actions
  onSetDate: PropTypes.func
};
