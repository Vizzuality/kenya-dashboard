import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Services
import modal from 'services/modal';

// Components
import IndicatorInfo from 'components/modal-contents/indicator-info';
import Icon from 'components/ui/icon';


export default class ItemTools extends React.Component {
  constructor(props) {
    super(props);

    // Bindings
    this.onToggleModal = this.onToggleModal.bind(this);
    this.onSetDate = this.onSetDate.bind(this);
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

  onSetDate(e) {
    this.props.setDate(e);
  }


  render() {
    const { className, info, remove } = this.props;
    const classNames = classnames(
      'c-item-tools',
      { [className]: !!className }
    );

    return (
      <div className={classNames}>
        <div className="select-date" onClick={this.onSetDate}>
          {info.frequency && info.frequency !== '' &&
            info.frequency === 'days' ?
              'Pick days' :
              'Pick date'
          }
        </div>
        <div className="other-tools">
          <button className="btn" onClick={this.onToggleModal}>
            <Icon name="icon-info" />
          </button>
          <button className="btn">
            <Icon name="icon-download" />
          </button>
          {remove &&
            <button className="btn">
              <Icon name="icon-remove" />
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
  remove: PropTypes.bool,
  // Actions
  setDate: PropTypes.func
};
