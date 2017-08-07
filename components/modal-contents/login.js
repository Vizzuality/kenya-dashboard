import React from 'react';
import PropTypes from 'prop-types';

// Libraries
import classnames from 'classnames';

// Components
import Field from 'components/form/field';
import Input from 'components/form/input';
import Spinner from 'components/ui/spinner';

// Constants
const FORM_ELEMENTS = {
  elements: {
  },
  validate() {
    const elements = this.elements;
    Object.keys(elements).forEach((k) => {
      elements[k].validate();
    });
  },
  isValid() {
    const elements = this.elements;
    const valid = Object.keys(elements)
      .map(k => elements[k].isValid())
      .filter(v => v !== null)
      .every(element => element);

    return valid;
  }
};


export default class Login extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        email: '',
        password: ''
      },
      submitting: false
    };

    // Bindings
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.user.logged || (!this.props.user.logged && !nextProps.user.logged)) &&
      this.state.submitting) {
      this.setState({ submitting: false });
      this.props.closeModal();
    }
  }

  /**
   * UI EVENTS
   * - onChange
   * - onSubmit
  */
  onChange(value) {
    const form = Object.assign({}, this.state.form, value);
    this.setState({ form });
  }

  onSubmit(e) {
    e && e.preventDefault();

    // Validate the form
    FORM_ELEMENTS.validate(this.state.form);

    // Set a timeout due to the setState function of react
    setTimeout(() => {
      // Validate all the inputs on the current step
      const valid = FORM_ELEMENTS.isValid(this.state.form);

      if (valid) {
        // Start the submitting
        this.setState({ submitting: true });
        this.props.login(this.state.form);
      }
    }, 0);
  }

  render() {
    const { className } = this.props;
    const { submitting } = this.state;
    const classNames = classnames({
      'c-indicators-list': true,
      [className]: !!className
    });

    return (
      <div className={classNames}>
        <Spinner isLoading={this.state.submitting} />
        <header className="list-header">
          <h1 className="title">Sign in to Kenya Dashboard</h1>
        </header>
        <section>
          <form className="c-form" onSubmit={this.onSubmit} noValidate>
            {/* EMAIL */}
            <Field
              ref={(c) => { if (c) FORM_ELEMENTS.elements.email = c; }}
              onChange={value => this.onChange({ email: value })}
              validations={['required', 'email']}
              className="-fluid"
              properties={{
                name: 'email',
                label: 'Email',
                type: 'email',
                required: true,
                default: this.state.form.email
              }}
            >
              {Input}
            </Field>

            {/* PASSWORD */}
            <Field
              ref={(c) => { if (c) FORM_ELEMENTS.elements.password = c; }}
              onChange={value => this.onChange({ password: value })}
              validations={['required']}
              className="-fluid"
              properties={{
                name: 'password',
                label: 'Password',
                type: 'password',
                required: true,
                default: this.state.form.password
              }}
            >
              {Input}
            </Field>

            <footer className="">
              <button
                type="submit"
                name="commit"
                disabled={submitting}
                className="c-button -secondary -expanded"
              >
                Log in
              </button>
            </footer>
          </form>
        </section>
      </div>
    );
  }
}

Login.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object,
  // Actions
  login: PropTypes.func,
  closeModal: PropTypes.func
};
