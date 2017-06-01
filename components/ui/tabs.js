import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';

// Next components
import Link from 'next/link';

export default class Tabs extends React.Component {

  constructor(props) {
    super(props);

    this.state = {
      selected: props.defaultSelected
    };
  }

  componentWillReceiveProps(nextProps) {
    this.setState({
      selected: nextProps.selected
    });
  }

  render() {
    const { selected } = this.state;
    const { options, href } = this.props;

    return (
      <header className="c-tabs">
        <div className="l-container">
          <div className="row collapse">
            {options.map((option) => {
              const btnClasses = classnames({
                '-active': option.value === selected
              });

              return (
                <div
                  key={option.value}
                  className={`medium-${12 / options.length} columns`}
                >
                  <Link href={{ pathname: href.pathname, query: { ...href.query, tab: option.value } }} as={`${href.as}/${option.value}`}>
                    <a className={`tabs-btn ${btnClasses}`}>
                      {option.label}
                    </a>
                  </Link>
                </div>
              );
            })}
          </div>
        </div>
      </header>
    );
  }
}

Tabs.propTypes = {
  options: PropTypes.array.isRequired,
  href: PropTypes.object.isRequired,
  selected: PropTypes.string.isRequired,
  defaultSelected: PropTypes.string.isRequired
};
