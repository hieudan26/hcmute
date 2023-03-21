package backend.common;

public enum Roles {
    ADMIN("ADMIN"),
    USER("USER"),
    ROLE_ADMIN("ROLE_ADMIN"),
    ROLE_USER("ROLE_USER");

    public String getRoleName() {
        return roleName;
    }

    private final String roleName;
    Roles(String roleName) {
        this.roleName = roleName;
    }

}
