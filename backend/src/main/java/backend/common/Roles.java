package backend.common;

public enum Roles {
    ADMIN("ADMIN"),
    USER("USER");

    public String getRoleName() {
        return roleName;
    }

    private final String roleName;
    Roles(String roleName) {
        this.roleName = roleName;
    }

}
