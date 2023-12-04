import React, { Fragment } from 'react';
import '../App.css';
import AuthService from '../services/auth-service';
//import axios from "axios";
import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiHeader,
  EuiHeaderSectionItem,
  EuiHeaderLogo,
  EuiHeaderLinks,
  EuiHeaderLink,

} from '@elastic/eui';

export default function Kpi() {
  const isUserAdmin = JSON.parse(localStorage.getItem('flexGESadmin')) === true;

  /*
  const current_time = new Date();

  if (current_time.getHours() < 8 || current_time.getHours() > 20) {
    window.location.href = '/sleep';
  }
  else */
  if (AuthService.getCurrentUser()) {

    const enterpriseName = localStorage.getItem('flexGESenterprise');
    let urlBi = '';

    switch(enterpriseName) {
      case 'BNP':
        urlBi = 'https://datastudio.google.com/embed/reporting/c1d9b40d-1c68-43d5-8af4-e656cf1215a8/page/cQESC';
        break;
      case 'Thales':
        urlBi = 'https://datastudio.google.com/embed/reporting/0eedb453-433f-477b-8a88-bd1de408bd39/page/cQESC ';
        break;
      case 'Sephora':
        urlBi = 'https://datastudio.google.com/embed/reporting/59b3e0f2-9985-4030-8102-bb1a7e2c8768/page/cQESC ';
        break;
      case 'Google':
          urlBi = 'https://datastudio.google.com/embed/reporting/de843914-b1c9-4877-8d5b-997ef8cdd76d/page/cQESC ';
          break;
      default:
        urlBi = 'https://datastudio.google.com/embed/reporting/59b3e0f2-9985-4030-8102-bb1a7e2c8768/page/cQESC '; 
    }

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
                <iframe style={{width: "100%", height: "1600px"}} src={urlBi} ></iframe>
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
