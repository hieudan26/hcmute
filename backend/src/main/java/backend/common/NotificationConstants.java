package backend.common;

public enum NotificationConstants {
    MESSAGE("message"),
    POST("post"),
    REACT("react"),
    PLACESTATUS("place_status");
    public String getStatus() {
        return status;
    }
    private final String status;
    NotificationConstants(String status) {
        this.status = status;
    }
}
