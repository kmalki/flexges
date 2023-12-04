package com.esgi.flexges.model;

import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class Room {

    private String enterprise;
    private String enterpriseId;
    private String name;
    private int capacity;
    private int current = 0;
    private String id = UUID.randomUUID().toString();

    public Room() {
    }

    public Room(String enterprise, String name, int capacity) {
        this.enterprise = enterprise;
        this.name = name;
        this.capacity = capacity;
    }

    public String getEnterprise() {
        return enterprise;
    }

    public void setEnterprise(String enterprise) {
        this.enterprise = enterprise;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getCurrent() {
        return current;
    }

    public void setCurrent(int current) {
        this.current = current;
    }

    public int getCapacity() {
        return capacity;
    }

    public void setCapacity(int capacity) {
        this.capacity = capacity;
    }

    public String getId() {
        return id;
    }

    public void setId(String id) {
        this.id = id;
    }

    public String getEnterpriseId() {
        return enterpriseId;
    }

    public void setEnterpriseId(String enterpriseId) {
        this.enterpriseId = enterpriseId;
    }

    @Override
    public String toString() {
        return "Room{" +
                "enterprise='" + enterprise + '\'' +
                ", enterpriseId='" + enterpriseId + '\'' +
                ", name='" + name + '\'' +
                ", capacity=" + capacity +
                ", current=" + current +
                ", id='" + id + '\'' +
                '}';
    }
}
