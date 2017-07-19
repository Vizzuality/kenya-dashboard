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

    // Bindings
    this.onAddArea = this.onAddArea.bind(this);
    this.onToggleModal = this.onToggleModal.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (!isEqual(this.props.url.query, nextProps.url.query)) {
      this.url = nextProps.url;
    }

    // Update modal content props
    if (this.props.modalOpened && nextProps.modalOpened &&
      !isEqual(this.props.url.query, nextProps.url.query)) {
      const opts = {
        children: IndicatorsList,
        childrenProps: {
          indicators: this.props.indicatorsFilterList,
          activeIndicators: nextProps.indicatorsList.map(ind => ind.id),
          addIndicator: this.props.addIndicator,
          removeIndicator: this.props.removeIndicator,
          url: nextProps.url
        }
      };
      modal.setModalOptions(opts);
    }
  }

  /* Add area */
  onAddArea() {
    Object.keys(this.props.areas).length < 3 &&
      this.props.addArea();
  }

  onToggleModal() {
    const opts = {
      children: IndicatorsList,
      childrenProps: {
        indicators: this.props.indicatorsFilterList,
        activeIndicators: this.props.indicatorsList.map(ind => ind.id),
        addIndicator: this.props.addIndicator,
        removeIndicator: this.props.removeIndicator,
        url: this.props.url
      }
    };
    modal.toggleModal(true, opts);
  }

  render() {
    const { className, areas } = this.props;

    const classNames = classnames(
      'c-compare-toolbar',
      {
        [className]: !!className
      }
    );

    return (
      <div className={classNames}>
        {Object.keys(areas).length < 3 &&
          <button className="btn btn-add-area" onClick={this.onAddArea}>Add Area</button>
        }
        <button className="btn btn-add-indicator" onClick={this.onToggleModal}>Add Indicator</button>
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
