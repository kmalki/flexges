import React, { useState, useEffect, Fragment } from 'react';
import '../App.css';
import AuthService from '../services/auth-service';
import axios from 'axios';
import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiFlexGroup,
  EuiPanel,
  EuiTitle,
  EuiHeader,
  EuiHeaderSectionItem,
  EuiHeaderLogo,
  EuiHeaderLinks,
  EuiHeaderLink,
  EuiFlexItem,
  EuiButton,
  EuiFieldSearch,
  EuiSpacer,
  EuiOverlayMask,
  EuiConfirmModal,
  EuiGlobalToastList,
  EuiForm,
  EuiFormRow,
  EuiFieldText,
  EuiFieldPassword,
  EuiModal,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiModalBody,
  EuiModalFooter,
  EuiButtonEmpty,
  EuiSwitch,
} from '@elastic/eui';

export default function ManageUsers() {
  const [isClearable, setIsClearable] = useState(true);
  const [value, setValue] = useState('');
  const [filteredUsers, setFilteredUsers] = useState([]);

  function reloadUsers() {
    axios
      .post('http://localhost:8080/enterprise/getEmployees', 
        localStorage.getItem('flexGESenterpriseId'), 
        {
            headers: { 
              'Accept': 'application/json',
              'Content-Type': 'application/json'
            }
        }
      )
      .then(
        (response) => {
          console.log(response)
          setFilteredUsers(
            response.data.filter((user) =>
              user.email.toLowerCase().includes(value.toLowerCase())
            )
          )
        },
        (error) => {
          console.log(error);
          setToasts(toasts.concat(toastsList[1]));
        }
      );
  }

  const onChange = (e) => {
    setValue(e.target.value);
  };

  useEffect(() => {
    reloadUsers();
  }, [value]);

  const [isDestroyModalVisible, setIsDestroyModalVisible] = useState(false);

  const closeDestroyModal = () => {
    setIsDestroyModalVisible(false);
    let elementsEuiOverlay = document.getElementsByClassName('euiOverlayMask');
    if (elementsEuiOverlay[0]) elementsEuiOverlay[0].remove();
  };

  const closeDestroyModalWithConfirm = () => {
    setIsDestroyModalVisible(false);
    let elementsEuiOverlay = document.getElementsByClassName('euiOverlayMask');
    if (elementsEuiOverlay[0]) elementsEuiOverlay[0].remove();
    kickEmployee(user);
  };

  const showDestroyModal = () => setIsDestroyModalVisible(true);
  const [user, setUser] = useState(null);

  let destroyModal;

  if (isDestroyModalVisible) {
    destroyModal = (
      <EuiOverlayMask>
        <EuiConfirmModal
          title="Attention"
          onCancel={closeDestroyModal}
          onConfirm={closeDestroyModalWithConfirm(user)}
          cancelButtonText="Non, je ne veux pas"
          confirmButtonText="Oui !"
          buttonColor="danger"
          defaultFocusedButton="confirm"
        >
          <p>
            Etes vous sûr de vouloir supprimer cette utilisateur {user.email} ?
          </p>
        </EuiConfirmModal>
      </EuiOverlayMask>
    );
  }

  function checkUsername(value) {
    return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value);
  }

  const [newUsername, setNewUsername] = useState('');
  const [newUserPassword, setNewUserPassword] = useState('');
  const [newUseradmin, setNewUseradmin] = useState(false);

  const closeModalWithoutChangementAccepted = () => {
    setIsModalVisible(false);
    let elementsEuiOverlay = document.getElementsByClassName('euiOverlayMask');
    if (elementsEuiOverlay[0]) elementsEuiOverlay[0].remove();
    setNewUsername('');
    setNewUserPassword('');
  };

  const closeModalWithChangementAccepted = () => {
    if (!checkUsername(newUsername)) {
      setIsError(true);
      return;
    }

    if (!newUsername || newUsername.length === 0) {
      setIsError(true);
      return;
    }

    if (!newUserPassword || newUserPassword.length === 0) {
      setIsError(true);
      return;
    }

    setIsModalVisible(false);
    let elementsEuiOverlay = document.getElementsByClassName('euiOverlayMask');
    if (elementsEuiOverlay[0]) elementsEuiOverlay[0].remove();
    setNewUsername('');
    setNewUserPassword('');
    setNewUseradmin(false);

    axios
      .post('http://localhost:8080/enterprise/addEmployees', [
        {
          email: newUsername,
          password: newUserPassword,
          enterprise: localStorage.getItem('flexGESenterprise'),
          enterpriseId: localStorage.getItem('flexGESenterpriseId'),
          admin: newUseradmin
        },
      ])
      .then(
        (response) => {
          console.log(response);
          reloadUsers();
          setToasts(toasts.concat(toastsList[0]));
        },
        (error) => {
          console.log(error);
          setToasts(toasts.concat(toastsList[1]));
        }
      );
  };

  const errorMessage =
    "L'email doit avoir le bon format. Le mot de passe ne peut être vide, comme le champs entreprise.";

  const [isError, setIsError] = useState(false);

  const onChangeNewUsername = (e) => {
    setNewUsername(e.target.value);
  };

  const onChangeNewUserPassword = (e) => {
    setNewUserPassword(e.target.value);
  };

  const onChangeadmin = (e) => {
    setNewUseradmin(e.target.checked);
  };

  const formSample = (
    <EuiForm isInvalid={isError} error={[errorMessage]}>
      <EuiFormRow label="Email">
        <EuiFieldText
          placeholder={'Email'}
          value={newUsername}
          onChange={(e) => onChangeNewUsername(e)}
          aria-label="Use aria labels when no actual label is in use"
        />
      </EuiFormRow>

      <EuiFormRow label="Mot de passe">
        <EuiFieldPassword
          placeholder={'Password'}
          value={newUserPassword}
          onChange={(e) => onChangeNewUserPassword(e)}
          aria-label="Use aria labels when no actual label is in use"
        />
      </EuiFormRow>
      <EuiFormRow label="Admin">
        <EuiSwitch
          label="Donne les pouvoirs admin"
          checked={newUseradmin}
          onChange={(e) => onChangeadmin(e)}
        />
      </EuiFormRow>
    </EuiForm>
  );

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal = () => setIsModalVisible(true);

  let modal;

  if (isModalVisible) {
    modal = (
      <EuiOverlayMask>
        <EuiModal onClose={closeModalWithoutChangementAccepted}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>Créer une utilisateur</EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>{formSample}</EuiModalBody>
          <EuiModalFooter>
            <EuiButtonEmpty onClick={closeModalWithoutChangementAccepted}>
              Cancel
            </EuiButtonEmpty>
            <EuiButton onClick={closeModalWithChangementAccepted} fill>
              Valider
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      </EuiOverlayMask>
    );
  }

  const deleteUser = (user) => {
    setUser(user);
    showDestroyModal(user);
    console.log('Delete :' + user.email);
  };

  const toastsList = [
    {
      id: '0',
      title: 'Succès',
      color: 'success',
      text: (<p>Opération réussie !</p>),
    },
    {
      id: '1',
      title: 'Erreur',
      color: 'danger',
      iconType: 'help',
      text: (
        <p>
          Une erreur s'est produite vérifier votre connexion ou l'état du serveur (voir la console pour plus de
          détails)
        </p>
      )
    }
  ];

  const [toasts, setToasts] = useState([]);

  const removeToast = (removedToast) => {
    setToasts(toasts.filter((toast) => toast.id !== removedToast.id));
  };

  const createUser = () => {
    //setNameNewRoom('');
    //setCapacityNewRoom('');
    setIsError(false);
    showModal();
  };

  function giveAdminPower(user) {
    axios
      .post('http://localhost:8080/enterprise/updateEmployees', [
        {
          email: user.email,
          password: user.password,
          enterprise: user.enterprise,
          admin: true,
          enterpriseId: user.enterpriseId
        },
      ])
      .then(
        (response) => {
          console.log(response);
          reloadUsers();
          setToasts(toasts.concat(toastsList[0]));
        },
        (error) => {
          console.log(error);
          setToasts(toasts.concat(toastsList[1]));
        }
      );
  }

  function removeAdminPower(user) {
    axios
      .post('http://localhost:8080/enterprise/updateEmployees', [
        {
          email: user.email,
          password: user.password,
          enterprise: user.enterprise,
          admin: false,
          enterpriseId: user.enterpriseId
        },
      ])
      .then(
        (response) => {
          console.log(response);
          reloadUsers();
          setToasts(toasts.concat(toastsList[0]));
        },
        (error) => {
          console.log(error);
          setToasts(toasts.concat(toastsList[1]));
        }
      );
  }

  function kickEmployee(user) {
    axios
      .post('http://localhost:8080/enterprise/kickEmployees', [
        {
          email: user.email,
          enterprise: user.enterprise,
          enterpriseId: user.enterpriseId
        },
      ])
      .then(
        (response) => {
          console.log(response);
          reloadUsers();
          setToasts(toasts.concat(toastsList[0]));
        },
        (error) => {
          console.log(error);
          setToasts(toasts.concat(toastsList[1]));
        }
      );
  }

  if (AuthService.getCurrentUser()) {
    const isUserAdmin = JSON.parse(localStorage.getItem('flexGESadmin')) === true;
    return (
      <Fragment>
        {destroyModal}
        {modal}
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
          <EuiGlobalToastList
            toasts={toasts}
            dismissToast={removeToast}
            toastLifeTimeMs={6000}
          />
          <EuiPageBody component="div">
            <EuiPageContent>
              <EuiPageContentBody>
                <EuiFieldSearch
                  placeholder="Search"
                  value={value}
                  onChange={(e) => onChange(e)}
                  isClearable={isClearable}
                  aria-label="Use aria labels when no actual label is in use"
                />
                <EuiSpacer />
                <EuiFlexGroup wrap>
                  {filteredUsers.map((user) => (
                    <EuiFlexItem key={user.email} grow={true}>
                      <EuiPanel paddingSize="m" grow={true}>
                        <div>
                          <EuiFlexGroup>
                            <EuiFlexItem>
                              <div>
                                <EuiTitle size="xs">
                                  <h4>{user.email}</h4>
                                </EuiTitle>
                              </div>
                            </EuiFlexItem>
                            <EuiFlexItem>
                              {user.admin ? (
                                <EuiButton
                                  color="warning"
                                  iconSide="right"
                                  iconType="arrowRight"
                                  size="s"
                                  fill
                                  onClick={() => removeAdminPower(user)}
                                >
                                  Enlever pouvoir admin
                                </EuiButton>
                              ) : (
                                <EuiButton
                                  color="secondary"
                                  iconSide="right"
                                  iconType="arrowRight"
                                  size="s"
                                  fill
                                  onClick={() => giveAdminPower(user)}
                                >
                                  Donner pouvoir admin
                                </EuiButton>
                              )}
                            </EuiFlexItem>
                            <EuiFlexItem>
                              <EuiButton
                                color="danger"
                                iconSide="right"
                                iconType="arrowRight"
                                size="s"
                                fill
                                onClick={() => deleteUser(user)}
                              >
                                Supprimer
                              </EuiButton>
                            </EuiFlexItem>
                          </EuiFlexGroup>
                        </div>
                      </EuiPanel>
                    </EuiFlexItem>
                  ))}
                </EuiFlexGroup>
                <EuiFlexGroup justifyContent="spaceAround">
                  <EuiFlexItem grow={false}>
                    <EuiButton onClick={createUser} iconType="plusInCircle">
                      Ajouter un nouvel utilisateur
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
