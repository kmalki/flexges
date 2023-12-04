package com.esgi.flexges.service;

import com.esgi.flexges.model.Enterprise;
import com.esgi.flexges.model.Room;
import com.esgi.flexges.model.UserApp;
import com.esgi.flexges.repository.EnterpriseRepository;
import com.esgi.flexges.repository.RoomRepository;
import com.esgi.flexges.repository.UserRepository;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellType;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.ss.usermodel.Sheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.util.ArrayList;
import java.util.List;
import java.util.concurrent.ExecutionException;
import java.util.stream.Collectors;

@Service
public class EnterpriseService {

    private final Logger logger = LoggerFactory.getLogger(EnterpriseService.class);

    @Autowired
    private BCryptPasswordEncoder bCryptPasswordEncoder;

    @Autowired
    private EnterpriseRepository enterpriseRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private RoomRepository roomRepository;

//    public void createEnterprise(Enterprise enterprise) throws Exception {
//        enterpriseRepository.addEnterprise(enterprise);
//    }

    public void configureEnterprise(MultipartFile file, Enterprise enterprise) throws Exception {
        List<Room> rooms = new ArrayList<>();
        XSSFWorkbook workbook = new XSSFWorkbook(file.getInputStream());
        Sheet sheet = workbook.getSheetAt(0);
        Room tempRoom;
        boolean passHeader = false;
        for (Row currentRow : sheet) {
            if(!passHeader){
                passHeader = true;
                continue;
            }
            tempRoom = new Room();
            for (Cell currentCell : currentRow) {
                if (currentCell.getCellType() == CellType.STRING) {
                    tempRoom.setName(currentCell.getStringCellValue());
                } else if (currentCell.getCellType() == CellType.NUMERIC) {
                    tempRoom.setCapacity((int) currentCell.getNumericCellValue());
                }
            }
            tempRoom.setEnterprise(enterprise.getName());
            tempRoom.setEnterpriseId(enterprise.getId());
            rooms.add(tempRoom);
        }
        Sheet sheet2 = workbook.getSheetAt(1);
        passHeader = false;
        List<UserApp> employees = new ArrayList<>();
        for (Row currentRow : sheet2) {
            if(!passHeader){
                passHeader = true;
                continue;
            }
            int i = 0;
            UserApp employee = new UserApp();
            employee.setEnterprise(enterprise.getName());
            employee.setEnterpriseId(enterprise.getId());

            for (Cell currentCell : currentRow) {
                if(currentCell.getColumnIndex()==0){
                    employee.setEmail(currentCell.getStringCellValue());
                }else if(currentCell.getColumnIndex()==1){
                    employee.setAdmin(currentCell.getStringCellValue().equalsIgnoreCase("yes"));
                }
            }
            employees.add(employee);
        }

        userRepository.updateUsersRights(employees, false);
        enterpriseRepository.addEnterprise(enterprise);
        roomRepository.addRooms(rooms);
    }


    public List<UserApp> getEmployees(String enterpriseId) throws ExecutionException, InterruptedException {
        return enterpriseRepository.getEmployees(enterpriseId);
    }

    public void addEmployees(List<UserApp> users) throws Exception {
        for(UserApp us : users){
            us.setPassword(bCryptPasswordEncoder.encode(us.getPassword()));
            userRepository.addUser(us);
        }
        userRepository.updateUsersRights(users, false);
    }

    public void updateEmployees(List<UserApp> users) throws ExecutionException, InterruptedException {
        userRepository.updateEmployees(users);
    }


    public void kickEmployees(List<UserApp> users) throws ExecutionException, InterruptedException {
        userRepository.updateUsersRights(users, true);
    }

    public void updateRooms(List<Room> rooms) throws ExecutionException, InterruptedException {
        roomRepository.updateRooms(rooms);
    }

    public void deleteRooms(List<Room> rooms) {
        roomRepository.deleteRooms(rooms);
    }

    public void createRoom(Room room) {
        roomRepository.createRoom(room);
    }
}
