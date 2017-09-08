import React from 'react';
import PropTypes from 'prop-types';

// Redux
import withRedux from 'next-redux-wrapper';
import { initStore } from 'store';

// modules
import { setUser, resetPassword } from 'modules/user';

// Libraries
import classnames from 'classnames';

// Components
import { Router } from 'routes';
import Layout from 'components/layout/layout';
import Field from 'components/form/field';
import Input from 'components/form/input';
import Message from 'components/ui/message';
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


class ResetPassword extends React.PureComponent {
  static async getInitialProps({ asPath, pathname, query, req, store, isServer }) {
    const url = { asPath, pathname, query };
    const { user } = isServer ? req : store.getState();
    if (isServer) store.dispatch(setUser(user));
    return { user, url, isServer };
  }

  constructor(props) {
    super(props);

    this.state = {
      form: {
        newPassword: '',
        repeatNewPassword: ''
      },
      submitting: false,
      message: null,
      messageType: ''
    };

    // Bindings
    this.onSubmit = this.onSubmit.bind(this);
    this.onBackToLogin = this.onBackToLogin.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if ((nextProps.user.auth_token || (!this.props.user.auth_token && !nextProps.user.auth_token))
      && this.state.submitting) {
      this.setState({ submitting: false });
    }

    if (nextProps.user.auth_token) {
      Router.pushRoute('login');
    }

    if (nextProps.user.reset && !nextProps.user.reset.error) {
      this.setState({
        message: 'The password was succesfully changed',
        messageType: '-success'
      });

      Router.pushRoute('login');
    } else if (nextProps.user.reset && nextProps.user.reset.error) {
      this.setState({
        message: 'Link expired',
        messageType: '-fail'
      });
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
      const { form } = this.state;
      // Validate all the inputs on the current step
      const valid = FORM_ELEMENTS.isValid(form);

      if (valid && form.newPassword === form.repeatNewPassword && form.newPassword.length >= 6) {
        const { newPassword } = form;
        const { token } = this.props.url.query;

        // Start the submitting
        this.setState({ submitting: true, message: null, messageType: '' });

        this.props.resetPassword({ newPassword, token });
      } else if (valid && form.newPassword !== form.repeatNewPassword) {
        this.setState({ message: 'Repeated new password does not match', messageType: '-fail' });
      } else if (valid && form.newPassword.length < 6) {
        this.setState({ message: 'New password is too short (minimum is 6 characters)', messageType: '-fail' });
      }
    }, 0);
  }

  onBackToLogin() {
    this.setState({ reset: false });
  }

  render() {
    const { url, user, className } = this.props;
    if (!user) return null;
    const { submitting, form } = this.state;
    const classNames = classnames(
      'c-login',
      { [className]: !!className }
    );

    return (
      <Layout
        title="Agency"
        description="Agency description..."
        url={url}
        className={user ? 'p-dashboard -logged' : 'p-about'}
      >
        <div className={classNames}>
          <div className="login-container">
            <Spinner isLoading={this.state.submitting} />
            <header className="login-header">
              <h1 className="title">Reset password</h1>
            </header>

            {this.state.message &&
              <Message message={this.state.message} className={this.state.messageType} />
            }

            <section className="form-container">
              <form className="c-form" onSubmit={this.onSubmit} noValidate>
                {/* NEW PASSWORD */}
                <Field
                  ref={(c) => { if (c) FORM_ELEMENTS.elements.newPassword = c; }}
                  onChange={value => this.onChange({ newPassword: value })}
                  validations={['required']}
                  className="-fluid"
                  properties={{
                    name: 'newPassword',
                    placeholder: 'New password',
                    type: 'password',
                    required: true,
                    default: ''
                  }}
                >
                  {Input}
                </Field>

                {/* REPEAT NEW PASSWORD */}
                <Field
                  ref={(c) => { if (c) FORM_ELEMENTS.elements.repeatNewPassword = c; }}
                  onChange={value => this.onChange({ repeatNewPassword: value })}
                  validations={['required']}
                  className="-fluid"
                  properties={{
                    name: 'repeatNewPassword',
                    placeholder: 'Repeat new password',
                    type: 'password',
                    required: true,
                    default: ''
                  }}
                >
                  {Input}
                </Field>
                <footer className="login-footer">
                  <button
                    type="submit"
                    name="commit"
                    disabled={submitting}
                    className="c-button -expanded btn-login"
                  >
                    Reset Password
                  </button>
                </footer>
              </form>
            </section>
          </div>
        </div>
      </Layout>
    );
  }
}

ResetPassword.propTypes = {
  url: PropTypes.object,
  user: PropTypes.object,
  className: PropTypes.object,
  isServer: PropTypes.bool,
  // Actions
  resetPassword: PropTypes.func
};

const mapStateToProps = state => ({
  user: state.user
});

const mapDispatchToProps = dispatch => ({
  resetPassword(user) { dispatch(resetPassword(user)); }
});

export default withRedux(initStore, mapStateToProps, mapDispatchToProps)(ResetPassword);
