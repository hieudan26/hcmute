package backend.services;

import backend.data.entity.HashTags;
import backend.data.entity.Places;
import backend.data.entity.Users;
import backend.exception.InvalidRequestException;
import backend.exception.NoRecordFoundException;
import backend.repositories.HashtagRepository;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import javax.transaction.Transactional;
import java.util.ArrayList;
import java.util.List;
import java.util.Optional;
import java.util.Set;
import java.util.stream.Collectors;

@Service
@AllArgsConstructor
@Transactional(rollbackOn = InvalidRequestException.class)
public class HashTagService {
    private final HashtagRepository hashtagRepository;


    public  Set<HashTags> updateHashTag(List<String> names, Places place){
        Set<HashTags> hashTagsList = hashtagRepository.getByPlaces_Id(place.getId());
         List oldName = hashTagsList.stream().map(hashTags -> hashTags.getName()).toList();


        List deletedHashTag =
                hashTagsList.stream()
                        .filter(hashTags -> !names.contains(hashTags.getName()))
                        .toList();

        List newHashTag = names.stream()
                .filter(name -> !oldName.contains(name))
                .toList();

        hashTagsList.removeAll(deletedHashTag);
        hashTagsList.addAll(createNewHashTag(newHashTag,place));

        return hashTagsList;
    }

    public Set<HashTags> createNewHashTag(List<String> name, Places place){
        List<String> existed = name.stream().filter(item->isExistedInOtherPlace(item, place.getId())).toList();
        if(!existed.isEmpty()){
            throw new InvalidRequestException(String.join(" and ", existed) + " is exsited.");
        }
        return name.stream().map(item -> HashTags.builder()
                .name(item)
                .places(place).build()).collect(Collectors.toSet());
    }

    public void deletedHashTag(List<HashTags> hashTags){
        hashtagRepository.deleteAll(hashTags);
    }

    public Boolean isExistedInOtherPlace(String name,Integer idPlace){
        Optional<HashTags> hashTags = hashtagRepository.getByNameAndPlaces_IdNot(name,idPlace);
        if(hashTags.isEmpty())
            return false;
        return true;
    }

    public HashTags getHashTag(String name){
        Optional<HashTags> hashTags = hashtagRepository.findHashTagsByName(name);
        if(hashTags.isEmpty())
            throw new NoRecordFoundException(String.format("Can't find hashTag with name: %s.",name));
        return hashTags.get();
    }
}
