package com.esgi.flexges.repository;

import com.esgi.flexges.model.UserApp;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Objects;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Repository
public class UserRepository {

    @Autowired
    private Firestore firestore;

    private final Logger logger = LoggerFactory.getLogger(UserRepository.class);

    public void addUser(UserApp user) throws Exception {

        ApiFuture<DocumentSnapshot> future_get = firestore.collection("users").document(user.getEmail()).get();

        DocumentSnapshot doc = future_get.get();

        if(!doc.exists()){
            ApiFuture<WriteResult> future_insert = firestore.collection("users").document(user.getEmail()).set(user);
            logger.info("Document user insert time : " + future_insert.get().getUpdateTime());
        }
    }

    public void updateUser(UserApp user) throws Exception {
        ApiFuture<DocumentSnapshot> future_get = firestore.collection("users").document(user.getEmail()).get();
        DocumentReference doc = future_get.get().getReference();
        ApiFuture<WriteResult> future_insert = doc.update("password", user.getPassword());
        logger.info("Document user update time : " + future_insert.get().getUpdateTime());
    }

    public void updateUsersRights(List<UserApp> employees, boolean kick) throws ExecutionException, InterruptedException {

        WriteBatch batch = firestore.batch();

        for(UserApp emp : employees){
            ApiFuture<DocumentSnapshot> future = firestore.collection("users").document(emp.getEmail()).get();
            DocumentSnapshot document = future.get();

            if(document.exists()){
                if(kick){
                    batch.update(document.getReference(), "enterpriseId", null, "enterprise", null);
                }else{
                    batch.update(document.getReference(), "enterpriseId", emp.getEnterpriseId(), "enterprise", emp.getEnterprise());
                }
            }else{
                ApiFuture<WriteResult> future_insert = firestore.collection("users").document(emp.getEmail()).set(emp);
            }
        }

        batch.commit();
        logger.info(employees.size() + "user rights updated");

    }

    public UserApp findByEmail(String email) throws ExecutionException, InterruptedException {
        ApiFuture<DocumentSnapshot> future_get = firestore.collection("users").document(email).get();
        return future_get.get().toObject(UserApp.class);
    }

    public void updateEmployees(List<UserApp> employees) throws ExecutionException, InterruptedException {

        WriteBatch batch = firestore.batch();

        ApiFuture<QuerySnapshot> future = firestore.collection("users").whereIn("email", employees.stream().map(UserApp::getEmail).collect(Collectors.toList())).get();
        List<QueryDocumentSnapshot> documents = future.get().getDocuments();

        if(documents.isEmpty()){
            logger.info("No user found for this enterprise");
        }
        else {
            int n = 0;
            for (QueryDocumentSnapshot doc : documents) {
                for(UserApp e : employees){
                    if(e.getEmail().equals(Objects.requireNonNull(doc.get("email")).toString())){
                        batch.set(doc.getReference(), e);
                        n+=1;
                        break;
                    }
                }
            }
            batch.commit();
            logger.info(n + "employees updated");
        }
    }
}
