package backend.common;

public enum AreaConstant {
    COUNTRY("country"),
    PROVINCE("province");

    public String getTypeName() {
        return type;
    }

    private final String type;
    AreaConstant(String type) {
        this.type = type;
    }
}
