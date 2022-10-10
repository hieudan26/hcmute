package backend.mapper;

import backend.data.dto.area.ProvinceResponse;
import backend.data.entity.Provinces;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface ProvinceMapper {
    ProvinceResponse ProvincesToProvinceResponse(Provinces provinces);
}
