import React from 'react';
import PropTypes from 'prop-types';

import { connect } from 'react-redux';

// Libraries
import classnames from 'classnames';

// Services
import modal from 'services/modal';

// utils
import { encode, decode } from 'utils/general';

// Components
import { Link } from 'routes';
import IndicatorInfo from 'components/modal-contents/indicator-info';
import Icon from 'components/ui/icon';
import PickDate from 'components/ui/pickdate';


class ItemTools extends React.Component {
  constructor(props) {
    super(props);

    // Bindings
    this.onToggleModal = this.onToggleModal.bind(this);
    // this.onDownloadWidget = this.onDownloadWidget.bind(this);
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
    this.props.onRemoveItem(info.id, groupId);
  }

  // onDownloadWidget() {
  //   const { info, options } = this.props;
  //   const encodedFilters = encode(options);
  //   const name = info.title.split(' ').join('_');
  //   const url = `${window.location.origin}/widget/${info.id}?options=${encodedFilters}`;
  //   window.location.href = `https://staging-api.globalforestwatch.org/v1/webshot/pdf?url=${url}&name=${name}`;
  // }

  render() {
    const { info, className, dates, remove, options, user, routes } = this.props;
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
            <PickDate dates={dates} onChange={this.props.onSetDate} />
          </div>
        }
        <div className="other-tools">
          <button className="btn" onClick={this.onToggleModal}>
            <Icon name="icon-info" className="-smaller" />
          </button>
          {/* <button className="btn" onClick={this.onDownloadWidget}>
            <Icon name="icon-download" className="-smaller" />
          </button> */}
          <Link route={`/widget/${info.id}/export?options=${encodedFilters}&token=${user.auth_token}&waitFor=3000`}>
            <a className="btn">
              <Icon name="icon-download" className="-smaller" />
            </a>
          </Link>
          {remove &&
            <button className="btn" onClick={this.onRemoveItem}>
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
  groupId: PropTypes.string,
  info: PropTypes.object,
  options: PropTypes.object,
  dates: PropTypes.object,
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
