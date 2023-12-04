import React, { Fragment } from 'react';
import AuthService from '../services/auth-service';

import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiTitle,
  EuiFlexGroup,
  EuiFlexItem,
  EuiSpacer,
  EuiAvatar,
  EuiLink,
  EuiHorizontalRule,
  EuiFlexGrid,
  EuiPanel,
  EuiHeader,
  EuiHeaderSectionItem,
  EuiHeaderLogo,
  EuiHeaderLinks,
  EuiHeaderLink,
  EuiText
} from '@elastic/eui';

export default function Profile() {
  const ITEM_STYLE = { width: '300px' };
  const isUserAdmin = JSON.parse(localStorage.getItem('flexGESadmin')) === true;

  if (AuthService.getCurrentUser()) {
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
          <EuiPageBody>
            <EuiPageContent>
              <EuiPageContentBody>
                <EuiFlexGroup>
                  <EuiFlexItem>
                    <EuiTitle size="m">
                      <h3>Profil</h3>
                    </EuiTitle>
                    <EuiSpacer />
                      <EuiText size="m">
                        <h4>
                          <EuiAvatar
                            style={{ marginRight: '10px', marginBottom: '5px' }}
                            color="#BD10E0"
                            size="xl"
                            name={AuthService.getCurrentUser()}
                          />{' '}
                          {AuthService.getCurrentUser()}
                        </h4>
                      </EuiText>
                    <EuiHorizontalRule />
                    <EuiPanel paddingSize="m">
                      <EuiFlexGrid columns={2}>
                        <EuiFlexItem style={ITEM_STYLE}>
                          <div>
                            <b>Email</b>
                          </div>
                        </EuiFlexItem>
                        <EuiFlexItem style={ITEM_STYLE}>
                          <div>{AuthService.getCurrentUser()}</div>
                        </EuiFlexItem>
                        <EuiFlexItem style={ITEM_STYLE}>
                          <div>
                            <b>Entreprise</b>
                          </div>
                        </EuiFlexItem>
                        <EuiFlexItem style={ITEM_STYLE}>
                          <div>{localStorage.getItem('flexGESenterprise')}</div>
                        </EuiFlexItem>
                      </EuiFlexGrid>
                    </EuiPanel>
                  </EuiFlexItem>
                </EuiFlexGroup>
                <EuiSpacer />
                <EuiLink href="/home">Home</EuiLink>{' '}
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
