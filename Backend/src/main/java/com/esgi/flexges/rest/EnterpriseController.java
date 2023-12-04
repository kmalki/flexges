package com.esgi.flexges.rest;

import com.esgi.flexges.model.Enterprise;
import com.esgi.flexges.model.Room;
import com.esgi.flexges.model.UserApp;
import com.esgi.flexges.repository.UserRepository;
import com.esgi.flexges.service.EnterpriseService;
import com.esgi.flexges.service.UserService;
import com.fasterxml.jackson.databind.ObjectMapper;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;
import java.util.List;

@RestController
@RequestMapping("/enterprise")
public class EnterpriseController {

    final static Logger logger = LoggerFactory.getLogger(EnterpriseController.class);

    @Autowired
    private EnterpriseService enterpriseService;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private UserService userService;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @PostMapping("/addEnterprise")
    public Enterprise addEnterprise(@RequestParam("file") MultipartFile file, @RequestParam("json") String jsonEnterprise) throws Exception {
        Enterprise enterprise = new ObjectMapper().readValue(jsonEnterprise, Enterprise.class);
        enterprise.setAdminPassword(bCryptPasswordEncoder.encode(enterprise.getAdminPassword()));
        enterpriseService.configureEnterprise(file, enterprise);
        userService.createUser(new UserApp(enterprise.getAdminEmail(), enterprise.getAdminPassword(), enterprise.getName(), true, enterprise.getId()));
        return enterprise;
    }

    @PostMapping("/configureEnterprise")
    public ResponseEntity<String> configureEnterprise(@RequestParam("file") MultipartFile file, @RequestBody Enterprise enterprise) throws Exception {
        enterpriseService.configureEnterprise(file, enterprise);
        return ResponseEntity.status(HttpStatus.CREATED).body("ok");
    }

    @PostMapping("/getEmployees")
    public ResponseEntity<List<UserApp>> getEmployees(@RequestBody String enterpriseId) throws Exception {
        List<UserApp> employees = enterpriseService.getEmployees(enterpriseId);
        return ResponseEntity.status(HttpStatus.OK).body(employees);
    }

    @PostMapping("/addEmployees")
    public ResponseEntity<String> addEmployees(@RequestBody List<UserApp> users) throws Exception {
        enterpriseService.addEmployees(users);
        return ResponseEntity.status(HttpStatus.CREATED).body("ok");
    }

    @PostMapping("/updateEmployees")
    public ResponseEntity<String> updateEmployees(@RequestBody List<UserApp> users) throws Exception {
        enterpriseService.updateEmployees(users);
        return ResponseEntity.status(HttpStatus.OK).body("ok");
    }

    @PostMapping("/kickEmployees")
    public ResponseEntity<String> kickEmployees(@RequestBody List<UserApp> users) throws Exception {
        enterpriseService.kickEmployees(users);
        return ResponseEntity.status(HttpStatus.OK).body("ok");
    }

    @PostMapping("/createRoom")
    public ResponseEntity<String> createRoom(@RequestBody Room room){
        enterpriseService.createRoom(room);
        return ResponseEntity.status(HttpStatus.CREATED).body("ok");
    }

    @PostMapping("/updateRooms")
    public ResponseEntity<String> updateRooms(@RequestBody List<Room> rooms) throws Exception {
        enterpriseService.updateRooms(rooms);
        return ResponseEntity.status(HttpStatus.OK).body("ok");
    }

    @PostMapping("/deleteRooms")
    public ResponseEntity<String> deleteRooms(@RequestBody List<Room> rooms) {
        enterpriseService.deleteRooms(rooms);
        return ResponseEntity.status(HttpStatus.OK).body("ok");
    }
}
