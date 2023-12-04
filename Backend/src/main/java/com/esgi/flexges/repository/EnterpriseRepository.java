package com.esgi.flexges.repository;

import com.esgi.flexges.model.Enterprise;
import com.esgi.flexges.model.Room;
import com.esgi.flexges.model.UserApp;
import com.google.api.core.ApiFuture;
import com.google.cloud.firestore.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Repository
public class EnterpriseRepository {

    @Autowired
    private Firestore firestore;

    private final Logger logger = LoggerFactory.getLogger(EnterpriseRepository.class);

    public void addEnterprise(Enterprise enterprise) throws Exception {

        ApiFuture<DocumentSnapshot> future_get = firestore.collection("enterprises").document(enterprise.getId()).get();

        DocumentSnapshot doc = future_get.get();

        if(doc.exists()){
            ApiFuture<WriteResult> future_insert = firestore.collection("enterprises")
                    .document(enterprise.getId()).set(enterprise);
            logger.info("Document enterprise already exists, updated : " + future_insert.get().getUpdateTime());

        }else{
            ApiFuture<WriteResult> future_insert = firestore.collection("enterprises")
                    .document(enterprise.getId()).set(enterprise);
            logger.info("Document enterprise insert time : " + future_insert.get().getUpdateTime());
        }
    }


    public List<UserApp> getEmployees(String enterpriseId) throws ExecutionException, InterruptedException {
//        logger.info(enterprise.getName());
        ApiFuture<DocumentSnapshot> future_get = firestore.collection("enterprises").document(enterpriseId).get();

        DocumentSnapshot doc = future_get.get();

        if(doc.exists()) {
            ApiFuture<QuerySnapshot> future_get_2 = firestore.collection("users").whereEqualTo("enterpriseId", doc.getId()).get();
            return future_get_2.get().toObjects(UserApp.class);
        }else{
            return null;
        }
    }
}
