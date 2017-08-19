import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
// import Icon from 'components/ui/icon';
import DateRangePicker from 'react-bootstrap-daterangepicker';


export default class ItemTools extends React.Component {
  constructor(props) {
    super(props);

    // Bindings
    this.onApply = this.onApply.bind(this);
  }

  onApply(e, picker) {
    const sd = picker.startDate.toDate();
    const ed = picker.endDate.toDate();
    const start = `${sd.getFullYear()}-${sd.getMonth() + 1}-${sd.getDate()}`;
    const end = `${ed.getFullYear()}-${ed.getMonth() + 1}-${ed.getDate()}`;
    this.props.onChange(start, end);
  }

  render() {
    const { className } = this.props;
    const classNames = classnames(
      'c-pickdate',
      { [className]: !!className }
    );

    return (
      <div className={classNames}>
        {/* <div>
          <span>Date</span>
          <Icon name="icon-arrow-down" />
        </div> */}
        <DateRangePicker
          startDate={'1/1/2014'}
          endDate={'3/1/2014'}
          opens="center"
          onApply={this.onApply}
        >
          <div>Date</div>
        </DateRangePicker>
      </div>
    );
  }
}

ItemTools.propTypes = {
  className: PropTypes.string,
  // Actions
  onChange: PropTypes.func
};
