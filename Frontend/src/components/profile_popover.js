import React, { Fragment, useState } from 'react';
import AuthService from '../services/auth-service';
import {
  EuiPopover,
  EuiFlexGroup,
  EuiFlexItem,
  EuiLink,
  EuiSpacer,
  EuiTitle,
  EuiAvatar,
} from '@elastic/eui';

export default function ProfilePopover() {
  const [isPopoverOpen, setIsPopoverOpen] = useState(false);

  const onButtonClick = () =>
    setIsPopoverOpen((isPopoverOpen) => !isPopoverOpen);
  const closePopover = () => setIsPopoverOpen(false);

  const button = (
    <Fragment>
      <EuiTitle>
        <h5>
          <EuiAvatar
            style={{ marginRight: '10px', marginBottom: '5px' }}
            color="#BD10E0"
            size="l"
            name={AuthService.getCurrentUser()}
          />
          Hey,{' '}
          <EuiLink
            onClick={onButtonClick}
          >
            {AuthService.getCurrentUser()}
          </EuiLink>
        </h5>
      </EuiTitle>
      <EuiSpacer size="s" />
    </Fragment>
  );

  return (
    <EuiPopover
      button={button}
      isOpen={isPopoverOpen}
      closePopover={closePopover}
    >
      <EuiFlexGroup justifyContent="spaceAround" direction="column">
        <EuiFlexItem grow={false}>
          <EuiLink
            style={{ textAlign: 'center' }}
            onClick={() => (window.location.href = '/profile')}
          >
            {' '}
            Profile{' '}
          </EuiLink>
        </EuiFlexItem>
        <EuiFlexItem grow={false}>
          <EuiLink
            style={{ textAlign: 'center' }}
            onClick={() => AuthService.logout()}
          >
            {' '}
            Logout{' '}
          </EuiLink>
        </EuiFlexItem>
      </EuiFlexGroup>
    </EuiPopover>
  );
}
