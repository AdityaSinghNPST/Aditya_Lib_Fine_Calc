package com.library.Aditya_Lib_Fine_Calc.common.dto;

import java.util.ArrayList;
import java.util.List;

public record PageResponse<T>(
        List<T> content,
        int totalPages,
        long totalElements,
        int number,
        int size
) {

    public static <T> PageResponse<T> of(
            List<T> items,
            int page,
            int size
    ) {

        long totalElements = items.size();

        int totalPages =
                size > 0
                        ? (int) Math.ceil(
                                (double) totalElements / size
                        )
                        : 0;

        int start = page * size;

        if (start >= items.size()) {

            return new PageResponse<>(
                    new ArrayList<>(),
                    totalPages,
                    totalElements,
                    page,
                    size
            );
        }

        int end =
                Math.min(
                        start + size,
                        items.size()
                );

        return new PageResponse<>(
                new ArrayList<>(
                        items.subList(
                                start,
                                end
                        )
                ),
                totalPages,
                totalElements,
                page,
                size
        );
    }
}
