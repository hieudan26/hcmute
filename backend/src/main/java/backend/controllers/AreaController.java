package backend.controllers;

import backend.data.dto.global.BaseResponse;
import backend.services.AreaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.data.domain.Pageable;
import org.springframework.http.ResponseEntity;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@Slf4j
@RestController
@RequestMapping("areas")
@RequiredArgsConstructor
public class AreaController {
    private final AreaService areaService;
    @GetMapping("/countries")
    public ResponseEntity<BaseResponse> getCountries(Pageable pageable){
        return ResponseEntity.ok(areaService.findAllCountries(pageable));
    }

    @GetMapping("/countries/{id}")
    public ResponseEntity<BaseResponse> getCountry(@PathVariable("id") Integer id){
        return ResponseEntity.ok(areaService.findAllCountry(id));
    }

    @GetMapping("/countries/{id}/provinces")
    public ResponseEntity<BaseResponse> getProvincesByCountry(@PathVariable("id") Integer id){
        return ResponseEntity.ok(areaService.findAllProvincesByCountryId(id));
    }

    @GetMapping("/provinces")
    public ResponseEntity<BaseResponse> getProvinces(Pageable pageable){
        return ResponseEntity.ok(areaService.findAllProvinces(pageable));
    }

    @GetMapping("/provinces/{id}")
    public ResponseEntity<BaseResponse> getProvince(@PathVariable("id") Integer id){
        return ResponseEntity.ok(areaService.findAllProvince(id));
    }

    @GetMapping("/list/countries")
    public ResponseEntity<BaseResponse> getListCountries(Pageable pageable){
        return ResponseEntity.ok(areaService.listAllCountries(pageable));
    }

    @GetMapping("/list/countries/{id}/provinces")
    public ResponseEntity<BaseResponse> getListProvincesByCountry(@PathVariable("id") Integer id){
        return ResponseEntity.ok(areaService.listAllProvincesByCountryId(id));
    }

}
