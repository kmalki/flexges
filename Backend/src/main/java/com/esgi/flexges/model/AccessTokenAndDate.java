package com.esgi.flexges.model;

import java.util.Date;

public class AccessTokenAndDate {
    private String token;
    private Date expirationDate;

    public AccessTokenAndDate(String token, Date expirationDate) {
        this.token = token;
        this.expirationDate = expirationDate;
    }

    public String getToken() {
        return token;
    }

    public Date getExpirationDate() {
        return expirationDate;
    }

    @Override
    public String toString() {
        return "AccessTokenAndDate{" +
                "token='" + token + '\'' +
                ", expirationDate=" + expirationDate +
                '}';
    }
}
