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
import { TOPICS_ICONS_SRC } from 'constants/filters';


export default class CardImage extends React.Component {
  getDashboardTopicFilterUrl() {
    const filters = { topics: [this.props.info.id] };
    return `/dashboard?filters=${encode(filters)}`;
  }

  render() {
    const { className, info } = this.props;
    const typeClass = lowerCase(info.name.split(' ').join('_'));
    const classNames = classnames(
      `c-card-image -${typeClass}`,
      { [className]: !!className }
    );
    const url = this.getDashboardTopicFilterUrl();
    const iconName = TOPICS_ICONS_SRC[info.name] || 'plus';

    return (
      <div className={classNames}>
        <Link route={url}>
          <a className="link">
            <Icon name={`icon-${iconName}`} className="-medium" />
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
