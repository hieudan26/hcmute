package backend.mapper;

import backend.data.dto.area.CountryResponse;
import backend.data.entity.Countries;
import org.mapstruct.*;

@Mapper(componentModel = "spring")
public interface CountryMapper {
    CountryResponse CountriesToCountryResponse(Countries countries);
}
