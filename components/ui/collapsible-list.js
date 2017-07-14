import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

export default class CollapsibleList extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hidden: false
    };

    // Bindings
    this.onToggleList = this.onToggleList.bind(this);
  }

  onToggleList() {
    this.setState({ hidden: !this.state.hidden });
  }

  render() {
    const { className, title, list } = this.props;
    const classNames = classnames({
      'c-collapsible-list': true,
      [className]: !!className,
      '-hidden': this.state.hidden
    });

    return (
      <div className={classNames}>
        <h1 className="collapsible-title">
          <button className="btn-collapse" onClick={this.onToggleList}>V</button>
          {title}
        </h1>
        <div className="collapsible-list-container">
          <ul className="collapsible-list">
            {list.map((l, i) => (
              <li className="list-item" key={i}>
                {l.name}
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
  className: PropTypes.string
};
