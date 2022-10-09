package backend.utils;

import backend.data.dto.global.PagingRequest;
import backend.data.dto.global.SortedUnpaged;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;


public class PagingUtils {
    public static Pageable getPageable(PagingRequest pagingRequest){
        Sort sort = Sort.by(pagingRequest.getSortBy()).ascending();
        if(pagingRequest.getSortType().toUpperCase().equals("DESC"))
            sort = sort.descending();
        if(pagingRequest.getPageNumber() == -1)
            return new SortedUnpaged(sort);
        return PageRequest.of(pagingRequest.getPageNumber(), pagingRequest.getPageSize(),sort);
    }
}
