import React, { Component, Fragment } from 'react';
import AuthService from '../services/auth-service';

import {
  EuiButton,
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiPageContentHeader,
  EuiPageContentHeaderSection,
  EuiTitle,
  EuiForm,
  EuiFormRow,
  EuiFieldPassword,
  EuiFieldText,
  EuiSpacer,
  EuiCallOut,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLink,
  EuiFilePicker,
} from '@elastic/eui';

// set up cookies

export default class RegisterUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: [],
      email: null,
      password: null,
      passwordConfirmation: null,
    };
  }

  onInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onEmailClick = (e) => {
    e.preventDefault();
    this.setState({ error: [] });
    this.setState({ emailError: null });
    this.setState({ passwordError: null });

    if (!this.state.email) {
      this.setState({ emailError: 'Email must be filled' });
      this.setState({ error: ['Email must be filled'] });
      return;
    }

    this.setState({ emailError: null });

    if (!this.state.password) {
      this.setState({ passwordError: "Password can't be empty" });
      this.setState({ error: ["Password can't be empty"] });
      return;
    }

    if (this.state.password !== this.state.passwordConfirmation) {
      this.setState({ passwordError: 'Password are different' });
      this.setState({ error: ['Password are different'] });
      return;
    }

    if (this.state.password.length < 8) {
      this.setState({
        passwordError: 'Password length must be greater or equal than 8',
      });
      this.setState({
        error: ['Password length must be greater or equal than 8'],
      });
      return;
    }

    this.launchRegisterRequest();
  };

  launchRegisterRequest = async () => {
    /* eslint-disable no-console */

    let data = {
      email: this.state.email,
      password: this.state.password,
      enterprise: null,
      enterpriseId: null,
      admin: null
    };

    AuthService.registerUser(
      data
    ).then(
      (response) => {
        this.setState({
          message: response.data.message,
          succesRegister: true,
        });
        setTimeout(() => {
          window.location.href = '/login';
        }, 3000);
      },
      (error) => {
        const resMessage =
          (error.response &&
            error.response.data &&
            error.response.data.message) ||
          error.message ||
          error.toString();

        this.setState({
          error: resMessage,
        });
      }
    );
  };

  render() {
    const button = (
      <EuiButton
        fill
        onClick={this.onEmailClick.bind(this)}
        style={{
          margin: '0 auto',
          display: 'block',
        }}
      >
        S'inscrire !
      </EuiButton>
    );

    if (AuthService.getCurrentUser()) {
      window.location.href = '/home';
      return null;
    }
    else {

      return (
        <EuiPage>
          <EuiPageBody>
            <EuiPageContent verticalPosition="center" horizontalPosition="center">
              <EuiPageContentHeader>
                <EuiPageContentHeaderSection>
                  <EuiTitle>
                    <h2>Inscription utilisateur</h2>
                  </EuiTitle>
                </EuiPageContentHeaderSection>
              </EuiPageContentHeader>
              <EuiPageContentBody>
                {this.state.succesRegister && (
                  <Fragment>
                    <EuiCallOut
                      style={{ width: '400px' }}
                      title="Inscription réussie !"
                      color="success"
                      iconType="user"
                    >
                      <p>
                        Inscription réussie, redirection vers la page de login
                      </p>
                    </EuiCallOut>
                    <EuiSpacer />
                  </Fragment>
                )}
                <Fragment>
                  <EuiForm
                    isInvalid={
                      this.state.error.length > 0 ||
                      this.state.emailError != null ||
                      this.state.passwordError != null ||
                      this.state.ageError != null
                    }
                    error={this.state.error}
                  >
                    <EuiFormRow
                      label="Email"
                      isInvalid={this.state.emailError != null}
                      error={this.state.emailError}
                      id="test"
                    >
                      <EuiFieldText
                        placeholder="Email"
                        isInvalid={this.state.emailError != null}
                        id="email"
                        name="email"
                        onChange={(e) => this.onInputChange(e)}
                      />
                    </EuiFormRow>

                    <EuiFormRow
                      label="Mot de passe"
                      helpText="Password length must be greater or equal than 8, use at least one numeric character too !"
                      isInvalid={this.state.passwordError != null}
                      error={this.state.passwordError}
                    >
                      <EuiFieldPassword
                        placeholder="Mot de passe"
                        isInvalid={this.state.passwordError != null}
                        id="password"
                        name="password"
                        onChange={(e) => this.onInputChange(e)}
                      />
                    </EuiFormRow>

                    <EuiFormRow
                      label="Mot de passe confirmation"
                      isInvalid={this.state.passwordError != null}
                      error={this.state.passwordError}
                    >
                      <EuiFieldPassword
                        placeholder="Mot de passe confirmation"
                        isInvalid={this.state.passwordError != null}
                        id="passwordConfirmation"
                        name="passwordConfirmation"
                        onChange={(e) => this.onInputChange(e)}
                      />
                    </EuiFormRow>
                    <EuiSpacer />
                    {button}
                    <EuiSpacer />
                    <EuiFlexGroup justifyContent="spaceAround">
                      <EuiFlexItem grow={false}>
                        <EuiLink href="/login">
                          Vous avez déjà un compte ?
                        </EuiLink>
                      </EuiFlexItem>
                    </EuiFlexGroup>
                  </EuiForm>
                </Fragment>
              </EuiPageContentBody>
            </EuiPageContent>
          </EuiPageBody>
        </EuiPage>
      );
    }
  }
}
