package backend.services;

import backend.common.AreaConstant;
import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.global.PagingResponse;
import backend.data.entity.Areas;
import backend.exception.NoRecordFoundException;
import backend.mapper.AreaMapper;
import backend.repositories.AreaRepository;
import backend.utils.PagingUtils;
import lombok.AllArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class AreaService{
    private AreaRepository areaRepository;

    private AreaMapper areaMapper;

    public BaseResponse listAllCountries(PagingRequest pagingRequest){
        PagingResponse pagingResponse = new PagingResponse(
                areaRepository.queryAreaListByType(PagingUtils.getPageable(pagingRequest), AreaConstant.COUNTRY.getTypeName())
                        .map(areaMapper::CountriesToCountryResponse));

        return BaseResponse.builder().message("Find countries successful.")
                    .data(pagingResponse)
                    .build();
    }

    public BaseResponse listAllProvincesByCountryId(Integer id, PagingRequest pagingRequest){
        PagingResponse pagingResponse = new PagingResponse(
                areaRepository
                        .queryProvincesListByCountryId(PagingUtils.getPageable(pagingRequest), id)
                        .map(areaMapper::ProvincesToProvinceResponse));

        return BaseResponse.builder().message("Find provinces successful.")
                .data(pagingResponse)
                .build();
    }

    public BaseResponse findAllCountries(PagingRequest pagingRequest){
        PagingResponse pagingResponse = new PagingResponse(
                areaRepository.queryAreaByType(PagingUtils.getPageable(pagingRequest), AreaConstant.COUNTRY.getTypeName()));

        return BaseResponse.builder().message("Find countries successful.")
                .data(pagingResponse)
                .build();
    }

    public BaseResponse findCountry(Integer id){
        return BaseResponse.builder().message("Find countries successful.")
                .data(getCountry(id))
                .build();
    }

    public BaseResponse findAllProvinces(PagingRequest pagingRequest){
        PagingResponse pagingResponse = new PagingResponse(
                areaRepository.queryAreaByType(PagingUtils.getPageable(pagingRequest), AreaConstant.PROVINCE.getTypeName()));

        return BaseResponse.builder().message("Find provinces successful.")
                .data(pagingResponse)
                .build();
    }

    public BaseResponse findProvince(Integer id){
        return BaseResponse.builder().message("Find province successful.")
                .data(getProvince(id))
                .build();
    }

    public BaseResponse findAllProvincesByCountryId(Integer id, PagingRequest pagingRequest){
        PagingResponse pagingResponse = new PagingResponse(
                areaRepository.queryProvincesByCountryId(PagingUtils.getPageable(pagingRequest),id));

        return BaseResponse.builder().message("Find provinces successful.")
                .data(pagingResponse)
                .build();
    }

    public Areas getCountry(Integer id){
        Optional<Areas> country = areaRepository.queryAreaByTypeAndId(AreaConstant.COUNTRY.getTypeName(),id);
        if(country.isEmpty())
            throw new NoRecordFoundException(String.format("Can't find country with Id: %s.",id));
        return country.get();
    }

    public Areas getProvince(Integer id){
        Optional<Areas> province = areaRepository.queryAreaByTypeAndId(AreaConstant.PROVINCE.getTypeName(),id);
        if(province.isEmpty())
            throw new NoRecordFoundException(String.format("Can't find province with Id: %s.",id));
        return province.get();
    }

}
