package backend.mapper;

import backend.data.dto.area.listItem.AreaResponse;
import backend.data.entity.Areas;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;

@Mapper(componentModel = "spring")
public abstract class AreaMapper {
    @Mapping(target = "enName", source = "enName")
    public abstract AreaResponse CountriesToCountryResponse(Areas countries);
    public abstract AreaResponse ProvincesToProvinceResponse(Areas provinces);
}
