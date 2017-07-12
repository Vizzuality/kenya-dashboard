import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Components

export default class Accordion extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      hidden: []
    };

    // Bindings
    this.onToggle = this.onToggle.bind(this);
  }

  onToggle(e, id) {
    let newHidden = this.state.hidden;

    if (this.state.hidden.includes(id)) {
      newHidden = newHidden.filter(hiddenId => hiddenId !== id);
    } else {
      newHidden.push(id);
    }

    this.setState({ hidden: newHidden });
  }


  render() {
    const { className, list } = this.props;
    const { hidden } = this.state;

    const classNames = classnames({
      'c-accordion': true,
      [className]: !!className
    });

    return (
      <div className={classNames}>
        {
          list.map((l, i) => (
            <div className={`accordion-item ${hidden.includes(l.id) ? '-hidden' : ''}`} id={l.id} key={i}>
              <div>
                <button onClick={e => this.onToggle(e, l.id)}>X</button>
              </div>
              <div>
                {l.el}
              </div>
            </div>
          ))
        }
      </div>
    );
  }
}

Accordion.propTypes = {
  className: PropTypes.string,
  list: PropTypes.array
};

Accordion.defaultProps = {
};
