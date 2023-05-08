package backend.mapper;

import backend.data.dto.trip.AddTripMemberRequest;
import backend.data.dto.trip.TripMemberDTO;
import backend.data.entity.TripMembers;
import backend.data.entity.Trips;
import backend.data.entity.Users;
import backend.exception.NoRecordFoundException;
import backend.repositories.TripRepository;
import backend.repositories.UserRepository;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.springframework.beans.factory.annotation.Autowired;

import javax.persistence.EntityNotFoundException;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public abstract class TripMemberMapper {
    @Autowired
    private UserRepository userRepository;
    @Autowired
    private TripRepository tripRepository;

    @Mapping(source = "user.id", target = "userId")
    @Mapping(source = "trip.id", target = "tripId")
    public abstract TripMemberDTO tripMemberToTripMemberDTO(TripMembers tripMember);

    public List<TripMemberDTO> tripMembersToTripMemberDTOs(List<TripMembers> tripMembers) {
        if(tripMembers == null) {
            return List.of();
        }
        return tripMembers.stream()
                .map(this::tripMemberToTripMemberDTO)
                .collect(Collectors.toList());
    }

    @Mapping(source = "userId", target = "user", qualifiedByName = "fromStringToUsers")
    public abstract TripMembers addTripMemberToTripMembers(AddTripMemberRequest addTripMemberRequest);

    @Named("fromStringToUsers")
    protected Users fromStringToUsers(String userId) throws EntityNotFoundException {
        Optional<Users> optionalUsers = userRepository.findByIdAndIsDisableIsFalse(userId);
        if(optionalUsers.isEmpty()){
            throw new NoRecordFoundException(String.format("Can't find user with Id: %s.",userId));
        }
        return optionalUsers.get();
    }

}
