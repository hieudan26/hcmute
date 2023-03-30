package backend.common;

public enum NotificationConstants {
    MESSAGE("message"),
    NOTIFICATION("notification"),
    POST("post"),
    REACT("react"),
    COMMENT("comment"),
    PLACESTATUS("place_status");
    public String getStatus() {
        return status;
    }
    private final String status;
    NotificationConstants(String status) {
        this.status = status;
    }
}
