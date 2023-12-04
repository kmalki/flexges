import React, { useState, Fragment } from 'react';
import '../App.css';
import AuthService from '../services/auth-service';

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
  EuiInMemoryTable,
  EuiButton,
  EuiFlexItem,
  EuiFlexGroup,
  EuiSpacer,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiButtonEmpty,
  EuiConfirmModal,
  EuiGlobalToastList,
} from '@elastic/eui';

export default function ManageSites() {
  const listSites = [
    { name: 'Site A' },
    { name: 'Site B' },
    { name: 'Site C' },
    { name: 'Site D' },
    { name: 'Site E' },
  ];

  const [nameSiteEdit, setNameSiteEdit] = useState('');
  const [nameSite, setNameSite] = useState('');
  const [newNameSite, setNewNameSite] = useState('');
  const [site, setSite] = useState(null);

  const editSite = (site) => {
    setIsError(false);
    showModal();
    setNameSiteEdit(site.name);
    setNameSite('');
    console.log('Edit :' + site);
  };

  const deleteSite = (site) => {
    setSite(site);
    console.log('Delete :' + site.name);
    showDestroyModal();
  };

  let actions = [
    {
      name: 'Editer',
      isPrimary: true,
      description: 'Modifier le nom de ce site',
      icon: 'pencil',
      type: 'icon',
      onClick: (item) => {
        editSite(item);
      },
      'data-test-subj': 'action-edit',
    },
    {
      name: 'Supprimer',
      description: 'Supprimer ce site',
      icon: 'trash',
      color: 'danger',
      type: 'icon',
      onClick: (item) => {
        deleteSite(item);
      },
      isPrimary: true,
      'data-test-subj': 'action-delete',
    },
  ];

  const showModal = () => setIsModalVisible(true);

  const [isModalVisible, setIsModalVisible] = useState(false);

  const showModal2 = () => setIsModalVisible2(true);

  const [isModalVisible2, setIsModalVisible2] = useState(false);

  const [isError, setIsError] = useState(false);

  function checkEditSite(value) {
    if (!/^[a-zA-Z0-9 ]*$/.test(value)) {
      return false;
    } else {
      return true;
    }
  }

  const closeModalWithoutChangementAccepted = () => {
    setIsModalVisible(false);
    let elementsEuiOverlay = document.getElementsByClassName('euiOverlayMask');
    if (elementsEuiOverlay[0]) elementsEuiOverlay[0].remove();
    setNameSite('');
  };

  const closeModalWithChangementAccepted = () => {
    if (!checkEditSite(nameSite)) {
      setIsError(true);
      return;
    }
    setIsModalVisible(false);
    let elementsEuiOverlay = document.getElementsByClassName('euiOverlayMask');
    if (elementsEuiOverlay[0]) elementsEuiOverlay[0].remove();
    console.log(nameSite);
  };

  const closeModalWithoutChangementAccepted2 = () => {
    setIsModalVisible2(false);
    let elementsEuiOverlay = document.getElementsByClassName('euiOverlayMask');
    if (elementsEuiOverlay[0]) elementsEuiOverlay[0].remove();
  };

  const closeModalWithChangementAccepted2 = () => {
    if (!checkEditSite(newNameSite)) {
      setIsError(true);
      return;
    }
    setIsModalVisible2(false);
    let elementsEuiOverlay = document.getElementsByClassName('euiOverlayMask');
    if (elementsEuiOverlay[0]) elementsEuiOverlay[0].remove();
    console.log(newNameSite);
  };

  const search = {
    box: {
      incremental: true,
    },
  };

  const getRowProps = (item) => {
    return {
      onClick: () => console.log(`${item.name}`),
    };
  };

  const columns = [
    {
      field: 'name',
      name: 'Site',
      sortable: true,
      mobileOptions: {
        render: (item) => <span>{item.name} </span>,
        header: false,
        truncateText: false,
        enlarge: true,
        fullWidth: true,
      },
    },
    {
      name: 'Actions',
      actions,
    },
  ];

  const onChangeNameSite = (e) => {
    setNameSite(e.target.value);
  };

  const onChangeNewNameSite = (e) => {
    setNewNameSite(e.target.value);
  };

  const errorMessage =
    'Le nom du site ne peut être vide ou contenir des caractères spéciaux';

  const formSample = (
    <EuiForm isInvalid={isError} error={[errorMessage]}>
      <EuiFormRow label="Nom du site">
        <EuiFieldText
          placeholder={nameSiteEdit}
          value={nameSite}
          onChange={(e) => onChangeNameSite(e)}
          aria-label="Use aria labels when no actual label is in use"
        />
      </EuiFormRow>
    </EuiForm>
  );

  const formSample2 = (
    <EuiForm isInvalid={isError} error={[errorMessage]}>
      <EuiFormRow label="Nom du site">
        <EuiFieldText
          placeholder={'Nom du site'}
          value={newNameSite}
          onChange={(e) => onChangeNewNameSite(e)}
          aria-label="Use aria labels when no actual label is in use"
        />
      </EuiFormRow>
    </EuiForm>
  );

  let modal;

  if (isModalVisible) {
    modal = (
      <EuiOverlayMask>
        <EuiModal onClose={closeModalWithoutChangementAccepted}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>Modifier le nom du site</EuiModalHeaderTitle>
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

  let modal2;

  if (isModalVisible2) {
    modal2 = (
      <EuiOverlayMask>
        <EuiModal onClose={closeModalWithoutChangementAccepted2}>
          <EuiModalHeader>
            <EuiModalHeaderTitle>
              Entrer le nom du nouveau site
            </EuiModalHeaderTitle>
          </EuiModalHeader>
          <EuiModalBody>{formSample2}</EuiModalBody>
          <EuiModalFooter>
            <EuiButtonEmpty onClick={closeModalWithoutChangementAccepted2}>
              Cancel
            </EuiButtonEmpty>
            <EuiButton onClick={closeModalWithChangementAccepted2} fill>
              Valider
            </EuiButton>
          </EuiModalFooter>
        </EuiModal>
      </EuiOverlayMask>
    );
  }

  const addNewSite = () => {
    setNewNameSite('');
    setIsError(false);
    showModal2();
  };

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
    console.log(site.name + ' deleted');
  };

  const showDestroyModal = () => setIsDestroyModalVisible(true);

  let destroyModal;

  if (isDestroyModalVisible) {
    destroyModal = (
      <EuiOverlayMask>
        <EuiConfirmModal
          title="Attention"
          onCancel={closeDestroyModal}
          onConfirm={closeDestroyModalWithConfirm}
          cancelButtonText="Non, je ne veux pas"
          confirmButtonText="Oui !"
          buttonColor="danger"
          defaultFocusedButton="confirm"
        >
          <p>Etes vous sûr de vouloir supprimer ce site {site.name} ?</p>
        </EuiConfirmModal>
      </EuiOverlayMask>
    );
  }

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

  /*function requestDeleteSite(site) {
    axios.post(API_URL_PRODUCTS + 'updateProduct', {
      "quantity": 1,
      "code": item.puk.code
    }, config).then(() => {
      getProducts().then((response) => {
        setItems(response.data);
        setToasts(toasts.concat(toastsList[0]));
      });
    }, (error) => {
      console.log(error);
      setToasts(toasts.concat(toastsList[6]));
    });
  }*/

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
          <EuiGlobalToastList
            toasts={toasts}
            dismissToast={removeToast}
            toastLifeTimeMs={6000}
          />
          <EuiPageBody component="div">
            <EuiPageContent>
              {modal}
              {modal2}
              {destroyModal}
              <EuiPageContentBody>
                <EuiInMemoryTable
                  className="custom-padding-bottom"
                  items={listSites}
                  columns={columns}
                  rowProps={getRowProps}
                  search={search}
                  sorting={true}
                />
                <EuiSpacer />
                <EuiFlexGroup justifyContent="spaceAround">
                  <EuiFlexItem grow={false}>
                    <EuiButton onClick={addNewSite} iconType="plusInCircle">
                      Ajouter un nouveau site
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
