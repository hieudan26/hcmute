package backend.controllers;

import backend.data.dto.area.listItem.CreateCountryRequest;
import backend.data.dto.area.listItem.CreateProvinceRequest;
import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.services.AreaService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;

import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("areas")
@RequiredArgsConstructor
public class AreaController {
    private final AreaService areaService;
    @PreAuthorize("permitAll()")
    @GetMapping("/countries")
    public ResponseEntity<BaseResponse> getCountries(PagingRequest pagingRequest){
        return ResponseEntity.ok(areaService.findAllCountries(pagingRequest));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/countries/{id}")
    public ResponseEntity<BaseResponse> getCountry(@PathVariable("id") Integer id){
        return ResponseEntity.ok(areaService.findCountry(id));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/countries/{id}/provinces")
    public ResponseEntity<BaseResponse> getProvincesByCountry(@PathVariable("id") Integer id, PagingRequest pagingRequest){
        return ResponseEntity.ok(areaService.findAllProvincesByCountryId(id,pagingRequest));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/provinces")
    public ResponseEntity<BaseResponse> getProvinces(PagingRequest pagingRequest){
        return ResponseEntity.ok(areaService.findAllProvinces(pagingRequest));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/provinces/{id}")
    public ResponseEntity<BaseResponse> getProvince(@PathVariable("id") Integer id){
        return ResponseEntity.ok(areaService.findProvince(id));
    }

    @PreAuthorize("permitAll()")
    @PostMapping("/provinces")
    public ResponseEntity<BaseResponse> CreateProvince(@RequestBody CreateProvinceRequest request){
        return ResponseEntity.ok(areaService.createProvince(request));
    }

    @PreAuthorize("permitAll()")
    @PostMapping("/countries")
    public ResponseEntity<BaseResponse> dreateCountry(@RequestBody CreateCountryRequest request){
        return ResponseEntity.ok(areaService.createCountry(request));
    }

    @PreAuthorize("permitAll()")
    @DeleteMapping("/countries/{id}")
    public ResponseEntity<BaseResponse> deleteCountry(@PathVariable("id") Integer id){
        return ResponseEntity.ok(areaService.deleteCountry(id));
    }

    @PreAuthorize("permitAll()")
    @DeleteMapping("/provinces/{id}")
    public ResponseEntity<BaseResponse> deleteProvince(@PathVariable("id") Integer id){
        return ResponseEntity.ok(areaService.deleteProvince(id));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/list/countries")
    public ResponseEntity<BaseResponse> getListCountries(PagingRequest pagingRequest){
        return ResponseEntity.ok(areaService.listAllCountries(pagingRequest));
    }

    @PreAuthorize("permitAll()")
    @GetMapping("/list/countries/{id}/provinces")
    public ResponseEntity<BaseResponse> getListProvincesByCountry(@PathVariable("id") Integer id,PagingRequest pagingRequest){
        return ResponseEntity.ok(areaService.listAllProvincesByCountryId(id,pagingRequest));
    }

}
