import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';
import lowerCase from 'lodash/lowerCase';

// Components
import Icon from 'components/ui/icon';
import Tooltip from 'react-tooltip';

// Constants
import { TOPICS_ICONS_SRC } from 'constants/filters';


export default function TopicIcon({ topic, className }) {
  const classNames = classnames(
    'c-topic-icon',
    { [className]: !!className }
  );
  const typeClass = lowerCase(topic).split(' ').join('_');


  return (
    <div className={classNames}>
      <span data-tip data-for="tooltip-topic" className="topic">
        <Icon name={`icon-${TOPICS_ICONS_SRC[typeClass]}`} className="-normal" />
      </span>

      {/* Info */}
      <Tooltip
        className="c-tooltip"
        id="tooltip-topic"
        place="top"
        effect="solid"
        event="mouseenter"
        eventOff="mouseleave"
      >
        {topic}
      </Tooltip>
    </div>
  );
}

TopicIcon.propTypes = {
  className: PropTypes.string,
  topic: PropTypes.string
};
