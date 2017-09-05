import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import Icon from 'components/ui/icon';
import SelectList from 'components/ui/select-list';


export default class SelectAccordion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      openItem: '',
      openList: []
    };

    // Bindings
    this.onToggleList = this.onToggleList.bind(this);
    this.setValue = this.setValue.bind(this);
    this.onToggleItem = this.onToggleItem.bind(this);
  }

  /**
    UI events
  */
  onToggleList(id) {
    const { list } = this.props;
    const { openItem } = this.state;

    if (openItem === id) {
      this.setState({ openItem: '', openList: [] });
    } else {
      const selectedItem = list.find(item => item.id === id);
      const selectedList = selectedItem && selectedItem.list || [];
      this.setState({ openItem: id, openList: selectedList });
    }
  }

  onToggleItem() {
    this.props.toggleItem(this.props.id);
  }

  /* Set value */
  setValue(value) {
    this.props.setValue(value, this.props.id);
  }

  render() {
    const { className, list, selected, active } = this.props;
    const { openList, openItem } = this.state;
    const classNames = classnames(
      'c-select-accordion',
      {
        [className]: !!className,
        '-active': active
      }
    );

    return (
      <div className={classNames}>
        <header className="accordion-header">
          <button type="button" className="title-container" onClick={this.onToggleItem}>
            <h1 className="title">{this.props.id}</h1>
            {active ?
              <Icon name="icon-arrow-up" /> :
              <Icon name="icon-arrow-down" />
            }
          </button>
          <div className="accordion-tools">
            <button>
              <Icon name="icon-remove" />
            </button>
          </div>
        </header>
        <div className="accordion-content-container">
          <div className="accordion-content">
            {list.map(l => (
              <div className="item" key={l.id}>
                <header className="item-header">
                  <button type="button" className="" onClick={() => this.onToggleList(l.id)}>
                    <h1 className="title">{l.name}</h1>
                    <Icon name="icon-arrow-down" />
                  </button>
                </header>
                <SelectList
                  name="regions"
                  className="-static"
                  type="accordion"
                  list={l.id === openItem ? openList : []}
                  selected={selected}
                  setValue={this.setValue}
                  search
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }
}

SelectAccordion.propTypes = {
  className: PropTypes.string,
  id: PropTypes.string,
  list: PropTypes.array,
  active: PropTypes.bool,
  selected: PropTypes.array,
  // Actions
  toggleItem: PropTypes.func,
  setValue: PropTypes.func
};
