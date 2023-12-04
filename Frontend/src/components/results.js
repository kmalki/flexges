import React, { useState, useEffect, Fragment } from 'react';
import '../App.css';
import AuthService from '../services/auth-service';
import firebase from './firebase';
import axios from 'axios';
import CustomProgressBar from './custom_progress_bar';

import {
  EuiPage,
  EuiPageBody,
  EuiPageContent,
  EuiPageContentBody,
  EuiTitle,
  EuiHeader,
  EuiHeaderSectionItem,
  EuiHeaderLogo,
  EuiHeaderLinks,
  EuiHeaderLink,
  EuiButton,
  EuiSpacer,
  EuiGlobalToastList,
  EuiFieldSearch,
  EuiFlexGroup,
  EuiFlexItem,
  EuiPanel,
  EuiSelect
} from '@elastic/eui';

export default function Results() {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [insideRoom, setInsideRoom] = useState(
    JSON.parse(localStorage.getItem('flexGESplaced'))
  );
  const [currentRoom, setCurrentRoom] = useState(null);
  const [toasts, setToasts] = useState([]);
  const [value, setValue] = useState('');
  const [isClearable, setIsClearable] = useState(true);
  const [option, setOption] = useState('nameasc');

  const removeToast = (removedToast) => {
    setToasts(toasts.filter((toast) => toast.id !== removedToast.id));
  };

  const isUserAdmin = JSON.parse(localStorage.getItem('flexGESadmin')) === true;
  const token =
    'ya29.c.Kp8BBgicUVN-yVkulHiFX5TGH8cIZ-Jj-7xCYKe1dfSjjrkeuER8md6dY0b87zUaubnevJlhfiAlyM3NM2yivWuFNdDkThXkyl6Fqv70-D6T5u-azzeIPAN22M-JdNBm0EzYl0iDIGh0wqRJ3uuGy37YvScwlVut0sLqoOvdS8Q07xKZ4fzt9A_J1Wfy_dIsQyYeorBU_X89lmFFYToR8RxH';
  const ref = firebase
    .firestore()
    .collection('rooms')
    .where('enterprise', '==', localStorage.getItem('flexGESenterprise'));

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

  const onChange = (e) => {
    setValue(e.target.value);
  };

  const onChangeSort = (e) => {
    setOption(e.target.value);
  };

  const options = [
    { value: 'nameasc', text: 'Nom asc' },
    { value: 'namedes', text: 'Nom desc' },
    { value: 'curasc', text: 'Personnes présentes asc' },
    { value: 'curdes', text: 'Personnes présentes desc' },
    { value: 'capasc', text: 'Capacité asc' },
    { value: 'capdes', text: 'Capacité desc' }
  ];

  useEffect(() => {
    getRooms();
  }, []);

  const enterRoom = (item) => {
    axios({
      url: 'https://pubsub.googleapis.com/v1/projects/projetannuel-309416/topics/projetannuel-309416-topic-firestore:publish',
      raw_url:
        'https://pubsub.googleapis.com/v1/projects/projetannuel-309416/topics/projetannuel-309416-topic-firestore:publish',
      method: 'post',
      headers: {
        Accept: '*/*',
        Authorization: 'Bearer ' + localStorage.getItem('flexGEStoken'),
        'Content-Type': 'application/json',
      },
      data: {
        messages: [
          {
            attributes: {
              enterpriseName: item.enterprise,
              roomName: item.name,
              event: 'ENTER',
              roomId: item.id,
              actionDate: Math.floor(new Date().getTime() / 1000).toString(),
              email: localStorage.getItem('flexGESemail'),
              enterpriseId: localStorage.getItem('flexGESenterpriseId')
            },
          },
        ],
      },
    }).then(
      (response) => {
        console.log(response);
        localStorage.setItem('flexGESplaced', true);
        setInsideRoom(true);
        setCurrentRoom(item);
        console.log(insideRoom);
        localStorage.setItem('flexGESroom', item.name);
        localStorage.setItem('flexGESroomId', item.id);
        localStorage.setItem('flexGEScurrentRoom', item);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  const exitRoom = () => {
    axios({
      url: 'https://pubsub.googleapis.com/v1/projects/projetannuel-309416/topics/projetannuel-309416-topic-firestore:publish',
      raw_url:
        'https://pubsub.googleapis.com/v1/projects/projetannuel-309416/topics/projetannuel-309416-topic-firestore:publish',
      method: 'post',
      headers: {
        Accept: '*/*',
        Authorization: 'Bearer ' + localStorage.getItem('flexGEStoken'),
        'Content-Type': 'application/json',
      },
      data: {
        messages: [
          {
            attributes: {
              enterpriseName: localStorage.getItem('flexGESenterprise'),
              roomName: localStorage.getItem('flexGESroom'),
              event: 'EXIT',
              roomId: localStorage.getItem('flexGESroomId'),
              actionDate: Math.floor(new Date().getTime() / 1000).toString(),
              email: localStorage.getItem('flexGESemail'),
              enterpriseId: localStorage.getItem('flexGESenterpriseId')
            },
          },
        ],
      },
    }).then(
      (response) => {
        console.log(response);
        localStorage.setItem('flexGESplaced', false);
        localStorage.removeItem('flexGESroom');
        setCurrentRoom(null);
        setInsideRoom(false);
      },
      (error) => {
        console.log(error);
      }
    );
  };

  async function chooseRoom(item) {
    if (item.current >= item.capacity) {
      setToasts(toasts.concat(toastsList[0]));
      return;
    }
    if (!AuthService.isTokenValid()) {
      await AuthService.getToken();
    }
    enterRoom(item);
    console.log(item);

  }

  async function leaveRoom() {
    console.log(insideRoom);
    if (!AuthService.isTokenValid()) {
      await AuthService.getToken();
    }
    exitRoom(currentRoom);
  }


  const toastsList = [
    {
      id: '0',
      title: 'Erreur',
      color: 'danger',
      iconType: 'help',
      text: (
        <p>
          La salle est pleine impossible de rejoindre !
        </p>
      ),
    },
  ];

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
          <EuiGlobalToastList
            toasts={toasts}
            dismissToast={removeToast}
            toastLifeTimeMs={4000}
          />
          <EuiPageBody component="div">
            <EuiPageContent>
              <EuiPageContentBody>
                {insideRoom ? (
                  <Fragment>
                    <p>Vous êtes actuellement dans la salle :</p>
                    <EuiSpacer />
                    <EuiTitle size="m">
                      <h3>{localStorage.getItem('flexGESroom')}</h3>
                    </EuiTitle>
                    <EuiSpacer />
                    <EuiButton onClick={() => leaveRoom()}>
                      Quitter la salle
                    </EuiButton>
                  </Fragment>
                ) : (
                  <Fragment>
                    <EuiTitle size="m">
                      <h2>Salles disponibles</h2>
                    </EuiTitle>
                    <EuiSpacer />
                    <EuiFlexGroup responsive={false}>
                      <EuiFlexItem grow={2}>
                        <EuiFieldSearch
                          placeholder="Search"
                          value={value}
                          onChange={(e) => onChange(e)}
                          isClearable={isClearable}
                          aria-label="Use aria labels when no actual label is in use"
                        />
                      </EuiFlexItem>
                      <EuiFlexItem grow={false}>
                        <EuiSelect style={{ maxWidth: 128 }}
                          id="selectDoc"
                          options={options}
                          value={option}
                          onChange={(e) => onChangeSort(e)}
                          aria-label="Use aria labels when no actual label is in use"
                        />
                      </EuiFlexItem>
                    </EuiFlexGroup>
                    <EuiSpacer />
                    {loading ? <h1>Loading...</h1> : null}
                    <EuiFlexGroup wrap>
                      {rooms
                        .sort((a, b) => {
                          switch (option) {
                            case 'nameasc':
                              return a.name.localeCompare(b.name);
                            case 'namedes':
                              return b.name.localeCompare(a.name);
                            case 'curasc':
                              return a.current - b.current;
                            case 'curdes':
                              return b.current - a.current;
                            case 'capasc':
                              return a.capacity - b.capacity;
                            case 'capdes':
                              return b.capacity - a.capacity;
                            default:
                              break;
                          }
                        })
                        .filter((room) => room.name.toLowerCase().includes(value.toLowerCase()))
                        .map((room) => (
                          <EuiFlexItem key={room.name} grow={true}>
                            <EuiPanel onClick={() => chooseRoom(room)} grow={true}>
                              <div>
                                <EuiFlexGroup direction="column">
                                  <EuiFlexItem>
                                    <div>
                                      <EuiTitle size="xs">
                                        <h4>{room.name}</h4>
                                      </EuiTitle>
                                    </div>
                                    <EuiSpacer />
                                  </EuiFlexItem>
                                  <EuiFlexItem>
                                    <EuiFlexGroup responsive={false} >
                                      <EuiFlexItem>Personnes présentes </EuiFlexItem>
                                      <EuiFlexItem> {room.current}</EuiFlexItem>
                                    </EuiFlexGroup>
                                    <EuiSpacer />
                                    <EuiFlexGroup responsive={false} >
                                      <EuiFlexItem>Capacité</EuiFlexItem>
                                      <EuiFlexItem>{room.capacity} </EuiFlexItem>
                                    </EuiFlexGroup>
                                  </EuiFlexItem>

                                </EuiFlexGroup>
                              </div>
                              <EuiSpacer />
                              <EuiFlexItem>
                                <CustomProgressBar value={room.current} max={room.capacity} />
                              </EuiFlexItem>
                            </EuiPanel>
                          </EuiFlexItem>
                        ))}
                    </EuiFlexGroup>
                  </Fragment>
                )}
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
