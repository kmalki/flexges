package com.esgi.flexges.rest;


import com.esgi.flexges.model.AccessTokenAndDate;
import com.esgi.flexges.model.Login;
import com.esgi.flexges.model.Room;
import com.esgi.flexges.model.UserApp;
import com.esgi.flexges.service.RoomService;
import com.esgi.flexges.service.UserService;
import com.google.auth.oauth2.AccessToken;
import com.google.auth.oauth2.GoogleCredentials;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;

import java.io.FileInputStream;
import java.io.IOException;
import java.util.List;
import java.util.concurrent.ExecutionException;

@RestController
@RequestMapping("/users")
public class UserController {

    final static Logger logger = LoggerFactory.getLogger(UserController.class);

    @Autowired
    private UserService userService;

    @Autowired
    private RoomService roomService;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @PostMapping("/sign-up")
    public ResponseEntity<String> signUp(@RequestBody UserApp user) throws Exception {
        user.setPassword(bCryptPasswordEncoder.encode(user.getPassword()));
        userService.createUser(user);
        return ResponseEntity.status(HttpStatus.CREATED).body(
                "ok");
    }

    @PostMapping("/login")
    public ResponseEntity<UserApp> login(@RequestBody Login user) throws Exception {
        UserApp userApp = userService.getUser(user);
        if(userApp!=null) {
            return ResponseEntity.status(HttpStatus.OK).body(userApp);
        }
        else{
            return ResponseEntity.status(HttpStatus.FORBIDDEN).body(new UserApp());
        }
    }

    @PostMapping("/getRooms")
    public ResponseEntity<List<Room>> getRooms(@RequestBody UserApp user) throws ExecutionException, InterruptedException {
        List<Room> rooms = roomService.getRooms(user.getEnterpriseId());
        return ResponseEntity.status(HttpStatus.OK).body(rooms);
    }

    @GetMapping("/getAccessToken")
    public AccessTokenAndDate getAccessToken() throws IOException {
        GoogleCredentials googleCredentials = GoogleCredentials.
                fromStream(new FileInputStream("C:\\Users\\kamel\\Desktop\\PA5\\flexges\\src\\main\\resources\\satest.json"))
                .createScoped("https://www.googleapis.com/auth/cloud-platform");

        AccessToken token = googleCredentials.refreshAccessToken();
        logger.info(token.getTokenValue());
        logger.info(token.getExpirationTime().toString());
        return new AccessTokenAndDate(token.getTokenValue(), token.getExpirationTime());
    }
}
