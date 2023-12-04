package com.esgi.flexges.service;

import com.esgi.flexges.model.Room;
import com.esgi.flexges.repository.RoomRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.concurrent.ExecutionException;

@Service
public class RoomService {

    final static Logger logger = LoggerFactory.getLogger(RoomService.class);

    @Autowired
    private RoomRepository roomRepository;

    public List<Room> getRooms(String enterprise) throws ExecutionException, InterruptedException {
        return roomRepository.getUserRooms(enterprise);
    }
}
