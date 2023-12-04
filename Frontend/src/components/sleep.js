import React from 'react';
import '../App.css';
import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiTitle
  ,EuiImage
} from '@elastic/eui';

export default function Sleep() {
  return (
    <EuiPage>
      <EuiPageBody component="div">
        <EuiPageContent>
          <EuiPageContentBody>
            <EuiTitle>
              <h2>Cette application n'est pas disponible avant 8H et après 20H</h2>
            </EuiTitle>
            <EuiImage
              size="l"
              alt="sleep"
              src="https://images.assetsdelivery.com/compings_v2/rainart123/rainart1231711/rainart123171100303.jpg"
            />
          </EuiPageContentBody>
        </EuiPageContent>
      </EuiPageBody>
    </EuiPage>
  );
}
