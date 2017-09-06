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
      const selectedList = selectedItem && selectedItem.list ? selectedItem.list : [];
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
    const {
      className,
      list,
      selected,
      active,
      label,
      addNew,
      id,
      remove,
      listType,
      name,
      multi,
      cascade
    } = this.props;
    const { openList, openItem } = this.state;
    const classNames = classnames(
      'c-select-accordion',
      {
        [className]: !!className,
        '-active': active
      }
    );
    const arrowIcon = active ?
      <Icon name="icon-arrow-up" className="-smaller" /> :
      <Icon name="icon-arrow-down" className="-smaller" />;

    return (
      <div className={classNames}>
        <header className="accordion-header">
          <button type="button" className="title-container" onClick={this.onToggleItem}>
            <h1 className="title">{label}</h1>
            {!addNew && arrowIcon}
          </button>
          <div className="accordion-tools">
            {remove &&
              <button onClick={() => this.props.onRemove(id)}>
                <Icon name="icon-remove" className="-small" />
              </button>
            }
          </div>
        </header>
        <div className="accordion-content-container">
          <div className="accordion-content">
            {cascade ?
              list.map(l => (
                <div className={`content-item ${l.id === openItem ? '-active' : ''}`} key={l.id}>
                  <header className="item-header">
                    <button type="button" className="" onClick={() => this.onToggleList(l.id)}>
                      <h1 className="title">{l.name}</h1>
                      <Icon name="icon-arrow-down" className="-smaller" />
                    </button>
                  </header>
                  <SelectList
                    name={name}
                    className="-static"
                    type={listType}
                    list={l.id === openItem ? openList : []}
                    selected={selected}
                    setValue={this.setValue}
                    search
                    multi={multi}
                  />
                </div>
              )) :
              <SelectList
                name={name}
                className="-static"
                type={listType}
                list={list}
                selected={selected}
                setValue={this.setValue}
                multi={multi}
              />
            }
          </div>
        </div>
      </div>
    );
  }
}

SelectAccordion.propTypes = {
  className: PropTypes.string,
  name: PropTypes.string,
  listType: PropTypes.string,
  id: PropTypes.string,
  label: PropTypes.any,
  multi: PropTypes.bool,
  list: PropTypes.array,
  active: PropTypes.bool,
  selected: PropTypes.array,
  addNew: PropTypes.bool,
  remove: PropTypes.bool,
  // Actions
  toggleItem: PropTypes.func,
  setValue: PropTypes.func,
  onRemove: PropTypes.func
};

SelectAccordion.defaultProps = {
  addNew: false,
  remove: true,
  listType: 'accordion',
  multi: false,
  cascade: true
};
