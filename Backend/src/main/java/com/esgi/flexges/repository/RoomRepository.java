package com.esgi.flexges.repository;

import com.esgi.flexges.model.Enterprise;
import com.esgi.flexges.model.Room;
import com.esgi.flexges.model.UserApp;
import com.fasterxml.jackson.core.type.TypeReference;
import com.fasterxml.jackson.databind.ObjectMapper;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.Objects;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Repository
public class RoomRepository {

    @Autowired
    private Firestore firestore;

    private final Logger logger = LoggerFactory.getLogger(RoomRepository.class);


    public void addRooms(List<Room> rooms) {
        WriteBatch batch = firestore.batch();

        for(Room r : rooms){
            DocumentReference docRef = firestore.collection("rooms").document(r.getId());
            batch.set(docRef, r);
        }

        batch.commit();

        logger.info(String.valueOf(rooms.size()), "rooms added");
    }

    public List<Room> getUserRooms(String enterprise) throws ExecutionException, InterruptedException {
        ApiFuture<QuerySnapshot> future = firestore.collection("rooms").whereEqualTo("enterpriseId", enterprise).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();
        return documents.stream().map(r -> r.toObject(Room.class)).collect(Collectors.toList());
    }

    public void updateRooms(List<Room> rooms) throws ExecutionException, InterruptedException {
        WriteBatch batch = firestore.batch();

        ApiFuture<QuerySnapshot> future_get = firestore.collection("rooms")
                .whereIn("id", rooms.stream().map(Room::getId).collect(Collectors.toList())).get();

        List<QueryDocumentSnapshot> documents = future_get.get().getDocuments();

        logger.info("length" + documents.size());

        ObjectMapper mapper = new ObjectMapper();

        if(documents.isEmpty()){
            logger.info("No room found for this enterprise");
        }else{
            int n = 0;
            for (QueryDocumentSnapshot doc : documents) {
                for (Room r : rooms){
                    if(r.getId().equals(doc.getId())){
                        Map<String, Object> roomMap = mapper.convertValue(r, new TypeReference<Map<String, Object>>(){});
                        roomMap.remove("current");
                        roomMap.remove("id");
                        logger.info(roomMap.toString());
                        batch.update(doc.getReference(), roomMap);
//                        batch.set(doc.getReference(), r);
                        n+=1;
                        break;
                    }
                }
            }
            batch.commit();
            logger.info(n + "rooms updated");
        }
    }

    public void deleteRooms(List<Room> rooms) {
        WriteBatch batch = firestore.batch();

        for(Room r : rooms){
            DocumentReference roomRef = firestore.collection("rooms").document(r.getId());
            batch.delete(roomRef);
        }

        batch.commit();
        logger.info(String.valueOf(rooms.size()), "rooms deleted");

        }

    public void createRoom(Room room) {
        List<Room> rooms = new ArrayList<>();
        rooms.add(room);
        addRooms(rooms);
    }
}
