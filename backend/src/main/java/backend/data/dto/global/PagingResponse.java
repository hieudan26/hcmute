package backend.data.dto.global;

import lombok.Data;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

import java.util.List;

@Data
public class PagingResponse<T> {
    List<T> content;
    CustomPageable pageable;

    public PagingResponse(Page<T> page) {
        this.content = page.getContent();
        this.pageable = new CustomPageable(page);
    }

    @Data
    class CustomPageable {
        int pageNumber;
        int PageSize;
        long totalItems;
        long totalPages;
        boolean hasPrevious ;
        boolean hasNext;

        public CustomPageable(Page page) {
            if(page.getPageable().isPaged()){
                this.pageNumber = page.getPageable().getPageNumber();
                this.PageSize = page.getPageable().getPageSize();
            }
            this.totalItems = page.getTotalElements();
            this.totalPages = page.getTotalPages();
            this.hasPrevious = page.hasPrevious();
            this.hasNext = page.hasNext();
        }
    }
}
