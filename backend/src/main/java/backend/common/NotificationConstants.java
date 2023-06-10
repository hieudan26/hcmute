package backend.common;

public enum NotificationConstants {
    MESSAGE("message"),
    REQUEST_JOIN_TRIP("request_join_trip"),
    NOTIFICATION("notification"),
    POST("post"),
    REACT("react"),
    REPORT_OBSERVE("report_observe"),
    REPORT_ACTIVE("report_active"),
    REPORT_BANNED("report_banned"),
    COMMENT("comment"),
    COMMENT_REPLY("comment_reply"),

    PLACESTATUS("place_status");
    public String getStatus() {
        return status;
    }
    private final String status;
    NotificationConstants(String status) {
        this.status = status;
    }
}
