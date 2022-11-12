package backend.common;

public enum FriendStatuses {
    FRIEND("friend"),
    NO_FRIEND("no_friend"),
    INVITED("invited"),
    PENDING("pending"),
    BLOCKED("blocked"),
    BLOCKING("blocking");
    public String getStatus() {
        return status;
    }

    private final String status;
    FriendStatuses(String status) {
        this.status = status;
    }
}
