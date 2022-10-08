package backend.mapper;

import backend.data.dto.area.CountryResponse;
import backend.data.entity.Countries;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface CountryMapper {
    @Mapping(target = "enName", source = "enName")
    CountryResponse CountriesToCountryResponse(Countries countries);
}
