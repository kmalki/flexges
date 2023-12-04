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
  EuiLink,
  EuiFlexGroup,
  EuiFlexItem,
} from '@elastic/eui';

export default class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: [],
      login: null,
      password: null,
      loginError: null,
      passwordError: null,
      showLoader: false,
      succesLogin: false,
    };
  }

  onInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onLoginClick = (e) => {
    e.preventDefault();
    this.setState({ error: [] });
    this.setState({ loginError: null });
    this.setState({ passwordError: null });

    if (!this.state.login) {
      this.setState({ loginError: 'Login must be filled' });
      this.setState({ error: ['Login must be filled'] });
      return;
    }

    this.setState({ loginError: null });

    if (!this.state.password) {
      this.setState({ passwordError: "Password can't be empty" });
      this.setState({ error: ["Password can't be empty"] });
      return;
    }

    /*if (this.state.password.length < 8) {
      this.setState({ passwordError: 'Password length must be greater or equal than 8' })
      this.setState({ error: ['Password length must be greater or equal than 8'] })
      return;
    }*/

    this.setState({ passwordError: null });

    this.launchLoginRequest();
  };

  launchLoginRequest = async () => {
    /* eslint-disable no-console */

    const { login, password } = this.state;

    AuthService.login(login, password).then(
      () => {
        this.setState({ succesLogin: true });
        setTimeout(() => {
          window.location.href = '/home';
        }, 2000);
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
        onClick={this.onLoginClick.bind(this)}
        style={{
          margin: '0 auto',
          display: 'block',
        }}
      >
        Login
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
                    <h2>Connexion</h2>
                  </EuiTitle>
                </EuiPageContentHeaderSection>
              </EuiPageContentHeader>
              <EuiPageContentBody>
                {this.state.succesLogin && (
                  <Fragment>
                    <EuiCallOut
                      style={{ width: '400px' }}
                      title="Successfully logged in !"
                      color="success"
                      iconType="user"
                    >
                      <p>
                        Connexion réussie !
                      </p>
                    </EuiCallOut>
                    <EuiSpacer />
                  </Fragment>
                )}
                <Fragment>
                  <EuiForm
                    isInvalid={
                      this.state.error.length > 0 ||
                      this.state.loginError != null ||
                      this.state.passwordError != null
                    }
                    error={this.state.error}
                  >
                    <EuiFormRow
                      label="Login"
                      isInvalid={this.state.loginError != null}
                      error={this.state.loginError}
                      id="test"
                    >
                      <EuiFieldText
                        placeholder="Login"
                        isInvalid={this.state.loginError != null}
                        id="login"
                        name="login"
                        onChange={(e) => this.onInputChange(e)}
                      />
                    </EuiFormRow>

                    <EuiFormRow
                      label="Mot de passe"
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

                    <EuiSpacer />
                    {button}
                    <EuiSpacer />
                    <EuiFlexGroup justifyContent="spaceAround">
                      <EuiFlexItem grow={false}>
                        <EuiLink href="/register">
                          Inscrire une entité
                        </EuiLink>
                      </EuiFlexItem>
                      <EuiFlexItem grow={false}>
                        <EuiLink href="/registeruser">
                          Inscrire un compte utilisateur
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
