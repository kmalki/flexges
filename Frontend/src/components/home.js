import React, { Fragment } from 'react';
import '../App.css';
import AuthService from '../services/auth-service';
//import axios from "axios";
import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiButton,
  EuiHeader,
  EuiHeaderSectionItem,
  EuiHeaderLogo,
  EuiHeaderLinks,
  EuiHeaderLink,
  EuiFlexGroup,
  EuiFlexItem,
  EuiImage,
} from '@elastic/eui';

export default function Home() {
  const isUserAdmin = JSON.parse(localStorage.getItem('flexGESadmin')) === true;

  /*
  const current_time = new Date();

  if (current_time.getHours() < 8 || current_time.getHours() > 20) {
    window.location.href = '/sleep';
  }
  else */
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
          <EuiPageBody component="div">
            <EuiPageContent>
              <EuiPageContentBody>
                <EuiFlexGroup className="center-flexgroup" direction="column" justifyContent="spaceAround">
                  <EuiFlexItem grow={false}>
                    <EuiImage
                      alt="imageHome"
                      size="l"
                      url="https://i.ibb.co/TwhLYdc/unknown.png"
                    />
                  </EuiFlexItem>
                  <EuiFlexItem grow={false}>
                      <EuiButton fill href="/results">
                        Se positionner !
                      </EuiButton>
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
