import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import Icon from 'components/ui/icon';
import SelectList from 'components/ui/select-list';


export default class SelectSlider extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      next: props.list.list && props.list.list.length,
      specificList: this.props.list || [],
      breadcrumbs: []
    };

    // Bindings
    this.onToggle = this.onToggle.bind(this);
    this.setValue = this.setValue.bind(this);
  }

  /**
    UI events
  */
  onToggle(direction, value) {
    const { breadcrumbs } = this.state;

    if (direction === 'next') {
      const newBreadcrumbs = breadcrumbs.slice();
      newBreadcrumbs.push(value);
      const specificList = this.getSpecificList(direction, value, newBreadcrumbs);
      this.setState({ breadcrumbs: newBreadcrumbs, next: true, specificList });
    } else {
      const newBreadcrumbs = breadcrumbs.slice(0, breadcrumbs.length - 1);
      const specificList = this.getSpecificList(direction, value, newBreadcrumbs);
      this.setState({ breadcrumbs: newBreadcrumbs, next: newBreadcrumbs.length > 0, specificList });
    }
  }

  getSpecificList(direction, value, breadcrumbs) {
    let newSpecificList = this.state.specificList;

    if (direction === 'next') {
      const wholeItem = this.state.specificList.find(item => item.id === value);
      if (wholeItem) newSpecificList = wholeItem.list;
    } else {
      let newList = this.props.list.slice();

      breadcrumbs.forEach((val) => {
        const wholeItem = newList.find(item => item.id === val);
        if (wholeItem && wholeItem.list) newList = wholeItem.list;
      });
      newSpecificList = newList;
    }

    return newSpecificList;
  }

  /* Dropdown content */
  getPrincipalListContent() {
    const classNames = classnames(
      'slider-item',
      { '-hidden-left': this.state.next }
    );

    return (
      <SelectList
        name="regions"
        type="slider"
        className={classNames}
        list={this.props.list}
        selected={this.props.selected}
        setValue={this.setValue}
        onToggle={this.onToggle}
      />
    );
  }

  getSpecificListContent() {
    const classNames = classnames(
      'slider-item',
      { '-hidden-right': !this.state.next }
    );

    return (
      <div className={classNames}>
        <button className="btn-back" onClick={() => this.onToggle('back')}>
          <Icon name="icon-arrow-left" className="-smaller" />
          Back
        </button>
        <SelectList
          name="regions"
          type="slider"
          list={this.state.specificList}
          selected={this.props.selected}
          setValue={this.setValue}
          onToggle={this.onToggle}
          search
        />
      </div>
    );
  }

  /* Set value and close dropdown */
  setValue(value, type) {
    this.props.setValue(value, type);
    this.props.onToggleDropdown();
  }

  render() {
    const { className } = this.props;
    const classNames = classnames(
      'c-select-slider',
      {
        [className]: !!className
      }
    );
    const principalList = this.getPrincipalListContent();
    const specificList = this.getSpecificListContent();
    console.log(this.props.list);
    console.log(this.props.selected);

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
  selected: PropTypes.array,
  // Actions
  setValue: PropTypes.func,
  onToggleDropdown: PropTypes.func
};
