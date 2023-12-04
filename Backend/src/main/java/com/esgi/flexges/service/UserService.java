package com.esgi.flexges.service;

import com.esgi.flexges.model.Login;
import com.esgi.flexges.model.UserApp;
import com.esgi.flexges.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.util.concurrent.ExecutionException;

@Service
public class UserService {

    final static Logger logger = LoggerFactory.getLogger(UserService.class);

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    public void createUser(UserApp user) throws Exception {
        if(userRepository.findByEmail(user.getEmail()) == null){
            userRepository.addUser(user);
        }
        else{
            userRepository.updateUser(user);
        }
    }

    public UserApp getUser(Login user) throws ExecutionException, InterruptedException {
        UserApp userApp = userRepository.findByEmail(user.getLogin());
        if(userApp != null){
            if(bCryptPasswordEncoder.matches(user.getPassword(), userApp.getPassword())){
                return userApp;
            }
        }
        return null;
    }

}
