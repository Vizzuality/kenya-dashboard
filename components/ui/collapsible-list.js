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
      hidden: props.hidden || false,
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
    const { className, title, list, collapse, item, arrowPosition, hidden } = this.props;
    const classNames = classnames({
      'c-collapsible-list': true,
      [className]: !!className,
      '-hidden': this.state.hidden
    });
    const arrowIconName = hidden ? 'icon-arrow-up' : 'icon-arrow-down';

    return (
      <div className={classNames}>
        <h1 className="collapsible-title">
          {collapse && arrowPosition === 'left' &&
            <button className="btn btn-collapse -left" onClick={this.onToggleList}>
              <Icon name={arrowIconName} className="-smaller" />
            </button>
          }
          {title}
          {collapse && arrowPosition === 'right' &&
            <button className="btn btn-collapse -right" onClick={this.onToggleList}>
              <Icon name={arrowIconName} className="-smaller" />
            </button>
          }
        </h1>
        <div className="collapsible-list-container">
          {item &&
            <div className="collapsible-list">
              {item}
            </div>
          }
          {list &&
            <ul className="collapsible-list">
              {list.map((l, i) => (
                <li className="list-item" key={i}>
                  <div className="child-container">
                    <span>{l.name}</span>
                  </div>
                  <div className="child-container">
                    <Switch
                      onClick={() => this.onSwitchItem(l.id)}
                      on={this.state.activeItems.includes(l.id)}
                      className="c-switch"
                    />
                  </div>
                </li>
              ))}
            </ul>
          }
        </div>
      </div>
    );
  }
}

CollapsibleList.propTypes = {
  title: PropTypes.any.isRequired,
  list: PropTypes.array,
  item: PropTypes.any,
  arrowPosition: PropTypes.string,
  hidden: PropTypes.bool,
  activeItems: PropTypes.array,
  className: PropTypes.string,
  url: PropTypes.object,
  collapse: PropTypes.bool,
  // Actions
  addItem: PropTypes.func,
  removeItem: PropTypes.func
};

CollapsibleList.defaultProps = {
  collapse: true,
  arrowPosition: 'right'
};
