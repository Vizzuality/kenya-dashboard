import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';
import lowerCase from 'lodash/lowerCase';
import { encode } from 'utils/general';

// Components
import { Router } from 'routes';
import Icon from 'components/ui/icon';

// Constants
import { TOPICS_ICONS_CIRCLE_SRC, TOPICS_BACKGROUNDS_SRC } from 'constants/filters';

let GA;
if (typeof window !== 'undefined') {
  /* eslint-disable global-require */
  GA = require('react-ga');
  /* eslint-enable global-require */
}

export default class CardImage extends React.Component {
  constructor(props) {
    super(props);

    // Bindings
    this.onClick = this.onClick.bind(this);
  }

  onClick() {
    const url = this.getDashboardTopicFilterUrl();
    GA.event({
      page: '/',
      category: '/',
      action: 'Thematic Dashboard',
      label: this.props.info.name
    });

    Router.pushRoute(url);
  }

  getDashboardTopicFilterUrl() {
    const filters = { topics: [this.props.info.id] };
    return `/dashboard?filters=${encode(filters)}`;
  }

  render() {
    const { className, info } = this.props;
    const typeClass = lowerCase(info.name).split(' ').join('_');
    const classNames = classnames(
      `c-card-image -${typeClass}`,
      { [className]: !!className }
    );
    const backgroundUrl = `url('/static/images/topics/${TOPICS_BACKGROUNDS_SRC[typeClass]}')`;
    const iconName = TOPICS_ICONS_CIRCLE_SRC[typeClass] || 'plus';

    return (
      <div className={classNames} style={{ backgroundImage: backgroundUrl }}>
        <button className="link" onClick={this.onClick}>
          <div className="type-container">
            <Icon name={`icon-${iconName}`} className="-bigger" />
          </div>
          <h1 className="type-title">{info.name}</h1>
        </button>
      </div>
    );
  }
}

CardImage.propTypes = {
  className: PropTypes.string,
  info: PropTypes.object
};
