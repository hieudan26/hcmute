FROM openjdk:17
ARG JAR_FILE=target/hcmute-backend.jar

COPY ${JAR_FILE} hcmute-backend.jar
ENTRYPOINT ["java","-jar","/hcmute-backend.jar"]