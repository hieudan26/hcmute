package backend.common;

public enum NotificationConstants {
    MESSAGE("message"),
    RIP_REQUEST_OWNER("trip_request_owner"),
    RIP_REQUEST_REJECTED("trip_request_rejected"),
    RIP_REQUEST_APPROVED("trip_request_approved"),

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
