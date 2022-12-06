package backend.utils;

public class LinkUtils {
    public static String getLink(String name){
        return name.replace(" ","-").toLowerCase();
    }
    public static String getName(String link){
        return link.replace("-"," ").toLowerCase();
    }
}
