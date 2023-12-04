package com.esgi.flexges.model;

public class UserApp {

    private String email;
    private String password;
    private String enterprise;
    private String enterpriseId;
    private boolean admin;

    public UserApp() {
    }

    public UserApp(String email, String enterprise, boolean admin, String enterpriseId) {
        this.email = email;
        this.enterprise = enterprise;
        this.admin = admin;
        this.enterpriseId = enterpriseId;
    }

    public UserApp(String email, String password, String enterprise, boolean admin, String enterpriseId) {
        this.email = email;
        this.password = password;
        this.enterprise = enterprise;
        this.admin = admin;
        this.enterpriseId = enterpriseId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getPassword() {
        return password;
    }

    public void setPassword(String password) {
        this.password = password;
    }

    public String getEnterprise() {
        return enterprise;
    }

    public void setEnterprise(String enterprise) {
        this.enterprise = enterprise;
    }

    public void setAdmin(boolean admin) {
        this.admin = admin;
    }

    public boolean getAdmin() {
        return admin;
    }

    public String getEnterpriseId() {
        return enterpriseId;
    }

    public void setEnterpriseId(String enterpriseId) {
        this.enterpriseId = enterpriseId;
    }

    @Override
    public String toString() {
        return "UserApp{" +
                "email='" + email + '\'' +
                ", password='" + password + '\'' +
                ", enterprise='" + enterprise + '\'' +
                ", enterpriseId='" + enterpriseId + '\'' +
                ", admin=" + admin +
                '}';
    }
}