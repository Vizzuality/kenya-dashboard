import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';
import lowerCase from 'lodash/lowerCase';
import { encode } from 'utils/general';

// Components
import { Link } from 'routes';
import Icon from 'components/ui/icon';

// Constants
import { TOPICS_ICONS_SRC, TOPICS_BACKGROUNDS_SRC } from 'constants/filters';


export default class CardImage extends React.Component {
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
    const url = this.getDashboardTopicFilterUrl();
    const backgroundUrl = `url('/static/images/topics/${TOPICS_BACKGROUNDS_SRC[typeClass]}')`;
    const iconName = TOPICS_ICONS_SRC[typeClass] || 'plus';

    return (
      <div className={classNames} style={{ backgroundImage: backgroundUrl }}>
        <Link route={url}>
          <a className="link">
            <div className="type-container">
              <Icon name={`icon-${iconName}`} className="-bigger" />
            </div>
            <h1 className="type-title">{info.name}</h1>
          </a>
        </Link>
      </div>
    );
  }
}

CardImage.propTypes = {
  className: PropTypes.string,
  info: PropTypes.object
};
