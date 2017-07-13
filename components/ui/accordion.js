import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';


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
    } else if (newHidden.length + 1 < this.props.maxItems) {
      newHidden.push(id);
    }

    this.setState({ hidden: newHidden });
  }

  getList(list) {
    const { hidden } = this.state;

    return list.map((l, i) => (
      <div className={`accordion-item ${hidden.includes(l.id) ? '-hidden' : ''}`} id={l.id} key={i}>
        <div>
          <button onClick={e => this.onToggle(e, l.id)}>X</button>
        </div>
        <div>
          {l.el}
        </div>
      </div>
    ));
  }

  render() {
    const { className, top, middle, bottom } = this.props;

    const classNames = classnames({
      'c-accordion': true,
      [className]: !!className
    });

    return (
      <div className={classNames}>
        {top &&
          <div className="accordion-section -top">
            {this.getList(top)}
          </div>
        }
        {middle &&
          <div className="accordion-section -middle">
            {middle}
          </div>
        }
        {bottom &&
          <div className="accordion-section -bottom">
            {this.getList(bottom)}
          </div>
        }
      </div>
    );
  }
}

Accordion.propTypes = {
  className: PropTypes.string,
  top: PropTypes.array,
  middle: PropTypes.array,
  bottom: PropTypes.array,
  maxItems: PropTypes.number
};

Accordion.defaultProps = {
  maxItems: 3
};
