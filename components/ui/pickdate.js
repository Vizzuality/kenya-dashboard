import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import DateRangePicker from 'react-bootstrap-daterangepicker';
import Icon from 'components/ui/icon';


export default class ItemTools extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      open: false
    };

    // Bindings
    this.onToggle = this.onToggle.bind(this);
    this.onApply = this.onApply.bind(this);
    this.onCancel = this.onCancel.bind(this);
  }

  onApply(e, picker) {
    const sd = picker.startDate.toDate();
    const ed = picker.endDate.toDate();
    const start = { year: sd.getFullYear(), month: sd.getMonth() + 1, day: sd.getDate() };
    const end = { year: ed.getFullYear(), month: ed.getMonth() + 1, day: ed.getDate() };
    this.props.onChange(start, end);
  }

  onCancel() {
    this.props.onChange(null, null);
  }

  onToggle() {
    this.setState({ open: !this.state.open });
  }

  render() {
    const { className, dates } = this.props;
    const classNames = classnames(
      'c-pickdate',
      { [className]: !!className }
    );
    const currentDate = new Date();
    const currentEndDate = `${currentDate.getMonth()}/${currentDate.getDate()}/${currentDate.getFullYear()}`;
    const start = dates ? `${dates.start.month}/${dates.start.day}/${dates.start.year}` : '01/01/1900';
    const end = dates ? `${dates.end.month}/${dates.end.day}/${dates.end.year}` : currentEndDate;

    return (
      <div className={classNames}>
        <DateRangePicker
          startDate={start}
          endDate={end}
          opens="center"
          onApply={this.onApply}
          onCancel={this.onCancel}
          onShow={this.onToggle}
          onHide={this.onToggle}
        >
          <div>
            Date
            <Icon name={`icon-arrow-${this.state.open ? 'up' : 'down'}`} />
          </div>
        </DateRangePicker>
      </div>
    );
  }
}

ItemTools.propTypes = {
  className: PropTypes.string,
  dates: PropTypes.object,
  // Actions
  onChange: PropTypes.func
};
