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

export default class Register extends Component {
  constructor(props) {
    super(props);
    this.state = {
      error: [],
      email: null,
      password: null,
      passwordConfirmation: null,
      city: null,
      address: null,
      emailError: null,
      passwordError: null,
      cityError: null,
      addressError: null,
      showLoader: false,
      succesRegister: false,
      companyName: '',
      file: null,
      fileError: null,
    };
  }

  onInputChange = (e) => {
    this.setState({ [e.target.name]: e.target.value });
  };

  onChangeFile = (file) => {
    this.setState({ file: file });
    console.log(this.state.file);
    console.log(file);
  };

  onEmailClick = (e) => {
    e.preventDefault();
    this.setState({ error: [] });
    this.setState({ emailError: null });
    this.setState({ passwordError: null });
    this.setState({ companyError: null });

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

    if (!this.state.companyName) {
      this.setState({ companyError: 'Company name must be filled' });
      this.setState({ error: ['Company name must be filled'] });
      return;
    }

    this.setState({ companyError: null });

    if (!this.state.city) {
      this.setState({ cityError: 'City must be filled' });
      this.setState({ error: ['City must be filled'] });
      return;
    }

    this.setState({ cityError: null });

    if (!this.state.address) {
      this.setState({ addressError: 'Address must be filled' });
      this.setState({ error: ['Address must be filled'] });
      return;
    }

    this.setState({ addressError: null });

    if (!this.state.file) {
      this.setState({ fileError: 'A file is required' });
      this.setState({ error: ['A file is required'] });
      return;
    }

    this.setState({ fileError: null });

    this.launchRegisterRequest();
  };

  launchRegisterRequest = async () => {
    /* eslint-disable no-console */

    let data = {
      name: this.state.companyName,
      adminEmail: this.state.email,
      adminPassword: this.state.password,
      address: this.state.address,
      city: this.state.city,
    };

    AuthService.registerCompanyWithFile(
      JSON.stringify(data),
      this.state.file[0]
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
    } else {
      return (
        <EuiPage>
          <EuiPageBody>
            <EuiPageContent verticalPosition="center" horizontalPosition="center">
              <EuiPageContentHeader>
                <EuiPageContentHeaderSection>
                  <EuiTitle>
                    <h2>Inscription entité</h2>
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

                    <EuiFormRow
                      label="Entité"
                      isInvalid={this.state.companyError != null}
                      error={this.state.companyError}
                      id="companyId"
                    >
                      <EuiFieldText
                        placeholder="Nom de l'entité"
                        isInvalid={this.state.companyError != null}
                        id="companyFieldId"
                        name="companyName"
                        onChange={(e) => this.onInputChange(e)}
                      />
                    </EuiFormRow>
                    <EuiFormRow
                      label="Ville"
                      isInvalid={this.state.cityError != null}
                      error={this.state.cityError}
                      id="cityId"
                    >
                      <EuiFieldText
                        placeholder="Ville"
                        isInvalid={this.state.cityError != null}
                        id="cityFieldId"
                        name="city"
                        onChange={(e) => this.onInputChange(e)}
                      />
                    </EuiFormRow>
                    <EuiFormRow
                      label="Adresse"
                      isInvalid={this.state.addressError != null}
                      error={this.state.addressError}
                      id="addressId"
                    >
                      <EuiFieldText
                        placeholder="Adresse"
                        isInvalid={this.state.addressError != null}
                        id="addressFieldId"
                        name="address"
                        onChange={(e) => this.onInputChange(e)}
                      />
                    </EuiFormRow>
                    <EuiFormRow
                      label="Fichier utilisateurs"
                      isInvalid={this.state.fileError != null}
                      error={this.state.fileError}
                      id="filepickerId"
                    >
                      <EuiFilePicker
                        id="asdf2"
                        initialPromptText="Select or drag file"
                        onChange={(files) => {
                          this.onChangeFile(files);
                        }}
                        aria-label="Use aria labels when no actual label is in use"
                      />
                    </EuiFormRow>
                    <EuiSpacer />
                    {button}
                    <EuiSpacer />
                    <EuiFlexGroup justifyContent="spaceAround">
                      <EuiFlexItem grow={false}>
                        <EuiLink href="/login">
                          Se connecter
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
