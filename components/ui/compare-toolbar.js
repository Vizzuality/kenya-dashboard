import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';
import isEqual from 'lodash/isEqual';

// Services
import modal from 'services/modal';

// Components
import IndicatorsList from 'components/modal-contents/indicators-list';

export default class CompareToolbar extends React.Component {
  constructor(props) {
    super(props);

    this.url = props.url;

    // Bindings
    this.onAddArea = this.onAddArea.bind(this);
    this.onToggleModal = this.onToggleModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    const { url, modalOpened, indicatorsFilterList, addIndicator, removeIndicator } = this.props;

    if (!isEqual(url.query, nextProps.url.query)) {
      this.url = nextProps.url;
    }

    // Update modal content props
    if (modalOpened && nextProps.modalOpened &&
      !isEqual(this.props.url.query, nextProps.url.query)) {
      const opts = {
        children: IndicatorsList,
        childrenProps: {
          indicators: indicatorsFilterList,
          activeIndicators: nextProps.indicatorsList.map(ind => ind.id),
          url: nextProps.url,
          addIndicator,
          removeIndicator,
          closeModal: modal.toggleModal
        }
      };
      modal.setModalOptions(opts);
    }
  }

  /* Add area */
  onAddArea() {
    Object.keys(this.props.areas).length < 3 &&
      this.props.addArea(this.props.url);
  }

  onToggleModal() {
    const opts = {
      children: IndicatorsList,
      childrenProps: {
        indicators: this.props.indicatorsFilterList,
        activeIndicators: this.props.indicatorsList.map(ind => ind.id),
        url: this.props.url,
        addIndicator: this.props.addIndicator,
        removeIndicator: this.props.removeIndicator,
        closeModal: modal.toggleModal
      }
    };
    modal.toggleModal(true, opts);
  }

  render() {
    const { className, areas } = this.props;

    const classNames = classnames(
      'c-compare-toolbar',
      { [className]: !!className }
    );

    const addAreaClass = classnames(
      'c-button btn-add-area',
      { '-disabled': Object.keys(areas).length === 3 }
    );
    return (
      <div className={classNames}>
        <button className="c-button btn-add-indicator" onClick={this.onToggleModal}>Add Indicator</button>
        <button className={addAreaClass} onClick={this.onAddArea}>Add Location</button>
      </div>
    );
  }
}

CompareToolbar.propTypes = {
  className: PropTypes.string,
  indicatorsFilterList: PropTypes.object,
  indicatorsList: PropTypes.array,
  areas: PropTypes.object,
  url: PropTypes.object,
  modalOpened: PropTypes.bool,
  // Actions
  addArea: PropTypes.func,
  addIndicator: PropTypes.func,
  removeIndicator: PropTypes.func
};
