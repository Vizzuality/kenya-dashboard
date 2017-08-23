import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';
import fetch from 'isomorphic-fetch';

// Services
import modal from 'services/modal';

// utils
import { encode } from 'utils/general';
import { post } from 'utils/request';

// Components
import IndicatorInfo from 'components/modal-contents/indicator-info';
import Icon from 'components/ui/icon';
import PickDate from 'components/ui/pickdate';


export default class ItemTools extends React.Component {
  constructor(props) {
    super(props);

    // Bindings
    this.onToggleModal = this.onToggleModal.bind(this);
    this.onDownloadWidget = this.onDownloadWidget.bind(this);
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

  onDownloadWidget() {
    const { info, options } = this.props;
    const encodedFilters = encode(options);
    const name = info.title.split(' ').join('_');
    const url = `${window.location.origin}/widget/${info.id}?options=${encodedFilters}`;
    window.location.href = `https://staging-api.globalforestwatch.org/v1/webshot/pdf?url=${url}&name=${name}`;
  }

  render() {
    const { info, className, dates, remove } = this.props;
    const classNames = classnames(
      'c-item-tools',
      { [className]: !!className }
    );

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
          {/* <a className="btn" href={`/widget/${info.id}?options=${encodedFilters}`} target="_blank">
          </a> */}
          <button className="btn" onClick={this.onDownloadWidget}>
            <Icon name="icon-download" className="-smaller" />
          </button>
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
