package fr.flexges.streaming;

public class PubsubMsg {
    private String enterpriseId;
    private String enterpriseName;
    private String roomName;
    private String event;
    private String roomId;
    private String email;
    private Long actionDate;

    public String getEnterpriseName() { return enterpriseName; }

    public void setEnterpriseName(String enterpriseName) { this.enterpriseName = enterpriseName; }

    public String getEnterpriseId() {
        return enterpriseId;
    }

    public void setEnterpriseId(String enterpriseId) {
        this.enterpriseId = enterpriseId;
    }

    public String getRoomName() {
        return roomName;
    }

    public void setRoomName(String roomName) {
        this.roomName = roomName;
    }

    public String getEvent() {
        return event;
    }

    public void setEvent(String event) {
        this.event = event;
    }

    public String getRoomId() {
        return roomId;
    }

    public void setRoomId(String roomId) {
        this.roomId = roomId;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public Long getActionDate() {
        return actionDate;
    }

    public void setActionDate(Long actionDate) {
        this.actionDate = actionDate;
    }

    @Override
    public String toString() {
        return "PubsubMsg{" +
                "enterpriseId='" + enterpriseId + '\'' +
                ", enterpriseName='" + enterpriseName + '\'' +
                ", roomName='" + roomName + '\'' +
                ", event='" + event + '\'' +
                ", roomId='" + roomId + '\'' +
                ", email='" + email + '\'' +
                ", actionDate=" + actionDate +
                '}';
    }
}
