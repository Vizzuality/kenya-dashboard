import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import Switch from 'react-toggle-switch';
import Icon from 'components/ui/icon';

export default class CollapsibleList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hidden: false,
      activeItems: props.activeItems
    };

    // Bindings
    this.onToggleList = this.onToggleList.bind(this);
    this.onSwitchItem = this.onSwitchItem.bind(this);
  }

  onToggleList() {
    this.setState({ hidden: !this.state.hidden });
  }

  onSwitchItem(id) {
    let activeItems = this.state.activeItems.slice();

    if (this.state.activeItems.includes(id)) {
      // Remove item
      activeItems = activeItems.filter(ai => ai !== id);
      this.props.removeItem && this.props.removeItem(id, this.props.url);
    } else {
      // Add item
      activeItems.push(id);
      this.props.addItem && this.props.addItem(id, this.props.url);
    }

    this.setState({ activeItems });
  }

  render() {
    const { className, title, list, collapse } = this.props;
    const classNames = classnames({
      'c-collapsible-list': true,
      [className]: !!className,
      '-hidden': this.state.hidden
    });

    return (
      <div className={classNames}>
        <h1 className="collapsible-title">
          {title}
          {collapse &&
            <button className="btn btn-collapse" onClick={this.onToggleList}>
              <Icon name="icon-arrow-down" className="-smaller" />
            </button>
          }
        </h1>
        <div className="collapsible-list-container">
          <ul className="collapsible-list">
            {list.map((l, i) => (
              <li className="list-item" key={i}>
                <span>{l.name}</span>
                <Switch
                  onClick={() => this.onSwitchItem(l.id)}
                  on={this.state.activeItems.includes(l.id)}
                  className="c-switch"
                />
              </li>
            ))}
          </ul>
        </div>
      </div>
    );
  }
}

CollapsibleList.propTypes = {
  title: PropTypes.string,
  list: PropTypes.array,
  activeItems: PropTypes.array,
  className: PropTypes.string,
  url: PropTypes.object,
  collapse: PropTypes.bool,
  // Actions
  addItem: PropTypes.func,
  removeItem: PropTypes.func
};

CollapsibleList.defaultProps = {
  collapse: true
};
