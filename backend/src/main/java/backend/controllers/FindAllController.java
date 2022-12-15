package backend.controllers;

import backend.data.dto.FindQueryParams;
import backend.data.dto.area.listItem.CreateCountryRequest;
import backend.data.dto.area.listItem.CreateProvinceRequest;
import backend.data.dto.global.BaseResponse;
import backend.data.dto.global.PagingRequest;
import backend.services.AreaService;
import backend.services.FindService;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

@Slf4j
@RestController
@RequestMapping("/find")
@RequiredArgsConstructor
public class FindAllController {

    private final FindService findService;
    @PreAuthorize("permitAll()")
    @GetMapping("")
    public ResponseEntity<BaseResponse> find(PagingRequest pagingRequest, FindQueryParams params){
        return ResponseEntity.ok(findService.findAll(pagingRequest, params));
    }

}
