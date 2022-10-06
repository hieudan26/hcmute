package backend.services;

import backend.data.dto.global.BaseResponse;
import backend.data.entity.Countries;
import backend.data.entity.Provinces;
import backend.data.entity.Users;
import backend.exception.NoRecordFoundException;
import backend.repositories.CountryRepository;
import backend.repositories.ProvinceRepository;
import backend.repositories.UserRepository;
import backend.utils.SearchSpecificationUtils;
import lombok.AllArgsConstructor;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
@AllArgsConstructor
public class AreaService{
    private CountryRepository countryRepository;
    private ProvinceRepository provinceRepository;

    public BaseResponse findAllCountries(Pageable pageable){
        return BaseResponse.builder().message("Find countries successful.")
                .data(countryRepository.findAll(pageable))
                .build();
    }

    public BaseResponse findAllCountry(Integer id){
        return BaseResponse.builder().message("Find countries successful.")
                .data(getCountry(id))
                .build();
    }

    public BaseResponse findAllProvinces(Pageable pageable){
        return BaseResponse.builder().message("Find provinces successful.")
                .data(provinceRepository.findAll(pageable))
                .build();
    }

    public BaseResponse findAllProvince(Integer id){
        return BaseResponse.builder().message("Find province successful.")
                .data(getProvince(id))
                .build();
    }

    public BaseResponse findAllProvincesByCountryId(Integer id){
        return BaseResponse.builder().message("Find provinces successful.")
                .data(getCountry(id).getProvinces())
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
