package backend.mapper;

import backend.data.dto.area.listItem.AreaResponse;
import backend.data.entity.Areas;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public interface AreaMapper {
    @Mapping(target = "enName", source = "enName")
    AreaResponse CountriesToCountryResponse(Areas countries);
    AreaResponse ProvincesToProvinceResponse(Areas provinces);
}
