package backend.data.dto.global;

import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;

import java.util.Optional;

public class SortedUnpaged implements Pageable {

    private final Sort sort;

    public SortedUnpaged(Sort sort) {
        this.sort = sort;
    }

    public static SortedUnpaged getInstance(Sort sort) {
        return new SortedUnpaged(sort);
    }

    public boolean isPaged() {
        return false;
    }

    @Override
    public boolean isUnpaged() {
        return Pageable.super.isUnpaged();
    }

    public Pageable previousOrFirst() {
        return this;
    }

    public Pageable next() {
        return this;
    }

    public boolean hasPrevious() {
        return false;
    }

    @Override
    public Optional<Pageable> toOptional() {
        return Pageable.super.toOptional();
    }

    public Sort getSort() {
        return sort;
    }

    @Override
    public Sort getSortOr(Sort sort) {
        return Pageable.super.getSortOr(sort);
    }

    public int getPageSize() {
        return -1;
    }

    public int getPageNumber() {
        return -1;
    }

    public long getOffset() {
        return -1;
    }

    public Pageable first() {
        return this;
    }

    @Override
    public Pageable withPage(int pageNumber) {
        return this;
    }
}
