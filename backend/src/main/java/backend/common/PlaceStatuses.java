package backend.common;

public enum PlaceStatuses{
    PENDING("pending"),
    APPROVED("approved"),
    REJECTED("rejected");
    public String getStatus() {
        return status;
    }
    private final String status;
    PlaceStatuses(String status) {
        this.status = status;
    }
}
