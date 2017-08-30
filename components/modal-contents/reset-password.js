import React from 'react';
import PropTypes from 'prop-types';

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


export default class ResetPassword extends React.Component {
  constructor(props) {
    super(props);

    this.state = {
      form: {
        email: props.email || ''
      },
      submitting: false,
      message: ''
    };

    // Bindings
    this.onReset = this.onReset.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.user.reset || (!this.props.user.reset && !nextProps.user.reset)) &&
      this.state.submitting) {
      this.setState({ submitting: false });
    }
  }

  /**
   * UI EVENTS
   * - onChange
   * - onReset
  */

  onChange(value) {
    const form = Object.assign({}, this.state.form, value);
    this.setState({ form });
  }

  onReset(e) {
    const { form } = this.state;
    e && e.preventDefault();

    // Validate the form
    FORM_ELEMENTS.validate(form);

    // Set a timeout due to the setState function of react
    setTimeout(() => {
      // Validate all the inputs on the current step
      const valid = FORM_ELEMENTS.isValid(form);

      if (valid) {
        // Start the submitting
        this.setState({ submitting: true });
        this.props.resetPassword(form.email);
      }
    }, 0);
  }

  render() {
    const { submitting, form } = this.state;

    return (
      <div className="login-container">
        <Spinner isLoading={submitting} />
        <header className="login-header">
          <h1 className="title">Forgot passwrod?</h1>
          <p>Enter the email address associated with your account,
            and we’ll email you a link to reset your password.</p>
        </header>
        <section className="form-container">
          <form className="c-form" onSubmit={this.onReset} noValidate>
            {/* EMAIL */}
            <Field
              ref={(c) => { if (c) FORM_ELEMENTS.elements.email = c; }}
              onChange={value => this.onChange({ email: value })}
              validations={['required', 'email']}
              className="-fluid"
              properties={{
                name: 'email',
                placeholder: 'Email',
                type: 'email',
                required: true,
                default: form.email
              }}
            >
              {Input}
            </Field>

            <div className="login-options">
              <div/>
              <button
                type="button"
                onClick={this.props.onBackToLogin}
                className="btn-reset-password"
              >
                Go back
              </button>
            </div>

            <footer className="login-footer">
              <button
                type="submit"
                name="commit"
                disabled={submitting}
                className="c-button -expanded btn-reset"
              >
                Reset Password
              </button>
            </footer>
          </form>
        </section>
      </div>
    );
  }
}

ResetPassword.propTypes = {
  className: PropTypes.string,
  user: PropTypes.object,
  email: PropTypes.string,
  // Actions
  resetPassword: PropTypes.func,
  onBackToLogin: PropTypes.func
};
