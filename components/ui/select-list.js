/* eslint jsx-a11y/no-static-element-interactions: 0 */
import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';
import throttle from 'lodash/throttle';
import Fuse from 'fuse.js';

// Constants
import { SELECT_SEARCH_OPTIONS } from 'constants/general';

// Components
import Icon from 'components/ui/icon';
import Checkbox from 'components/form/checkbox';

let GA;
if (typeof window !== 'undefined') {
  /* eslint-disable global-require */
  GA = require('react-ga');
  /* eslint-enable global-require */
}


export default class SelectList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      filteredList: props.list
    };

    // Bindings
    this.onSearch = this.onSearch.bind(this);
    this.onClick = this.onClick.bind(this);
  }

  /**
    Lifecycle
  */
  componentWillReceiveProps(nextProps) {
    this.setState({ filteredList: nextProps.list });
  }

  /**
    UI events
  */
  onSearch(e) {
    const value = e.currentTarget.value;
    const fuse = new Fuse(this.props.list, SELECT_SEARCH_OPTIONS);
    const filteredList = value !== '' ? fuse.search(value) : this.props.list;
    this.setState({ filteredList });

    if (value.length > 2) {
      GA.event({
        category: 'Dashboard',
        action: 'Location search',
        label: value
      });
    }
  }

  onClick(e) {
    const value = e.currentTarget.getAttribute('data-value');
    const isParent = e.currentTarget.getAttribute('data-is-parent');

    // If can be selected
    if (!isParent) {
      const totalValue = this.getValues(value);
      this.props.setValue(totalValue, this.props.name);
      !this.type && this.props.onToggleDropdown && this.props.onToggleDropdown();
    // If is parent in slider
    } else {
      this.props.onToggle('next', value);
    }
  }

  getValues(value) {
    let totalValue = value;

    if (this.props.multi) {
      const index = this.props.selected.indexOf(value);
      totalValue = this.props.selected.slice();

      // Add or remove from already selected
      if (index !== -1) {
        totalValue.splice(index, 1);
      } else totalValue.push(value);
    }
    return totalValue;
  }

  render() {
    const { className, type, search, searchPlaceholder, selected } = this.props;
    const { filteredList } = this.state;
    const classNames = classnames(
      'c-select-list',
      { [className]: !!className }
    );

    return (
      <div className={classNames}>
        <div className="select-list-container">
          {/* Search */}
          {search && filteredList && filteredList.length > 0 &&
            <div className="search-container">
              <input className="search-box" type="text" onKeyUp={this.onSearch} placeholder={searchPlaceholder} />
              <Icon name="icon-search" className="" />
            </div>
          }

          {/* List */}
          <ul className="list">
            {filteredList.map((l, i) => {
              const isSelected = selected && selected.includes(`${l.id}` || l.id);
              const itemClassNames = classnames(
                'item',
                { '-selected': type !== 'checkbox' && isSelected }
              );

              return (
                <li
                  key={i}
                  className={itemClassNames}
                  data-value={l.id}
                  data-is-parent={l.list && l.list.length > 0}
                  onClick={this.onClick}
                >
                  {/* Checkbox */}
                  {type === 'checkbox' && <Checkbox checked={isSelected} />}

                  {/* Name */}
                  <span>{l.name}</span>

                  {/* Icon when it has its own list */}
                  {l.list && l.list.length > 0 && <Icon name="icon-arrow-right" className="" />}
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    );
  }
}

SelectList.propTypes = {
  className: PropTypes.string,
  type: PropTypes.string,
  name: PropTypes.string,
  list: PropTypes.array.isRequired,
  selected: PropTypes.array,
  search: PropTypes.bool,
  multi: PropTypes.bool,
  searchPlaceholder: PropTypes.string,
  // Actions
  setValue: PropTypes.func,
  onToggle: PropTypes.func,
  onToggleDropdown: PropTypes.func
};

SelectList.defaultProps = {
  searchPlaceholder: 'Search'
};
