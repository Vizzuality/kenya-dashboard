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
  }

  onToggleModal() {
    const opts = {
      children: IndicatorInfo,
      childrenProps: {
        info: this.props.info
        // closeModal: modal.toggleModal
      }
    };
    modal.toggleModal(true, opts);
  }


  render() {
    const { className } = this.props;
    const classNames = classnames(
      'c-item-tools',
      { [className]: !!className }
    );

    return (
      <div className={classNames}>
        <button className="" onClick={this.onToggleModal}>
          <Icon name="icon-info" />
        </button>
        <button>
          <Icon name="icon-download" />
        </button>
        <button>
          <Icon name="icon-remove" />
        </button>
      </div>
    );
  }
}

ItemTools.propTypes = {
  className: PropTypes.string,
  info: PropTypes.object
};
