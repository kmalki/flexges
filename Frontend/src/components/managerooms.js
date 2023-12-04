import React, { useState, useEffect, Fragment } from 'react';
import '../App.css';
import AuthService from '../services/auth-service';
import firebase from './firebase';
import axios from 'axios';

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
  EuiSpacer,
  EuiFlexGroup,
  EuiFlexItem,
  EuiButton,
  EuiModal,
  EuiModalBody,
  EuiModalFooter,
  EuiModalHeader,
  EuiModalHeaderTitle,
  EuiOverlayMask,
  EuiFieldText,
  EuiForm,
  EuiFormRow,
  EuiFieldNumber,
  EuiButtonEmpty,
  EuiConfirmModal,
  EuiGlobalToastList,
} from '@elastic/eui';

export default function ManageRooms() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [roomToDelete, setRoomToDelete] = useState(null);

  const ref = firebase
    .firestore()
    .collection('rooms')
    .where('enterprise', '==',  localStorage.getItem('flexGESenterprise'));

  function getRooms() {
    setLoading(true);
    ref.onSnapshot((querySnapshot) => {
      const items = [];
      querySnapshot.forEach((doc) => {
        items.push(doc.data());
      });
      console.log(items);
      setRooms(items);
      setLoading(false);
    });
  }

  useEffect(() => {
    getRooms();
  }, []);

  const errorMessage =
    'Le nom de la salle ne peut pas contenir de caractères spéciaux et la capacité doit être un nombre positif !';

  const [isError, setIsError] = useState(false);

  function checkEditSite(value) {
    if (!/^[a-zA-Z0-9 ]*$/.test(value)) {
      return false;
    } else {
      return true;
    }
  }

  function isPositiveInteger(n) {
    return n >>> 0 === parseFloat(n);
  }

  const [nameRoomEdit, setNameRoomEdit] = useState('');
  const [capacityRoomEdit, setCapacityRoomEdit] = useState('');
  const [roomEdit, setRoomEdit] = useState(null);

  const [nameNewRoom, setNameNewRoom] = useState('');
  const [capacityNewRoom, setCapacityNewRoom] = useState('');

  const [nameRoomToDestroy, setNameRoomToDestroy] = useState('');

  const deleteRoom = (room) => {
    setNameRoomToDestroy(room.name);
    setRoomToDelete(room);
    showDestroyModal(room);
    console.log('Delete :' + room);
  };

  const editRoom = (room) => {
    setIsError(false);
    showModal();
    setRoomEdit(room);
    setNameRoomEdit(room.name);
    setCapacityRoomEdit(room.capacity);
    console.log(room);
    /*const clone = JSON.parse(JSON.stringify(room));
    let newRoom = room;
    newRoom.name = nameRoomEdit;
    newRoom.capacity = capacityRoomEdit;*/
  };

  const createRoom = () => {
    setNameNewRoom('');
    setCapacityNewRoom('');
    setIsError(false);
    showModal2();
  };

  let actions = [
    {
      name: 'Editer',
      isPrimary: true,
      description: 'Modifier cette salle',
      icon: 'pencil',
      type: 'icon',
      onClick: (item) => {
        editRoom(item);
      },
      'data-test-subj': 'action-edit',
    },
    {
      name: 'Supprimer',
      description: 'Supprimer cette salle',
      icon: 'trash',
      color: 'danger',
      type: 'icon',
      onClick: (item) => {
        deleteRoom(item);
      },
      isPrimary: true,
      'data-test-subj': 'action-delete',
    },
  ];

  const search = {
    //onChange: onQueryChange,
    box: {
      incremental: true,
    },
  };

  const columns = [
    {
      field: 'name',
      name: 'Salle',
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
      field: 'capacity',
      name: 'Capacité',
      truncateText: true,
    },
    {
      name: 'Actions',
      actions,
    },
  ];

  const [isModalVisible, setIsModalVisible] = useState(false);

  const closeModalWithoutChangementAccepted = () => {
    setIsModalVisible(false);
    let elementsEuiOverlay = document.getElementsByClassName('euiOverlayMask');
    if (elementsEuiOverlay[0]) elementsEuiOverlay[0].remove();
    setCapacity('');
    setNameRoom('');
  };

  const closeModalWithChangementAccepted = () => {
    console.log(nameRoom);
    if (!checkEditSite(nameRoom)) {
      setIsError(true);
      return;
    }

    if (!isPositiveInteger(capacity)) {
      setIsError(true);
      return;
    }

    setIsModalVisible(false);
    let elementsEuiOverlay = document.getElementsByClassName('euiOverlayMask');
    if (elementsEuiOverlay[0]) elementsEuiOverlay[0].remove();
    console.log(capacity);
    console.log(nameRoom);
    console.log(roomEdit);
    let localRoomEdit = roomEdit;
    localRoomEdit.capacity = capacity;
    localRoomEdit.name = nameRoom;

    axios
    .post('http://localhost:8080/enterprise/updateRooms', [localRoomEdit])
    .then(
      (response) => {
        console.log(response);
        setRoomEdit(null);
        setToasts(toasts.concat(toastsList[0]));
        //window.location.reload();
      },
      (error) => {
        console.log(error);
        setRoomEdit(null);
        setToasts(toasts.concat(toastsList[1]));
      }
    );
  };

  const [isModalVisible2, setIsModalVisible2] = useState(false);

  const closeModalWithoutChangementAccepted2 = () => {
    setIsModalVisible2(false);
    let elementsEuiOverlay = document.getElementsByClassName('euiOverlayMask');
    if (elementsEuiOverlay[0]) elementsEuiOverlay[0].remove();
  };

  const closeModalWithChangementAccepted2 = () => {
    if (!checkEditSite(nameNewRoom)) {
      setIsError(true);
      return;
    }

    if (!isPositiveInteger(capacityNewRoom)) {
      setIsError(true);
      return;
    }

    setIsModalVisible2(false);
    let elementsEuiOverlay = document.getElementsByClassName('euiOverlayMask');
    if (elementsEuiOverlay[0]) elementsEuiOverlay[0].remove();

    console.log(nameNewRoom);
    console.log(capacityNewRoom);

    axios
      .post('http://localhost:8080/enterprise/createRoom', {
        enterprise: localStorage.getItem('flexGESenterprise'),
        name: nameNewRoom,
        capacity: capacityNewRoom,
      })
      .then(
        (response) => {
          console.log(response);
          setRoomToDelete(null);
          setToasts(toasts.concat(toastsList[0]));
        },
        (error) => {
          console.log(error);
          setRoomToDelete(null);
          setToasts(toasts.concat(toastsList[1]));
        }
      );
  };

  const showModal = () => setIsModalVisible(true);

  const showModal2 = () => setIsModalVisible2(true);

  const [capacity, setCapacity] = useState('');

  const onChangeCapacity = (e) => {
    const sanitizedValue = parseInt(e.target.value, 10);
    setCapacity(isNaN(sanitizedValue) ? '' : sanitizedValue);
  };

  const [nameRoom, setNameRoom] = useState('');

  const onChangeNameRoom = (e) => {
    setNameRoom(e.target.value);
  };

  const onChangeNameNewRoom = (e) => {
    setNameNewRoom(e.target.value);
  };

  const onChangeNewCapacity = (e) => {
    const sanitizedValue = parseInt(e.target.value, 10);
    setCapacityNewRoom(isNaN(sanitizedValue) ? '' : sanitizedValue);
  };

  const formSample = (
    <EuiForm isInvalid={isError} error={[errorMessage]}>
      <EuiFormRow label="Nom de la salle">
        <EuiFieldText
          placeholder={nameRoomEdit}
          value={nameRoom}
          onChange={(e) => onChangeNameRoom(e)}
          aria-label="Use aria labels when no actual label is in use"
        />
      </EuiFormRow>

      <EuiFormRow label="Capacité max de la salle">
        <EuiFieldNumber
          min={1}
          placeholder={capacityRoomEdit}
          value={capacity}
          onChange={(e) => onChangeCapacity(e)}
          aria-label="Use aria labels when no actual label is in use"
        />
      </EuiFormRow>
    </EuiForm>
  );

  const formSample2 = (
    <EuiForm isInvalid={isError} error={[errorMessage]}>
      <EuiFormRow label="Nom de la salle">
        <EuiFieldText
          placeholder={'Nom de la nouvelle salle'}
          value={nameNewRoom}
          onChange={(e) => onChangeNameNewRoom(e)}
          aria-label="Use aria labels when no actual label is in use"
        />
      </EuiFormRow>

      <EuiFormRow label="Capacité max de la salle">
        <EuiFieldNumber
          min={1}
          placeholder={'Capacité de la nouvelle salle'}
          value={capacityNewRoom}
          onChange={(e) => onChangeNewCapacity(e)}
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
            <EuiModalHeaderTitle>Modifier une salle</EuiModalHeaderTitle>
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
            <EuiModalHeaderTitle>Créer une salle</EuiModalHeaderTitle>
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

  const [isDestroyModalVisible, setIsDestroyModalVisible] = useState(false);

  const closeDestroyModal = () => {
    setIsDestroyModalVisible(false);
    let elementsEuiOverlay = document.getElementsByClassName('euiOverlayMask');
    if (elementsEuiOverlay[0]) elementsEuiOverlay[0].remove();
  };

  const closeDestroyModalAccepted = () => {
    axios
      .post('http://localhost:8080/enterprise/deleteRooms', [
        {
          id: roomToDelete.id,
          enterprise: roomToDelete.enterprise,
          name: roomToDelete.name,
          capacity: roomToDelete.capacity,
        },
      ])
      .then(
        (response) => {
          console.log(response);
          setRoomToDelete(null);
          setToasts(toasts.concat(toastsList[0]));
        },
        (error) => {
          console.log(error);
          setRoomToDelete(null);
          setToasts(toasts.concat(toastsList[1]));
        }
      );


    setIsDestroyModalVisible(false);
    let elementsEuiOverlay = document.getElementsByClassName('euiOverlayMask');
    if (elementsEuiOverlay[0]) elementsEuiOverlay[0].remove();
  };

  const showDestroyModal = () => setIsDestroyModalVisible(true);

  let destroyModal;

  if (isDestroyModalVisible) {
    destroyModal = (
      <EuiOverlayMask>
        <EuiConfirmModal
          title="Attention"
          onCancel={closeDestroyModal}
          onConfirm={closeDestroyModalAccepted}
          cancelButtonText="Non, je ne veux pas"
          confirmButtonText="Oui !"
          buttonColor="danger"
          defaultFocusedButton="confirm"
        >
          <p>
            Etes vous sûr de vouloir supprimer cette salle {nameRoomToDestroy} ?
          </p>
        </EuiConfirmModal>
      </EuiOverlayMask>
    );
  }

  const toastsList = [
    {
      id: '0',
      title: 'Succès',
      color: 'success',
      text: <p>Opération réussie !</p>,
    },
    {
      id: '1',
      title: 'Erreur',
      color: 'danger',
      iconType: 'help',
      text: (
        <p>
          Une erreur s'est produite vérifier votre connexion ou l'état du
          serveur (voir la console pour plus de détails)
        </p>
      ),
    },
  ];

  const [toasts, setToasts] = useState([]);

  const removeToast = (removedToast) => {
    setToasts(toasts.filter((toast) => toast.id !== removedToast.id));
  };

  if (AuthService.getCurrentUser()) {
    const isUserAdmin =
      JSON.parse(localStorage.getItem('flexGESadmin')) === true;
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
              <EuiPageContentBody>
                {modal}
                {modal2}
                {destroyModal}
                <EuiInMemoryTable
                  items={rooms}
                  columns={columns}
                  search={search}
                  sorting={true}
                />
                <EuiSpacer />
                <EuiFlexGroup justifyContent="spaceAround">
                  <EuiFlexItem grow={false}>
                    <EuiButton onClick={createRoom} iconType="plusInCircle">
                      Ajouter une nouvelle salle
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
