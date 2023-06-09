package backend.mapper;

import backend.common.ChatRoomType;
import backend.data.dto.socketdto.chat.ChatRoomResponse;
import backend.data.dto.socketdto.chat.MessagePayLoad;
import backend.data.dto.socketdto.chat.MessageResponse;
import backend.data.dto.socketdto.chat.RoomChatUserResponse;
import backend.data.dto.trip.RequestJoinTripResponse;
import backend.data.dto.trip.TripResponse;
import backend.data.entity.*;
import backend.exception.NoRecordFoundException;
import backend.repositories.ChatRoomRepository;
import backend.repositories.RequestJoinTripRepository;
import backend.repositories.UserRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;

import javax.persistence.EntityNotFoundException;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.List;
import java.util.Optional;
import java.util.Set;


@Mapper(componentModel = "spring", uses = {DateTimeMapper.class,UserMapper.class})
public abstract class RequestJoinTripMapper {
    @Mapping(source = "user", target = "user")
    @Mapping(source = "trip.id", target = "tripId")
    @Mapping(source = "date", target = "date", qualifiedByName = "fromLocalDateTimeToString")
    public abstract RequestJoinTripResponse requestJoinTripToRequestJoinTripResponse(RequestJoinTrip trip);
}
