# Script de data generation de message pubsub qui seront gérés par Dataflow
# Basée sur des Users et Rooms créés en amont et en base dans Firestore
# Date d'entrée inclus dans la semaine du 28 juin ou du 5 juillet afin d'avoir des data dans la BI
# => dépend de quelle ligne est commentée 56 ou 59

from datetime import datetime
import random
from google.cloud import pubsub_v1, firestore
import time

db = firestore.Client()

publisher = pubsub_v1.PublisherClient()

topic_path = publisher.topic_path("projetannuel-309416", "projetannuel-309416-topic-firestore")


def addtime(heure: datetime):
    while True:
        time = heure + random.randrange(1800, 7200)
        date = datetime.fromtimestamp(time)
        if date.hour > 7:
            if date.hour < 20:
                return date


def createdate(a, b):
    while True:
        datecreate = datetime.fromtimestamp(random.randrange(a, b))
        if datecreate.hour > 7:
            if datecreate.hour < 19 or (datecreate.hour == 19 and datecreate.minute < 30):
                return datecreate


users = list(db.collection('users').stream())
rooms = list(db.collection('rooms').stream())


print("got data")
i = 0

while True:
    time.sleep(1)
    rand = random.randrange(0, len(users))
    email = users[rand].get("email")
    user = users[rand]
    enterpriseId = user.get("enterpriseId")
    enterpriseName = user.get("enterprise")
    roomsFiltered = [room for room in rooms if room.get("enterpriseId") == enterpriseId]
    room = rooms[random.randrange(0, len(rooms))]
    roomId = room.get("id")
    roomName = room.get("name")

    print("getting dateEnter ------------------")

    # date between 05-07-2021 00H and 09-07-2021 00H
    # dateEnter = createdate(1625443200, 1625875200)

    # date between 28-07-2021 00H and 03-07-2021 00H
    dateEnter = createdate(1624838400, 1625270400)

    print("getting dateExit -------------------")
    dateExit = addtime(dateEnter.timestamp())

    print("messages ---------------------------")
    print(dateEnter.timestamp(), dateExit.timestamp())

    future_enter = publisher.publish(topic_path, ''.encode("utf-8"), email=email, roomId=roomId, event="ENTER",
                                     actionDate=str(int(dateEnter.timestamp())), enterpriseId=enterpriseId,
                                     enterpriseName=enterpriseName, roomName=roomName).result()
    print("ENTER", enterpriseId, roomId, email, dateEnter)

    time.sleep(1)

    future_exit = publisher.publish(topic_path, ''.encode("utf-8"), email=email, roomId=roomId,
                                    event="EXIT", actionDate=str(int(dateExit.timestamp())), enterpriseId=enterpriseId,
                                    enterpriseName=enterpriseName, roomName=roomName).result()

    print("EXIT", enterpriseId, roomId, email, dateExit)

    i += 1

    print("NB MSG : ", i)
