import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

// Libraries
import classnames from 'classnames';

// Services
import modal from 'services/modal';

// utils
import { encode, decode } from 'utils/general';
import { toastr } from 'react-redux-toastr';

// Components
import { Link } from 'routes';
import IndicatorInfo from 'components/modal-contents/indicator-info';
import Icon from 'components/ui/icon';
import PickDate from 'components/ui/pickdate';
import Tooltip from 'components/ui/tooltip';


class ItemTools extends React.Component {
  constructor(props) {
    super(props);

    // Bindings
    this.onToggleModal = this.onToggleModal.bind(this);
    this.onRemoveItem = this.onRemoveItem.bind(this);
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

  onRemoveItem() {
    const { info, groupId } = this.props;

    toastr.confirm('Are you sure that you want to delete this indicator', {
      onOk: () => {
        this.props.onRemoveItem(info.id, groupId);
      },
      onCancel: () => console.info('canceled')
    });
  }

  render() {
    const { info, className, dates, remove, options, user, routes, minMaxDates } = this.props;
    const classNames = classnames(
      'c-item-tools',
      { [className]: !!className }
    );
    const queryFilters = routes.query && routes.query.filters ? decode(routes.query.filters) : {};
    const filters = Object.assign({}, options, queryFilters);
    const encodedFilters = encode(filters);

    return (
      <div className={classNames}>
        {info.frenquency !== null && remove &&
          <div className="select-date">
            <PickDate dates={dates} onChange={this.props.onSetDate} minMaxDates={minMaxDates} />
          </div>
        }

        <div className="other-tools">
          {/* Info */}
          <Tooltip
            className="c-tooltip"
            id="tooltip-btn-info"
            place="top"
            effect="solid"
            event="mouseenter"
            eventOff="mouseleave"
          >
            <button className="btn" onClick={this.onToggleModal}>
              <Icon name="icon-info" className="-small" />
            </button>

            <div>Info</div>
          </Tooltip>

          {/* Info */}
          <Tooltip
            className="c-tooltip"
            id="tooltip-btn-print"
            place="top"
            effect="solid"
            event="mouseenter"
            eventOff="mouseleave"
          >
            <Link route={`${process.env.KENYA_PATH}/widget/${info.id}/export?options=${encodedFilters}&token=${user.auth_token}&waitFor=3000`}>
              <a className="btn" download>
                <Icon name="icon-print" className="-small" />
              </a>
            </Link>
            <div>Print</div>
          </Tooltip>

          {remove &&
            <Tooltip
              className="c-tooltip"
              id="tooltip-btn-remove"
              place="top"
              effect="solid"
              event="mouseenter"
              eventOff="mouseleave"
            >
              <button className="btn" onClick={this.onRemoveItem}>
                <Icon name="icon-remove" className="-small" />
              </button>

              <div>Remove</div>
            </Tooltip>
          }
        </div>
      </div>
    );
  }
}

ItemTools.propTypes = {
  className: PropTypes.string,
  groupId: PropTypes.string,
  info: PropTypes.object,
  options: PropTypes.object,
  dates: PropTypes.object,
  minMaxDates: PropTypes.object,
  remove: PropTypes.bool,
  // Actions
  onSetDate: PropTypes.func,
  onRemoveItem: PropTypes.func,
  user: PropTypes.object,
  routes: PropTypes.object
};

const mapStateToProps = state => ({
  user: state.user,
  routes: state.routes
});

export default connect(mapStateToProps)(ItemTools);
