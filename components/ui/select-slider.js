import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';
import fetch from 'isomorphic-fetch';

// Constants
import { BASIC_QUERY_HEADER } from 'constants/query';

// Components
import Icon from 'components/ui/icon';
import SelectList from 'components/ui/select-list';


export default class SelectSlider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      next: false,
      specificList: [],
      loading: false
    };

    // Bindings
    this.onToggle = this.onToggle.bind(this);
    this.getSpecificList = this.getSpecificList.bind(this);
  }

  /**
    UI events
  */
  onToggle() {
    this.setState({ next: !this.state.next });
  }

  /* Tooltip content */
  getListContent() {
    const classNames = classnames(
      'slider-item',
      { '-hidden-left': this.state.next }
    );

    return (
      <SelectList
        className={classNames}
        list={this.props.list}
        type="slider"
        onGetSpecificList={this.getSpecificList}
        onToggle={this.onToggle}
      />
    );
  }

  getSpecificList(value) {
    debugger;
    this.setState({ loading: true });

    fetch(`${process.env.KENYA_API}/${value}?page[size]=999999999`, BASIC_QUERY_HEADER)
      .then((response) => {
        if (response.ok) return response.json();
        throw new Error(response.statusText);
      })
      .then((data) => {
        debugger;
      });
  }

  getSpecificListContent() {
    const classNames = classnames(
      'slider-item',
      { '-hidden-right': !this.state.next }
    );

    return (
      <div className={classNames}>
        <button onClick={this.onToggle}>
          <Icon name="icon-arrow-left" className="-small" />
          Back
        </button>
        <SelectList
          list={this.props.list}
          setValue={this.props.setValue}
          type="areas"
          search
        />
      </div>
    );
  }

  render() {
    const { className } = this.props;
    const classNames = classnames(
      'c-select-slider',
      {
        [className]: !!className
      }
    );
    const principalList = this.getListContent();
    const specificList = this.getSpecificListContent();

    return (
      <div className={classNames}>
        {principalList}
        {specificList}
      </div>
    );
  }
}

SelectSlider.propTypes = {
  className: PropTypes.string,
  list: PropTypes.array,
  // Actions
  setValue: PropTypes.func
};
