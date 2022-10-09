package backend.services;

import backend.data.dto.area.CountryResponse;
import backend.data.dto.area.ProvinceResponse;
import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.data.dto.global.PagingResponse;
import backend.data.entity.Countries;
import backend.data.entity.Provinces;
import backend.exception.NoRecordFoundException;
import backend.mapper.CountryMapper;
import backend.mapper.ProvinceMapper;
import backend.repositories.CountryRepository;
import backend.repositories.ProvinceRepository;
import backend.utils.PagingUtils;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Page;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class AreaService{
    private CountryRepository countryRepository;
    private ProvinceRepository provinceRepository;
    private CountryMapper countryMapper;
    private ProvinceMapper provinceMapper;


    public BaseResponse listAllCountries(PagingRequest pagingRequest){
        PagingResponse pagingResponse = new PagingResponse<CountryResponse>(
                countryRepository
                        .getCountryIdAndName(PagingUtils.getPageable(pagingRequest))
                        .map(countryMapper::CountriesToCountryResponse));

        return BaseResponse.builder().message("Find countries successful.")
                    .data(pagingResponse)
                    .build();
    }

    public BaseResponse listAllProvincesByCountryId(Integer id, PagingRequest pagingRequest){
        PagingResponse pagingResponse = new PagingResponse<ProvinceResponse>(
                provinceRepository
                        .getProvincesIdAndNameByCountryId(id,PagingUtils.getPageable(pagingRequest))
                        .map(provinceMapper::ProvincesToProvinceResponse));

        return BaseResponse.builder().message("Find provinces successful.")
                .data(pagingResponse)
                .build();
    }

    public BaseResponse findAllCountries(PagingRequest pagingRequest){
        PagingResponse pagingResponse = new PagingResponse<Countries>(
                countryRepository.findAll(PagingUtils.getPageable(pagingRequest)));

        return BaseResponse.builder().message("Find countries successful.")
                .data(pagingResponse)
                .build();
    }

    public BaseResponse findAllCountry(Integer id){
        return BaseResponse.builder().message("Find countries successful.")
                .data(getCountry(id))
                .build();
    }

    public BaseResponse findAllProvinces(PagingRequest pagingRequest){
        PagingResponse pagingResponse = new PagingResponse<Provinces>(
                provinceRepository.findAll(PagingUtils.getPageable(pagingRequest)));
        return BaseResponse.builder().message("Find provinces successful.")
                .data(pagingResponse)
                .build();
    }

    public BaseResponse findAllProvince(Integer id){
        return BaseResponse.builder().message("Find province successful.")
                .data(getProvince(id))
                .build();
    }

    public BaseResponse findAllProvincesByCountryId(Integer id, PagingRequest pagingRequest){
        PagingResponse pagingResponse = new PagingResponse<Provinces>(
                provinceRepository.findAllByCountryId(id,PagingUtils.getPageable(pagingRequest)));

        return BaseResponse.builder().message("Find provinces successful.")
                .data(pagingResponse)
                .build();
    }

    public Countries getCountry(Integer id){
        Optional<Countries> countries = countryRepository.findById(id);
        if(countries.isEmpty())
            throw new NoRecordFoundException(String.format("Can't find country with Id: %s.",id));
        return countries.get();
    }

    public Provinces getProvince(Integer id){
        Optional<Provinces> provinces = provinceRepository.findById(id);
        if(provinces.isEmpty())
            throw new NoRecordFoundException(String.format("Can't find province with Id: %s.",id));
        return provinces.get();
    }

}
