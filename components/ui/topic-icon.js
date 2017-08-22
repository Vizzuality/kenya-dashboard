import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';
import lowerCase from 'lodash/lowerCase';

// Components
import Icon from 'components/ui/icon';

// Constants
import { TOPICS_ICONS_SRC } from 'constants/filters';


export default function TopicIcon({ topic, className, tooltip }) {
  const classNames = classnames(
    'c-topic-icon',
    { [className]: !!className }
  );
  const typeClass = lowerCase(topic).split(' ').join('_');


  return (
    <div className={classNames}>
      <span className="topic">
        <Icon name={`icon-${TOPICS_ICONS_SRC[typeClass]}`} clasName="" />
        {/* {getTopicIcon(topic, '-small')} */}
      </span>
      {tooltip && <div className="c-tooltip">{topic}</div>}
    </div>
  );
}

TopicIcon.propTypes = {
  className: PropTypes.string,
  topic: PropTypes.string,
  tooltip: PropTypes.bool
};
