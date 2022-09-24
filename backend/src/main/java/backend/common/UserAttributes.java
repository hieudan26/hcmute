package backend.common;

public enum UserAttributes {
    IS_FIRST_LOGIN("custom:is_first_login");

    public String getAttributeName() {
        return attributeName;
    }

    private final String attributeName;

    UserAttributes(String attributeName) {
        this.attributeName = attributeName;
    }
}
