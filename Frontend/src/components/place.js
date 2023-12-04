import React, { useState, Fragment } from 'react';
import '../App.css';
import AuthService from '../services/auth-service';

import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiFlexGroup,
  EuiTitle,
  EuiHeader,
  EuiHeaderSectionItem,
  EuiHeaderLogo,
  EuiHeaderLinks,
  EuiHeaderLink,
  EuiFlexItem,
  EuiFieldNumber,
  EuiForm,
  EuiFormRow,
  EuiSelect,
  EuiSwitch,
  EuiButton,
} from '@elastic/eui';

export default function Place() {
  const [isSwitchChecked, setIsSwitchChecked] = useState(false);
  const onSwitchChange = () => {
    setIsSwitchChecked(!isSwitchChecked);
  };

  const [numberPeople, setNumberPeople] = useState('');

  const onChangeNumericField = (e) => {
    const sanitizedValue = parseInt(e.target.value, 10);
    setNumberPeople(isNaN(sanitizedValue) ? '' : sanitizedValue);
  };

  if (AuthService.getCurrentUser()) {
    const isUserAdmin = JSON.parse(localStorage.getItem('flexGESadmin')) === true;

    return (
      <Fragment>
        <EuiHeader>
          <EuiHeaderSectionItem border="right">
            <EuiHeaderLogo href="/home">Flex GES</EuiHeaderLogo>
          </EuiHeaderSectionItem>
          <EuiHeaderSectionItem>
            <EuiHeaderLinks aria-label="App navigation links example">
              {isUserAdmin ? (
                <EuiHeaderLink iconType="gear" href="/manage">
                  Administration
                </EuiHeaderLink>
              ) : null}

              <EuiHeaderLink iconType="user" href="/profile">
                Profile
              </EuiHeaderLink>
              <EuiHeaderLink iconType="help" href="/help">
                Help
              </EuiHeaderLink>
              <EuiHeaderLink
                iconType="exit"
                onClick={() => AuthService.logout()}
              >
                Log out
              </EuiHeaderLink>
            </EuiHeaderLinks>
          </EuiHeaderSectionItem>
        </EuiHeader>
        <EuiPage>
          <EuiPageBody component="div">
            <EuiPageContent>
              <EuiPageContentBody>
                <EuiFlexGroup justifyContent="spaceAround">
                  <EuiFlexItem grow={false}>
                    <EuiForm component="form">
                      <EuiFormRow
                        label="Choix de l'entité"
                        helpText="Choisissez l'entité dans laquelle vous désirez être placé"
                      >
                        <EuiSelect
                          hasNoInitialSelection
                          options={[
                            { value: 'option_one', text: 'Option one' },
                            { value: 'option_two', text: 'Option two' },
                            { value: 'option_three', text: 'Option three' },
                          ]}
                        />
                      </EuiFormRow>
                      <EuiFormRow
                        label="Choix du site"
                        helpText="Choisissez le site sur lequel vous désirez être placé"
                      >
                        <EuiSelect
                          hasNoInitialSelection
                          options={[
                            { value: 'option_one', text: 'Option one' },
                            { value: 'option_two', text: 'Option two' },
                            { value: 'option_three', text: 'Option three' },
                          ]}
                        />
                      </EuiFormRow>
                      <EuiButton type="submit" fill href="/results">
                        Trouver !
                      </EuiButton>
                    </EuiForm>
                  </EuiFlexItem>
                </EuiFlexGroup>
                <EuiFlexGroup>
                  <EuiFlexItem grow={false}>
                    <EuiTitle size="s">
                      <h3>Historique</h3>
                    </EuiTitle>
                  </EuiFlexItem>
                </EuiFlexGroup>
              </EuiPageContentBody>
            </EuiPageContent>
          </EuiPageBody>
        </EuiPage>
      </Fragment>
    );
  } else {
    window.location.href = '/login';
  }
}
